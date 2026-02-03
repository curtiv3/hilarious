import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { computeDid } from "./did";
import type { ExperimentExposure, RevenueEvent } from "@prisma/client";
import { Queue, Worker } from "bullmq";

@Injectable()
export class ExperimentsService implements OnModuleInit {
  private computeQueue!: Queue;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    this.computeQueue = new Queue("compute", { connection: { url: process.env.REDIS_URL } });
    const worker = new Worker(
      "compute",
      async (job) => {
        const { tenantId, experimentId } = job.data as { tenantId: string; experimentId: string };
        await this.prisma.auditLog.create({
          data: {
            tenantId,
            actorUserId: null,
            action: "COMPUTE_START",
            entityType: "experiment",
            entityId: experimentId,
            diffJson: JSON.stringify({ jobId: job.id })
          }
        });
        const result = await this.recomputeSnapshot(tenantId, experimentId);
        await this.prisma.auditLog.create({
          data: {
            tenantId,
            actorUserId: null,
            action: "COMPUTE_FINISH",
            entityType: "experiment",
            entityId: experimentId,
            diffJson: JSON.stringify({ jobId: job.id })
          }
        });
        return result;
      },
      { connection: { url: process.env.REDIS_URL } }
    );
    worker.on("failed", async (job) => {
      if (!job) return;
      const { tenantId, experimentId } = job.data as { tenantId: string; experimentId: string };
      await this.prisma.auditLog.create({
        data: {
          tenantId,
          actorUserId: null,
          action: "COMPUTE_FAILED",
          entityType: "experiment",
          entityId: experimentId,
          diffJson: JSON.stringify({ jobId: job.id })
        }
      });
    });
  }

  async enqueueRecompute(tenantId: string, experimentId: string) {
    const job = await this.computeQueue.add("recompute", { tenantId, experimentId });
    return { jobId: job.id };
  }

  async recomputeSnapshot(tenantId: string, experimentId: string) {
    const experiment = await this.prisma.experiment.findFirst({
      where: { id: experimentId, tenantId }
    });
    if (!experiment) {
      throw new Error("Experiment not found");
    }

    const exposures = await this.prisma.experimentExposure.findMany({
      where: { experimentId, tenantId }
    });

    const startAt = experiment.startAt;
    const preDays = 14;
    const postDays = 14;
    const preStart = new Date(startAt.getTime() - preDays * 24 * 60 * 60 * 1000);
    const postEnd = new Date(startAt.getTime() + postDays * 24 * 60 * 60 * 1000);

    const subjectIds = exposures.map((exposure: ExperimentExposure) => exposure.subjectId);
    const revenue = await this.prisma.revenueEvent.findMany({
      where: {
        tenantId,
        subjectId: { in: subjectIds },
        occurredAt: { gte: preStart, lt: postEnd }
      }
    });

    const toMap = (group: "control" | "treatment") => {
      const groupSubjects = exposures.filter((exp: ExperimentExposure) => exp.group === group);
      return groupSubjects.map((subject: ExperimentExposure) => {
        const subjectEvents = revenue.filter((event: RevenueEvent) => event.subjectId === subject.subjectId);
        const preAmount = subjectEvents
          .filter((event: RevenueEvent) => event.occurredAt < startAt)
          .reduce((sum: number, event: RevenueEvent) => sum + event.amountCents, 0);
        const postAmount = subjectEvents
          .filter((event: RevenueEvent) => event.occurredAt >= startAt)
          .reduce((sum: number, event: RevenueEvent) => sum + event.amountCents, 0);
        return { subjectId: subject.subjectId, preAmount, postAmount };
      });
    };

    const treatment = toMap("treatment");
    const control = toMap("control");

    const result = computeDid(treatment, control);

    const snapshot = await this.prisma.metricSnapshot.create({
      data: {
        tenantId,
        experimentId,
        modelVersion: "v1_did_bootstrap",
        windowPreDays: preDays,
        windowPostDays: postDays,
        upliftPercent: result.upliftPercent ?? null,
        upliftAmountCents: result.upliftAmount ? Math.round(result.upliftAmount) : null,
        confidenceLevel: result.confidenceLevel ?? null,
        notes: result.insufficientData ? "Insufficient data" : result.warnings.length ? result.warnings.join(",") : null,
        breakdownJson: result.ci ? JSON.stringify({ ci: result.ci }) : null
      }
    });

    return { snapshot, ci: result.ci, insufficientData: result.insufficientData };
  }
}
