import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { computeDid } from "../modules/experiments/did";

const prisma = new PrismaClient();

const main = async () => {
  const tenant = await prisma.tenant.create({
    data: {
      name: "DemoCo",
      slug: "democo",
      plan: "starter",
      status: "trial"
    }
  });

  const passwordHash = await argon2.hash("Password123!");
  const owner = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "owner@democo.test",
      passwordHash,
      role: "OWNER"
    }
  });

  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "admin@democo.test",
      passwordHash,
      role: "ADMIN"
    }
  });

  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "viewer@democo.test",
      passwordHash,
      role: "VIEWER"
    }
  });

  const experiment = await prisma.experiment.create({
    data: {
      tenantId: tenant.id,
      name: "Pricing test",
      hypothesis: "Higher-tier pricing increases MRR",
      startAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endAt: null,
      status: "running",
      primaryMetric: "mrr",
      currency: "USD",
      treatmentDefinitionJson: "{}",
      controlDefinitionJson: "{}",
      tags: ["pricing"],
      createdByUserId: owner.id
    }
  });

  const exposures = Array.from({ length: 120 }, (_, idx) => ({
    tenantId: tenant.id,
    experimentId: experiment.id,
    subjectType: "user" as const,
    subjectId: `treat-${idx}`,
    group: "treatment" as const,
    exposedAt: experiment.startAt,
    source: "seed",
    metadataJson: null
  })).concat(
    Array.from({ length: 120 }, (_, idx) => ({
      tenantId: tenant.id,
      experimentId: experiment.id,
      subjectType: "user" as const,
      subjectId: `ctrl-${idx}`,
      group: "control" as const,
      exposedAt: experiment.startAt,
      source: "seed",
      metadataJson: null
    }))
  );

  await prisma.experimentExposure.createMany({ data: exposures });

  const revenueEvents = exposures.map((exposure) => {
    const isTreatment = exposure.group === "treatment";
    const preAmount = 1000;
    const postAmount = isTreatment ? 1800 : 1300;
    return [
      {
        tenantId: tenant.id,
        occurredAt: new Date(experiment.startAt.getTime() - 3 * 24 * 60 * 60 * 1000),
        subjectType: "user" as const,
        subjectId: exposure.subjectId,
        amountCents: preAmount,
        currency: "USD",
        eventType: "payment" as const,
        externalId: null,
        rawJson: "{}"
      },
      {
        tenantId: tenant.id,
        occurredAt: new Date(experiment.startAt.getTime() + 3 * 24 * 60 * 60 * 1000),
        subjectType: "user" as const,
        subjectId: exposure.subjectId,
        amountCents: postAmount,
        currency: "USD",
        eventType: "payment" as const,
        externalId: null,
        rawJson: "{}"
      }
    ];
  });

  await prisma.revenueEvent.createMany({ data: revenueEvents.flat() });

  const treatment = exposures
    .filter((exposure) => exposure.group === "treatment")
    .map((exposure) => ({ subjectId: exposure.subjectId, preAmount: 1000, postAmount: 1800 }));
  const control = exposures
    .filter((exposure) => exposure.group === "control")
    .map((exposure) => ({ subjectId: exposure.subjectId, preAmount: 1000, postAmount: 1300 }));

  const result = computeDid(treatment, control, 200);
  await prisma.metricSnapshot.create({
    data: {
      tenantId: tenant.id,
      experimentId: experiment.id,
      modelVersion: "v1_did_bootstrap",
      windowPreDays: 14,
      windowPostDays: 14,
      upliftPercent: result.upliftPercent ?? null,
      upliftAmountCents: result.upliftAmount ? Math.round(result.upliftAmount) : null,
      confidenceLevel: result.confidenceLevel ?? null,
      notes: result.insufficientData ? "Insufficient data" : null,
      breakdownJson: result.ci ? JSON.stringify({ ci: result.ci }) : null
    }
  });
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
