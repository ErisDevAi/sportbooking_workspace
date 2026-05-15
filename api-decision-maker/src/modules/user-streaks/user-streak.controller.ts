/**
 * modules/user-streaks/user-streak.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { userStreakService } from "./user-streak.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const userStreakController = {
  /**
   * GET /streaks/me — get current user's global streak
   */
  async getMyStreak(req: Request, res: Response, next: NextFunction) {
    try {
      const streak = await userStreakService.getMyStreak(req.user!.userId);
      respond.ok(res, streak, "User streak fetched");
    } catch (e) {
      next(e);
    }
  },

  /**
   * GET /streaks/leaderboard — get top users by streak
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const { items, meta } = await userStreakService.getLeaderboard(skip, limit, page);
      respond.ok(res, items, "Leaderboard fetched", buildMeta(meta.total));
    } catch (e) {
      next(e);
    }
  },
};
