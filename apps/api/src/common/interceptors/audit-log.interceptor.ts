import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const method = request.method?.toUpperCase();
    const isMutation = ["POST", "PATCH", "DELETE"].includes(method);
    if (!isMutation) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (result) => {
        const tenantId = request.user?.tenantId || request.tenantId;
        if (!tenantId) {
          return;
        }
        const entityId = (result as { id?: string } | undefined)?.id ?? "unknown";
        await this.prisma.auditLog.create({
          data: {
            tenantId,
            actorUserId: request.user?.id ?? null,
            action: method,
            entityType: request.route?.path ?? request.originalUrl,
            entityId,
            ip: request.ip,
            userAgent: request.headers["user-agent"] ?? null,
            diffJson: JSON.stringify({ payload: request.body })
          }
        });
      })
    );
  }
}
