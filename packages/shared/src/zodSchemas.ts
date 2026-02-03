import { z } from "zod";

export const exposureCsvSchema = z.object({
  subject_id: z.string().min(1),
  group: z.enum(["control", "treatment"]),
  exposed_at: z.string().datetime(),
  subject_type: z.enum(["user", "account"]).optional()
});

export const revenueCsvSchema = z.object({
  occurred_at: z.string().datetime(),
  subject_id: z.string().min(1),
  amount_cents: z.coerce.number(),
  currency: z.string().min(3).max(3),
  event_type: z.enum([
    "payment",
    "refund",
    "invoice_paid",
    "subscription_created",
    "churn"
  ]),
  external_id: z.string().optional()
});
