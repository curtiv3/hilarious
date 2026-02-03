import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization as string | undefined;
    if (!header) {
      throw new UnauthorizedException("Missing authorization header");
    }
    const token = header.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedException("Missing token");
    }
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      request.user = {
        id: payload.sub,
        tenantId: payload.tenant_id,
        role: payload.role,
        email: payload.email
      };
      request.tenantId = payload.tenant_id;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
