import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { AuthenticatedRequest } from "../common/authenticated-request";

@Controller("sources")
@UseGuards(JwtAuthGuard)
export class SourcesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return this.prisma.dataSource.findMany({ where: { tenantId: req.user.tenantId } });
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() body: { type: string; name: string; config_json: string; status: string }) {
    return this.prisma.dataSource.create({
      data: {
        tenantId: req.user.tenantId,
        type: body.type as any,
        name: body.name,
        configJson: body.config_json,
        status: body.status
      }
    });
  }

  @Patch(":id")
  async update(@Req() req: AuthenticatedRequest, @Param("id") id: string, @Body() body: { status?: string }) {
    return this.prisma.dataSource.update({
      where: { id, tenantId: req.user.tenantId },
      data: { status: body.status }
    });
  }

  @Post(":id/test-connection")
  async testConnection() {
    return { ok: true };
  }
}
