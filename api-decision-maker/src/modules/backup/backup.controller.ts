/**
 * modules/backup/backup.controller.ts
 */

import { Request, Response, NextFunction } from "express";
import { backupService } from "./backup.service";
import { respond } from "../../common/response";
import { parsePagination } from "../../common/pagination";

export const backupController = {
  /**
   * POST /backup/create — create a new database backup
   */
  async createBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const { note } = req.body;
      const backup = await backupService.createBackup(req.user!.userId, note);
      respond.created(res, backup, "Backup created successfully");
    } catch (e) {
      next(e);
    }
  },

  /**
   * GET /backup/list — list all backups
   */
  async listBackups(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit, page, buildMeta } = parsePagination(req.query);
      const { items, meta } = await backupService.listBackups(skip, limit, page);
      respond.ok(res, items, "Backups fetched", buildMeta(meta.total));
    } catch (e) {
      next(e);
    }
  },

  /**
   * POST /backup/restore/:id — restore from a backup
   */
  async restoreBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await backupService.restoreBackup(req.params.id);
      respond.ok(res, result, "Backup restored successfully");
    } catch (e) {
      next(e);
    }
  },

  /**
   * GET /backup/download/:id — download backup file
   */
  async downloadBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const { filepath, filename } = await backupService.getBackupFilePath(req.params.id);
      res.download(filepath, filename);
    } catch (e) {
      next(e);
    }
  },

  /**
   * DELETE /backup/:id — delete a backup
   */
  async deleteBackup(req: Request, res: Response, next: NextFunction) {
    try {
      await backupService.deleteBackup(req.params.id);
      respond.ok(res, null, "Backup deleted successfully");
    } catch (e) {
      next(e);
    }
  },
};
