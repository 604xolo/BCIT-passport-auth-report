// middleware/checkAuth.ts
import { Request, Response, NextFunction } from "express";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return next();
  res.redirect("/dashboard");
};

// ✅ NEW: admin-only guard
export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user?.role === "admin") {
    return next();
  }
  res.status(403).send("Forbidden: admins only");
};
