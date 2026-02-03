import { IsArray, IsIn, IsOptional, IsString } from "class-validator";
import { PrimaryMetric } from "@hilarious/shared";

export class CreateExperimentDto {
  @IsString()
  name!: string;

  @IsString()
  hypothesis!: string;

  @IsString()
  startAt!: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsIn(["draft", "running", "ended", "archived"])
  status!: string;

  @IsIn(["mrr", "revenue", "arr", "pipeline"])
  primaryMetric!: PrimaryMetric;

  @IsString()
  currency!: string;

  @IsString()
  treatmentDefinitionJson!: string;

  @IsString()
  controlDefinitionJson!: string;

  @IsArray()
  tags!: string[];
}

export class UpdateExperimentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  hypothesis?: string;

  @IsOptional()
  @IsString()
  startAt?: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsOptional()
  @IsIn(["draft", "running", "ended", "archived"])
  status?: string;

  @IsOptional()
  @IsIn(["mrr", "revenue", "arr", "pipeline"])
  primaryMetric?: PrimaryMetric;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  treatmentDefinitionJson?: string;

  @IsOptional()
  @IsString()
  controlDefinitionJson?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
