import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { AuthenticatedRequest } from "../common/authenticated-request";

@Controller("audit")
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest, @Query("entityType") entityType?: string) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId: req.user.tenantId,
        entityType: entityType || undefined
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
