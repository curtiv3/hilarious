import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { AuthenticatedRequest } from "../common/authenticated-request";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import * as argon2 from "argon2";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("OWNER", "ADMIN")
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return this.prisma.user.findMany({ where: { tenantId: req.user.tenantId } });
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateUserDto) {
    const passwordHash = await argon2.hash(dto.password);
    return this.prisma.user.create({
      data: {
        tenantId: req.user.tenantId,
        email: dto.email,
        passwordHash,
        role: dto.role
      }
    });
  }

  @Patch(":id")
  async update(@Req() req: AuthenticatedRequest, @Param("id") id: string, @Body() dto: UpdateUserDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      data.passwordHash = await argon2.hash(dto.password);
      delete data.password;
    }
    return this.prisma.user.update({
      where: { id, tenantId: req.user.tenantId },
      data
    });
  }

  @Post(":id/reset-password")
  async resetPassword(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const tempPassword = "ChangeMe123!";
    const passwordHash = await argon2.hash(tempPassword);
    await this.prisma.user.update({
      where: { id, tenantId: req.user.tenantId },
      data: { passwordHash }
    });
    return { tempPassword };
  }
}
