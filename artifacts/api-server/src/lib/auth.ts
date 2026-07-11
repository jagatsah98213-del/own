import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  next();
}

export function requireRole(role: "ADMIN" | "EMPLOYEE") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (req.session.role !== role) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}

export function requireEmployeeId(req: Request): number {
  if (!req.session.employeeId) {
    throw new Error("requireEmployeeId called without an employee session");
  }
  return req.session.employeeId;
}
