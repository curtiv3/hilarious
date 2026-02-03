import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { parse } from "csv-parse/sync";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "../../common/tenancy/authenticated-request";
import { revenueCsvSchema } from "@hilarious/shared";
import type { Express } from "express";

@Controller("revenue")
@UseGuards(JwtAuthGuard)
export class RevenueController {
  constructor(private prisma: PrismaService) {}

  @Post("events")
  async create(@Req() req: AuthenticatedRequest, @Body() body: { occurred_at: string; subject_id: string; amount_cents: number; currency: string; event_type: string; external_id?: string }) {
    return this.prisma.revenueEvent.create({
      data: {
        tenantId: req.user.tenantId,
        occurredAt: new Date(body.occurred_at),
        subjectType: "user",
        subjectId: body.subject_id,
        amountCents: body.amount_cents,
        currency: body.currency,
        eventType: body.event_type as any,
        externalId: body.external_id,
        rawJson: JSON.stringify(body)
      }
    });
  }

  @Get("events")
  async list(@Req() req: AuthenticatedRequest) {
    return this.prisma.revenueEvent.findMany({ where: { tenantId: req.user.tenantId } });
  }

  @Post("import/csv")
  @UseInterceptors(FileInterceptor("file"))
  async importCsv(@Req() req: AuthenticatedRequest, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      return { imported: 0 };
    }
    const records = parse(file.buffer, { columns: true, skip_empty_lines: true }) as Array<Record<string, string>>;
    let imported = 0;
    for (const record of records) {
      const parsed = revenueCsvSchema.safeParse(record);
      if (!parsed.success) {
        continue;
      }
      const payload = {
        tenantId: req.user.tenantId,
        occurredAt: new Date(parsed.data.occurred_at),
        subjectType: "user" as const,
        subjectId: parsed.data.subject_id,
        amountCents: parsed.data.amount_cents,
        currency: parsed.data.currency,
        eventType: parsed.data.event_type,
        externalId: parsed.data.external_id ?? null,
        rawJson: JSON.stringify(record)
      };
      if (parsed.data.external_id) {
        const existing = await this.prisma.revenueEvent.findFirst({
          where: {
            tenantId: req.user.tenantId,
            externalId: parsed.data.external_id,
            sourceId: null
          }
        });
        if (existing) {
          await this.prisma.revenueEvent.update({
            where: { id: existing.id },
            data: payload
          });
        } else {
          await this.prisma.revenueEvent.create({ data: payload });
        }
      } else {
        await this.prisma.revenueEvent.create({ data: payload });
      }
      imported += 1;
    }
    return { imported };
  }

}
