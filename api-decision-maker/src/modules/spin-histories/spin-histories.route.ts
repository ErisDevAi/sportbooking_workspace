/**
 * modules/spin-histories/spin-histories.route.ts
 */

import { Router } from "express";
import { spinHistoryController } from "./spin-histories.controller";
import {
  recordSpinValidation,
  categoryIdParam,
} from "./spin-histories.validation";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkPermission } from "../../middlewares/role.middleware";

const router = Router();

// POST /spin-history — record spin result
router.post(
  "/",
  authenticate,
  checkPermission("create_spin"),
  recordSpinValidation,
  validate,
  spinHistoryController.recordSpin
);

// GET /spin-history — user's history (optionally ?categoryId=xxx)
router.get(
  "/",
  authenticate,
  checkPermission("view_spin_history"),
  spinHistoryController.getHistory
);

// GET /spin-history/streak — user's streak info (optionally ?categoryId=xxx)
router.get(
  "/streak",
  authenticate,
  checkPermission("view_spin_history"),
  spinHistoryController.getStreak
);

// GET /spin-history/stats/:categoryId — selection stats for a category
router.get(
  "/stats/:categoryId",
  authenticate,
  categoryIdParam,
  validate,
  checkPermission("view_spin_history"),
  spinHistoryController.getContentStats
);

export default router;
