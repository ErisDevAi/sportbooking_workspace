/**
 * modules/backup/backup.model.ts
 *
 * Records metadata for each database backup.
 */

import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBackup extends Document {
  filename: string;
  size: number;         // file size in bytes
  collections: string[];
  createdBy: Types.ObjectId;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const BackupSchema = new Schema<IBackup>(
  {
    filename: { type: String, required: true, unique: true },
    size: { type: Number, required: true, min: 0 },
    collections: { type: [String], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "backups",
  }
);

BackupSchema.index({ createdAt: -1 });

export const Backup = mongoose.model<IBackup>("Backup", BackupSchema);
