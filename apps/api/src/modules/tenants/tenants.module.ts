import { Module } from "@nestjs/common";
import { TenantsController } from "./tenants.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "../../common/guards/roles.guard";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@Module({
  controllers: [TenantsController],
  providers: [PrismaService, JwtService, RolesGuard, JwtAuthGuard]
})
export class TenantsModule {}
