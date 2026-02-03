import { IsIn, IsOptional, IsString } from "class-validator";
import { TenantPlan, TenantStatus } from "@hilarious/shared";

export class CreateTenantDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsIn(["starter", "scale", "enterprise"])
  plan!: TenantPlan;

  @IsIn(["active", "trial", "past_due", "canceled"])
  status!: TenantStatus;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(["starter", "scale", "enterprise"])
  plan?: TenantPlan;

  @IsOptional()
  @IsIn(["active", "trial", "past_due", "canceled"])
  status?: TenantStatus;
}
