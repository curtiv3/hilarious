import { Module } from "@nestjs/common";
import { SourcesController } from "./sources.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

@Module({
  controllers: [SourcesController],
  providers: [PrismaService, JwtService, JwtAuthGuard]
})
export class SourcesModule {}
