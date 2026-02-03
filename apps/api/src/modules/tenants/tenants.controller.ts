import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTenantDto, UpdateTenantDto } from "./tenants.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthenticatedRequest } from "../../common/tenancy/authenticated-request";

@Controller("admin/tenants")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPERADMIN")
export class TenantsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.tenant.findMany();
  }

  @Post()
  async create(@Body() dto: CreateTenantDto) {
    return this.prisma.tenant.create({ data: dto });
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTenantDto) {
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }

  @Post(":id/impersonate")
  async impersonate(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    return { success: true, tenantId: id, actorId: req.user.id };
  }
}
