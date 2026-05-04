/**
 * modules/spin-histories/spin-histories.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { spinHistoryService } from "./spin-histories.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const spinHistoryController = {
  /**
   * POST /spin-history — record a spin result
   */
  async recordSpin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await spinHistoryService.recordSpin(req.body, req.user!.userId);
      respond.created(res, result, "Spin recorded");
    } catch (e) {
      next(e);
    }
  },

  /**
   * GET /spin-history — get user's spin history
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const categoryId = req.query.categoryId as string | undefined;
      const { items, meta } = await spinHistoryService.getHistory(
        req.user!.userId,
        skip,
        limit,
        page,
        categoryId
      );
      respond.ok(res, items, "Spin history fetched", buildMeta(meta.total));
    } catch (e) {
      next(e);
    }
  },

  /**
   * GET /spin-history/streak — get user's streak info
   */
  async getStreak(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const streak = await spinHistoryService.getStreak(req.user!.userId, categoryId);
      respond.ok(res, streak, "Streak info fetched");
    } catch (e) {
      next(e);
    }
  },

  /**
   * GET /spin-history/stats/:categoryId — get content selection stats for a category
   */
  async getContentStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await spinHistoryService.getContentStats(req.params.categoryId);
      respond.ok(res, stats, "Content stats fetched");
    } catch (e) {
      next(e);
    }
  },
};
