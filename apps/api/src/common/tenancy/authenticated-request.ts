import { Role } from "@hilarious/shared";
import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  role: Role;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  tenantId: string;
}
