import { Request, Response, NextFunction } from "express";
import { permissionService } from "./permission.service";
import { respond } from "../../common/response";

export const permissionController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try { respond.ok(res, await permissionService.getAll(), "Permissions fetched"); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { respond.created(res, await permissionService.create(req.body), "Permission created"); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await permissionService.delete(req.params.id); respond.ok(res, null, "Permission deleted"); } catch (e) { next(e); }
  },
};
