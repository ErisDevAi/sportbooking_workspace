/**
 * modules/categories/category.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { categoryService } from "./category.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const search = req.query.search ? String(req.query.search) : undefined;
      const { items, meta } = await categoryService.getAll(
        req.user!.userId,
        skip,
        limit,
        page,
        search
      );
      respond.ok(res, items, "Categories fetched", buildMeta(meta.total));
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.getById(req.params.id, req.user!.userId);
      respond.ok(res, cat, "Category fetched");
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.create(req.body, req.user!.userId);
      respond.created(res, cat, "Category created");
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await categoryService.update(req.params.id, req.body, req.user!.userId);
      respond.ok(res, cat, "Category updated");
    } catch (e) {
      next(e);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(req.params.id, req.user!.userId);
      respond.ok(res, null, "Category deleted");
    } catch (e) {
      next(e);
    }
  },
};
