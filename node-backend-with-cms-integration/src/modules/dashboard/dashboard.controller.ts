import { Request, Response, NextFunction } from "express";
import { dashboardService } from "./dashboard.service";
import { respond } from "../../common/response";

export const dashboardController = {
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      respond.ok(res, await dashboardService.getStats(), "Dashboard stats fetched");
    } catch (e) { next(e); }
  },
};
