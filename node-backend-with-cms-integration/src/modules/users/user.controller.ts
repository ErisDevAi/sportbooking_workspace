import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const userController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const { items, meta } = await userService.getAll(skip, limit, page);
      respond.ok(res, items, "Users fetched", buildMeta(meta.total));
    } catch (e) { next(e); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      respond.ok(res, await userService.getById(req.params.id), "User fetched");
    } catch (e) { next(e); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      respond.created(res, await userService.create(req.body), "User created");
    } catch (e) { next(e); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      respond.ok(res, await userService.update(req.params.id, req.body), "User updated");
    } catch (e) { next(e); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.delete(req.params.id);
      respond.ok(res, null, "User deleted");
    } catch (e) { next(e); }
  },
};
