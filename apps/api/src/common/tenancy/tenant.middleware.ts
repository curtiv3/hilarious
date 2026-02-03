import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const tenantMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const token = header.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
        tenant_id?: string;
      };
      if (payload.tenant_id) {
        (req as Request & { tenantId?: string }).tenantId = payload.tenant_id;
      }
    } catch {
      // ignore invalid tokens here; guard will handle auth
    }
  }
  next();
};
