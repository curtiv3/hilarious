import { Module } from "@nestjs/common";
import { ExperimentsController } from "./experiments.controller";
import { ExperimentsService } from "./experiments.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

@Module({
  controllers: [ExperimentsController],
  providers: [ExperimentsService, PrismaService, JwtService, JwtAuthGuard]
})
export class ExperimentsModule {}
