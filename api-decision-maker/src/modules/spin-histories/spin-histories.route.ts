/**
 * modules/spin-histories/spin-histories.route.ts
 */

import { Router } from "express";
import { spinHistoryController } from "./spin-histories.controller";
import {
  recordSpinValidation,
  categoryIdParam,
  mongoIdParam,
  verifyValidation,
} from "./spin-histories.validation";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkPermission } from "../../middlewares/role.middleware";

const router = Router();

// POST /spin-history/smart-spin — server-side smart random selection + record
router.post(
  "/smart-spin",
  authenticate,
  checkPermission("create_spin"),
  spinHistoryController.smartSpin
);

// GET /spin-history/today — today's pending decisions
router.get(
  "/today",
  authenticate,
  checkPermission("view_spin_history"),
  spinHistoryController.getTodayDecisions
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

// POST /spin-history — record spin result (client-side selection)
router.post(
  "/",
  authenticate,
  checkPermission("create_spin"),
  recordSpinValidation,
  validate,
  spinHistoryController.recordSpin
);

// GET /spin-history — user's history (optionally ?categoryId=xxx&status=xxx)
router.get(
  "/",
  authenticate,
  checkPermission("view_spin_history"),
  spinHistoryController.getHistory
);

// PUT /spin-history/:id/accept — accept a decision
router.put(
  "/:id/accept",
  authenticate,
  mongoIdParam,
  validate,
  checkPermission("create_spin"),
  spinHistoryController.acceptDecision
);

// PUT /spin-history/:id/skip — skip a decision
router.put(
  "/:id/skip",
  authenticate,
  mongoIdParam,
  validate,
  checkPermission("create_spin"),
  spinHistoryController.skipDecision
);

// PATCH /spin-history/:id/verify — verify and review a spin result
router.patch(
  "/:id/verify",
  authenticate,
  mongoIdParam,
  verifyValidation,
  validate,
  checkPermission("create_spin"),
  spinHistoryController.verifyAndReview
);

export default router;
