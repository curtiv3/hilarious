import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { parse } from "csv-parse/sync";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "../../common/tenancy/authenticated-request";
import { CreateExperimentDto, UpdateExperimentDto } from "./experiments.dto";
import { ExperimentsService } from "./experiments.service";
import { exposureCsvSchema } from "@hilarious/shared";
import PDFDocument from "pdfkit";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../common/crypto/s3-client";
import type { Express } from "express";

@Controller("experiments")
@UseGuards(JwtAuthGuard)
export class ExperimentsController {
  constructor(private prisma: PrismaService, private experimentsService: ExperimentsService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return this.prisma.experiment.findMany({ where: { tenantId: req.user.tenantId } });
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateExperimentDto) {
    return this.prisma.experiment.create({
      data: {
        ...dto,
        tenantId: req.user.tenantId,
        startAt: new Date(dto.startAt),
        endAt: dto.endAt ? new Date(dto.endAt) : null,
        createdByUserId: req.user.id
      }
    });
  }

  @Get(":id")
  async get(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.prisma.experiment.findFirst({ where: { id, tenantId: req.user.tenantId } });
  }

  @Patch(":id")
  async update(@Req() req: AuthenticatedRequest, @Param("id") id: string, @Body() dto: UpdateExperimentDto) {
    return this.prisma.experiment.update({
      where: { id, tenantId: req.user.tenantId },
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined
      }
    });
  }

  @Post(":id/start")
  async start(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.prisma.experiment.update({
      where: { id, tenantId: req.user.tenantId },
      data: { status: "running", startAt: new Date() }
    });
  }

  @Post(":id/end")
  async end(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.prisma.experiment.update({
      where: { id, tenantId: req.user.tenantId },
      data: { status: "ended", endAt: new Date() }
    });
  }

  @Post(":id/recompute")
  async recompute(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.experimentsService.enqueueRecompute(req.user.tenantId, id);
  }

  @Post(":id/exposures/import")
  @UseInterceptors(FileInterceptor("file"))
  async importExposures(@Req() req: AuthenticatedRequest, @Param("id") id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      return { imported: 0 };
    }
    const records = parse(file.buffer, { columns: true, skip_empty_lines: true }) as Array<Record<string, string>>;
    let imported = 0;
    for (const record of records) {
      const parsed = exposureCsvSchema.safeParse(record);
      if (!parsed.success) {
        continue;
      }
      await this.prisma.experimentExposure.upsert({
        where: {
          tenantId_experimentId_subjectType_subjectId: {
            tenantId: req.user.tenantId,
            experimentId: id,
            subjectType: parsed.data.subject_type ?? "user",
            subjectId: parsed.data.subject_id
          }
        },
        update: {
          group: parsed.data.group,
          exposedAt: new Date(parsed.data.exposed_at),
          source: "csv",
          metadataJson: null
        },
        create: {
          tenantId: req.user.tenantId,
          experimentId: id,
          subjectId: parsed.data.subject_id,
          subjectType: parsed.data.subject_type ?? "user",
          group: parsed.data.group,
          exposedAt: new Date(parsed.data.exposed_at),
          source: "csv",
          metadataJson: null
        }
      });
      imported += 1;
    }
    return { imported };
  }

  @Post("/exposures")
  async createExposure(@Req() req: AuthenticatedRequest, @Body() body: { experimentId: string; subjectId: string; group: "control" | "treatment"; exposedAt: string; subjectType?: "user" | "account" }) {
    return this.prisma.experimentExposure.create({
      data: {
        tenantId: req.user.tenantId,
        experimentId: body.experimentId,
        subjectId: body.subjectId,
        group: body.group,
        exposedAt: new Date(body.exposedAt),
        subjectType: body.subjectType ?? "user",
        source: "api",
        metadataJson: null
      }
    });
  }

  @Get(":id/exposures")
  async listExposures(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.prisma.experimentExposure.findMany({ where: { tenantId: req.user.tenantId, experimentId: id } });
  }

  @Get(":id/snapshots")
  async snapshots(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.prisma.metricSnapshot.findMany({
      where: { experimentId: id, tenantId: req.user.tenantId },
      orderBy: { computedAt: "desc" }
    });
  }

  @Get(":id/report")
  async report(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const experiment = await this.prisma.experiment.findFirst({
      where: { id, tenantId: req.user.tenantId }
    });
    const snapshots = await this.prisma.metricSnapshot.findMany({
      where: { experimentId: id, tenantId: req.user.tenantId },
      orderBy: { computedAt: "desc" }
    });
    return { experiment, snapshots };
  }

  @Get(":id/export/pdf")
  async exportPdf(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const experiment = await this.prisma.experiment.findFirst({ where: { id, tenantId: req.user.tenantId } });
    const snapshot = await this.prisma.metricSnapshot.findFirst({
      where: { experimentId: id, tenantId: req.user.tenantId },
      orderBy: { computedAt: "desc" }
    });
    if (!experiment || !snapshot) {
      return { url: null };
    }
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.fontSize(18).text(`Experiment Report: ${experiment.name}`);
    doc.moveDown().fontSize(12).text(`Hypothesis: ${experiment.hypothesis}`);
    doc.text(`Start: ${experiment.startAt.toISOString()}`);
    doc.text(`Status: ${experiment.status}`);
    doc.moveDown().text(`Uplift Amount: ${snapshot.upliftAmountCents ?? 0} cents`);
    doc.text(`Uplift Percent: ${snapshot.upliftPercent ?? 0}`);
    doc.text(`Confidence: ${snapshot.confidenceLevel ?? 0}`);
    doc.moveDown().text(`Assumptions: DID model ${snapshot.modelVersion}, windows ${snapshot.windowPreDays}/${snapshot.windowPostDays} days`);
    doc.end();
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    const bucket = process.env.S3_BUCKET ?? "";
    const key = `exports/${req.user.tenantId}/${experiment.id}/${snapshot.id}.pdf`;
    await s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: pdfBuffer, ContentType: "application/pdf" }));
    const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
    return { url };
  }
}
