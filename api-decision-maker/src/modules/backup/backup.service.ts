/**
 * modules/backup/backup.service.ts
 *
 * Backup & restore logic — exports all MongoDB collections to JSON files
 * and can restore from a backup file.
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Backup, IBackup } from "./backup.model";
import { AppError } from "../../middlewares/error.middleware";
import { PaginationMeta } from "../../common/pagination";

const BACKUP_DIR = path.join(__dirname, "../../../backups");

// Ensure backup directory exists
function ensureBackupDir(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export const backupService = {
  /**
   * Create a full database backup — exports all collections to a JSON file.
   */
  async createBackup(userId: string, note?: string): Promise<IBackup> {
    ensureBackupDir();

    const db = mongoose.connection.db;
    if (!db) throw new AppError("Database not connected", 500);

    // Get all collections
    const collectionInfos = await db.listCollections().toArray();
    const collectionNames = collectionInfos.map((c) => c.name);

    // Export each collection
    const data: Record<string, unknown[]> = {};
    for (const name of collectionNames) {
      const docs = await db.collection(name).find({}).toArray();
      data[name] = docs;
    }

    // Write to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);

    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, jsonStr, "utf-8");

    const stats = fs.statSync(filepath);

    // Record backup metadata
    const backup = await Backup.create({
      filename,
      size: stats.size,
      collections: collectionNames,
      createdBy: userId,
      note: note || "",
    });

    return backup;
  },

  /**
   * List all backups, paginated, sorted by newest first.
   */
  async listBackups(
    skip: number,
    limit: number,
    page: number
  ): Promise<{ items: IBackup[]; meta: PaginationMeta }> {
    const [items, total] = await Promise.all([
      Backup.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Backup.countDocuments(),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Restore from a backup — drops and re-inserts all collection data.
   * WARNING: This is destructive and should only be used by admins.
   */
  async restoreBackup(backupId: string): Promise<{ restoredCollections: string[] }> {
    const backup = await Backup.findById(backupId);
    if (!backup) throw new AppError("Backup not found", 404);

    const filepath = path.join(BACKUP_DIR, backup.filename);
    if (!fs.existsSync(filepath)) {
      throw new AppError("Backup file not found on disk", 404);
    }

    const jsonStr = fs.readFileSync(filepath, "utf-8");
    const data: Record<string, unknown[]> = JSON.parse(jsonStr);

    const db = mongoose.connection.db;
    if (!db) throw new AppError("Database not connected", 500);

    const restoredCollections: string[] = [];

    for (const [collectionName, docs] of Object.entries(data)) {
      // Skip the backups collection itself to avoid losing backup records
      if (collectionName === "backups") continue;

      if (docs.length > 0) {
        const collection = db.collection(collectionName);
        await collection.deleteMany({});
        await collection.insertMany(docs as any[]);
        restoredCollections.push(collectionName);
      }
    }

    return { restoredCollections };
  },

  /**
   * Get backup file path for download.
   */
  async getBackupFilePath(backupId: string): Promise<{ filepath: string; filename: string }> {
    const backup = await Backup.findById(backupId);
    if (!backup) throw new AppError("Backup not found", 404);

    const filepath = path.join(BACKUP_DIR, backup.filename);
    if (!fs.existsSync(filepath)) {
      throw new AppError("Backup file not found on disk", 404);
    }

    return { filepath, filename: backup.filename };
  },

  /**
   * Delete a backup record and its file.
   */
  async deleteBackup(backupId: string): Promise<void> {
    const backup = await Backup.findById(backupId);
    if (!backup) throw new AppError("Backup not found", 404);

    // Remove file from disk
    const filepath = path.join(BACKUP_DIR, backup.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Remove record
    await Backup.findByIdAndDelete(backupId);
  },
};
