/**
 * modules/user-streaks/user-streak.route.ts
 */

import { Router } from "express";
import { userStreakController } from "./user-streak.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// GET /streaks/me — current user's global streak, level, badges
router.get("/me", authenticate, userStreakController.getMyStreak);

// GET /streaks/leaderboard — top users by streak (paginated)
router.get("/leaderboard", authenticate, userStreakController.getLeaderboard);

export default router;
