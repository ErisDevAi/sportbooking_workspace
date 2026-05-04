/**
 * modules/wheel-contents/wheel-content.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { wheelContentService } from "./wheel-content.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const wheelContentController = {
  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const categoryId = req.query.categoryId as string;
      if (!categoryId) {
        respond.fail(res, "categoryId query parameter is required", 400);
        return;
      }
      const activeOnly = req.query.activeOnly !== "false";
      const { items, meta } = await wheelContentService.getByCategory(
        categoryId,
        req.user!.userId,
        skip,
        limit,
        page,
        activeOnly
      );
      respond.ok(res, items, "Wheel contents fetched", buildMeta(meta.total));
    } catch (e) {
      next(e);
    }
  },

  /**
   * Returns all active contents for a category (for wheel rendering, no pagination).
   */
  async getAllForWheel(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.categoryId;
      const items = await wheelContentService.getAllForWheel(categoryId);
      respond.ok(res, items, "Wheel contents for spinning");
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await wheelContentService.getById(req.params.id);
      respond.ok(res, item, "Wheel content fetched");
    } catch (e) {
      next(e);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // If image uploaded via multer, attach file path
      if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }
      const item = await wheelContentService.create(req.body, req.user!.userId);
      respond.created(res, item, "Wheel content created");
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }
      const item = await wheelContentService.update(req.params.id, req.body, req.user!.userId);
      respond.ok(res, item, "Wheel content updated");
    } catch (e) {
      next(e);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await wheelContentService.delete(req.params.id, req.user!.userId);
      respond.ok(res, null, "Wheel content deleted");
    } catch (e) {
      next(e);
    }
  },
};
