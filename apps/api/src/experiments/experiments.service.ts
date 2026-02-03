import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { computeDid } from "./did";

@Injectable()
export class ExperimentsService {
  constructor(private prisma: PrismaService) {}

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
    const preDays = 30;
    const postDays = 30;
    const preStart = new Date(startAt.getTime() - preDays * 24 * 60 * 60 * 1000);
    const postEnd = new Date(startAt.getTime() + postDays * 24 * 60 * 60 * 1000);

    const subjectIds = exposures.map((exposure) => exposure.subjectId);
    const revenue = await this.prisma.revenueEvent.findMany({
      where: {
        tenantId,
        subjectId: { in: subjectIds },
        occurredAt: { gte: preStart, lt: postEnd }
      }
    });

    const toMap = (group: "control" | "treatment") => {
      const groupSubjects = exposures.filter((exp) => exp.group === group);
      return groupSubjects.map((subject) => {
        const subjectEvents = revenue.filter((event) => event.subjectId === subject.subjectId);
        const preAmount = subjectEvents
          .filter((event) => event.occurredAt < startAt)
          .reduce((sum, event) => sum + event.amountCents, 0);
        const postAmount = subjectEvents
          .filter((event) => event.occurredAt >= startAt)
          .reduce((sum, event) => sum + event.amountCents, 0);
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
        modelVersion: "v1-prepost-did",
        windowPreDays: preDays,
        windowPostDays: postDays,
        upliftPercent: result.upliftPercent ?? null,
        upliftAmountCents: result.upliftAmount ? Math.round(result.upliftAmount) : null,
        confidenceLevel: result.confidenceLevel ?? null,
        notes: result.insufficientData ? "Insufficient data" : null,
        breakdownJson: null
      }
    });

    return { snapshot, ci: result.ci, insufficientData: result.insufficientData };
  }
}
