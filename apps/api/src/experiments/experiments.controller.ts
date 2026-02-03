import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { parse } from "csv-parse/sync";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { AuthenticatedRequest } from "../common/authenticated-request";
import { CreateExperimentDto, UpdateExperimentDto } from "./experiments.dto";
import { ExperimentsService } from "./experiments.service";

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
    return this.experimentsService.recomputeSnapshot(req.user.tenantId, id);
  }

  @Post(":id/exposures/import")
  @UseInterceptors(FileInterceptor("file"))
  async importExposures(@Req() req: AuthenticatedRequest, @Param("id") id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      return { imported: 0 };
    }
    const records = parse(file.buffer, { columns: true, skip_empty_lines: true }) as Array<Record<string, string>>;
    const data = records.map((record) => ({
      tenantId: req.user.tenantId,
      experimentId: id,
      subjectId: record.subject_id,
      subjectType: (record.subject_type as "user" | "account") ?? "user",
      group: record.group as "control" | "treatment",
      exposedAt: new Date(record.exposed_at),
      source: "csv",
      metadataJson: null
    }));
    if (data.length) {
      await this.prisma.experimentExposure.createMany({ data });
    }
    return { imported: data.length };
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
}
