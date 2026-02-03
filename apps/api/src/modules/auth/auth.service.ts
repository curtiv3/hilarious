import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "../../prisma/prisma.service";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, isActive: true },
      include: { tenant: true }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      tenant_id: user.tenantId,
      role: user.role,
      email: user.email
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: ACCESS_TTL,
      secret: process.env.JWT_SECRET
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: REFRESH_TTL,
      secret: process.env.JWT_REFRESH_SECRET
    });

    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash, lastLoginAt: new Date() }
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });
      if (!user?.refreshTokenHash) {
        throw new UnauthorizedException("Invalid refresh token");
      }
      const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
      if (!valid) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newPayload = {
        sub: user.id,
        tenant_id: user.tenantId,
        role: user.role,
        email: user.email
      };
      const accessToken = await this.jwt.signAsync(newPayload, {
        expiresIn: ACCESS_TTL,
        secret: process.env.JWT_SECRET
      });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });
  }
}
