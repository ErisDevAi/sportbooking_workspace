/**
 * modules/backup/backup.route.ts
 *
 * All backup routes require admin role.
 */

import { Router } from "express";
import { backupController } from "./backup.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/role.middleware";
import { param } from "express-validator";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

const mongoIdParam = [param("id").isMongoId().withMessage("Invalid backup ID")];

// POST /backup/create — create a new backup
router.post(
  "/create",
  authenticate,
  checkRole("admin"),
  backupController.createBackup
);

// GET /backup/list — list all backups
router.get(
  "/list",
  authenticate,
  checkRole("admin"),
  backupController.listBackups
);

// POST /backup/restore/:id — restore from backup
router.post(
  "/restore/:id",
  authenticate,
  checkRole("admin"),
  mongoIdParam,
  validate,
  backupController.restoreBackup
);

// GET /backup/download/:id — download backup file
router.get(
  "/download/:id",
  authenticate,
  checkRole("admin"),
  mongoIdParam,
  validate,
  backupController.downloadBackup
);

// DELETE /backup/:id — delete a backup
router.delete(
  "/:id",
  authenticate,
  checkRole("admin"),
  mongoIdParam,
  validate,
  backupController.deleteBackup
);

export default router;
