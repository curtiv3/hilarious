export type Role = "OWNER" | "ADMIN" | "ANALYST" | "VIEWER" | "SUPERADMIN";

export type ExperimentStatus = "draft" | "running" | "ended" | "archived";

export type PrimaryMetric = "mrr" | "revenue" | "arr" | "pipeline";

export type TenantPlan = "starter" | "scale" | "enterprise";

export type TenantStatus = "active" | "trial" | "past_due" | "canceled";

export type DataSourceType = "stripe" | "csv" | "manual" | "hubspot";

export type ExposureGroup = "control" | "treatment";

export type RevenueEventType =
  | "payment"
  | "refund"
  | "invoice_paid"
  | "subscription_created"
  | "churn";

export type SubjectType = "user" | "account";
