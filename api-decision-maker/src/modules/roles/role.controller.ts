import { Request, Response, NextFunction } from "express";
import { roleService } from "./role.service";
import { respond } from "../../common/response";

export const roleController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try { respond.ok(res, await roleService.getAll(), "Roles fetched"); } catch (e) { next(e); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try { respond.ok(res, await roleService.getById(req.params.id), "Role fetched"); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { respond.created(res, await roleService.create(req.body), "Role created"); } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { respond.ok(res, await roleService.update(req.params.id, req.body), "Role updated"); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await roleService.delete(req.params.id); respond.ok(res, null, "Role deleted"); } catch (e) { next(e); }
  },
};
