import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

@Module({
  controllers: [UsersController],
  providers: [PrismaService, JwtService, RolesGuard, JwtAuthGuard]
})
export class UsersModule {}
