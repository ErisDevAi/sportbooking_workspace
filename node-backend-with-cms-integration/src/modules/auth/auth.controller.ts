import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { respond } from "../../common/response";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      respond.created(res, result, "Registration successful");
    } catch (e) { next(e); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      respond.ok(res, result, "Login successful");
    } catch (e) { next(e); }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.userId);
      respond.ok(res, user, "Profile fetched");
    } catch (e) { next(e); }
  },
};
