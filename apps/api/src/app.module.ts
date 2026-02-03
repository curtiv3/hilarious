import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./config/env";
import { AuthModule } from "./modules/auth/auth.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { UsersModule } from "./modules/users/users.module";
import { ExperimentsModule } from "./modules/experiments/experiments.module";
import { AuditModule } from "./modules/audit/audit.module";
import { RevenueModule } from "./modules/revenue/revenue.module";
import { SourcesModule } from "./modules/sources/sources.module";
import { HealthController } from "./modules/health/health.controller";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuditLogInterceptor } from "./common/interceptors/audit-log.interceptor";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config)
    }),
    AuthModule,
    TenantsModule,
    UsersModule,
    ExperimentsModule,
    RevenueModule,
    SourcesModule,
    AuditModule
  ],
  controllers: [HealthController],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor
    }
  ]
})
export class AppModule {}
