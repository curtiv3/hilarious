import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "@hilarious/shared";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(["OWNER", "ADMIN", "ANALYST", "VIEWER"])
  role!: Role;
}

export class UpdateUserDto {
  @IsOptional()
  @IsIn(["OWNER", "ADMIN", "ANALYST", "VIEWER"])
  role?: Role;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  isActive?: boolean;
}
