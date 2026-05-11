/**
 * modules/spin-histories/spin-histories.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { spinHistoryService } from "./spin-histories.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const spinHistoryController = {
  /**
   * POST /spin-history/smart-spin — server-side smart random selection
   */
  async smartSpin(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.body;
      if (!categoryId) {
        return respond.fail(res, "categoryId is required", 400);
      }
      const result = await spinHistoryService.smartSpin(categoryId, req.user!.userId);
      respond.created(res, result, "Smart spin completed");
    } catch (e) {
      next(e);
    }
  },

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
   * Admin users can pass ?all=true to see all users' history
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const categoryId = req.query.categoryId as string | undefined;
      const isAdmin = req.user!.role === "admin";
      const showAll = req.query.all === "true" && isAdmin;
      const { items, meta } = await spinHistoryService.getHistory(
        showAll ? undefined : req.user!.userId,
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
   * PATCH /spin-history/:id/verify — verify and review a spin result
   */
  async verifyAndReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating, reviewNote } = req.body;
      const result = await spinHistoryService.verifyAndReview(id, req.user!.userId, { rating, reviewNote });
      respond.ok(res, result, "Review saved successfully");
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
