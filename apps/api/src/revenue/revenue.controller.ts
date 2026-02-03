import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { parse } from "csv-parse/sync";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { AuthenticatedRequest } from "../common/authenticated-request";

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
    const data = records.map((record) => ({
      tenantId: req.user.tenantId,
      occurredAt: new Date(record.occurred_at),
      subjectType: "user",
      subjectId: record.subject_id,
      amountCents: Number(record.amount_cents),
      currency: record.currency,
      eventType: record.event_type as any,
      externalId: record.external_id || null,
      rawJson: JSON.stringify(record)
    }));
    if (data.length) {
      await this.prisma.revenueEvent.createMany({ data });
    }
    return { imported: data.length };
  }

  @Post("/integrations/stripe/webhook")
  async stripeWebhook() {
    return { received: true };
  }
}
