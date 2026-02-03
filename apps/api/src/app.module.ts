import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TenantsModule } from "./tenants/tenants.module";
import { UsersModule } from "./users/users.module";
import { ExperimentsModule } from "./experiments/experiments.module";
import { AuditModule } from "./audit/audit.module";
import { RevenueModule } from "./revenue/revenue.module";
import { SourcesModule } from "./sources/sources.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TenantsModule,
    UsersModule,
    ExperimentsModule,
    RevenueModule,
    SourcesModule,
    AuditModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
