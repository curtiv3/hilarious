import { Module } from "@nestjs/common";
import { RevenueController } from "./revenue.controller";
import { StripeWebhookController } from "./stripe.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@Module({
  controllers: [RevenueController, StripeWebhookController],
  providers: [PrismaService, JwtService, JwtAuthGuard]
})
export class RevenueModule {}
