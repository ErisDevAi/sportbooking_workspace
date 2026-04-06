/**
 * middlewares/role.middleware.ts
 *
 * Two guards:
 *
 *   checkRole('admin', 'editor')
 *     → passes if req.user.role is in the list
 *
 *   checkPermission('create_user', 'edit_user')
 *     → passes if req.user.permissions contains ANY of the listed slugs
 *
 * Both require authenticate() to have run first (req.user must exist).
 *
 * Usage:
 *   router.post('/', authenticate, checkRole('admin'), checkPermission('create_user'), handler)
 */

import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import { UserRole, PermissionSlug } from "../types";

export function checkRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError("Authentication required", 401));
    if (!roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(" | ")}`,
          403
        )
      );
    }
    next();
  };
}

export function checkPermission(...perms: PermissionSlug[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError("Authentication required", 401));
    const userPerms = req.user.permissions ?? [];
    const hasAny = perms.some((p) => userPerms.includes(p));
    if (!hasAny) {
      return next(
        new AppError(
          `Access denied. Required permission: ${perms.join(" | ")}`,
          403
        )
      );
    }
    next();
  };
}
