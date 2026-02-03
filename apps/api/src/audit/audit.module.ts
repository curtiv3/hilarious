import { Module } from "@nestjs/common";
import { AuditController } from "./audit.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

@Module({
  controllers: [AuditController],
  providers: [PrismaService, JwtService, JwtAuthGuard]
})
export class AuditModule {}
