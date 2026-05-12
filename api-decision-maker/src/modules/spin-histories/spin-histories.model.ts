/**
 * modules/spin-histories/spin-histories.model.ts
 *
 * Records each spin result and tracks streak data per user per category.
 */

import mongoose, { Document, Schema, Types } from "mongoose";

export type DecisionStatus = "pending" | "completed" | "skipped" | "expired";

export interface ISpinHistory extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  selectedContentId: Types.ObjectId;
  selectedLabel: string; // denormalized for quick display
  // Decision flow
  status: DecisionStatus;
  question: string;        // user's question when spinning
  spinCount: number;       // number of re-spins for this decision
  checkinImageUrl: string; // photo proof for check-in
  expiresAt: Date | null;  // decision expiration (createdAt + 24h)
  // Streak tracking
  currentStreak: number; // consecutive days the user has used this category
  maxStreak: number;     // highest streak ever for this user+category
  lastSpinAt: Date;      // timestamp of this spin
  // Review / verification
  isVerified: boolean;   // user confirmed they completed the task
  verifiedAt?: Date;
  rating?: number;       // 0-5 stars
  reviewNote?: string;   // user's text review
  createdAt: Date;
  updatedAt: Date;
}

const SpinHistorySchema = new Schema<ISpinHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    selectedContentId: { type: Schema.Types.ObjectId, ref: "WheelContent", required: true },
    selectedLabel: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "skipped", "expired"],
      default: "pending",
    },
    question: { type: String, default: "" },
    spinCount: { type: Number, default: 1, min: 1 },
    checkinImageUrl: { type: String, default: "" },
    expiresAt: { type: Date, default: null },
    currentStreak: { type: Number, default: 1, min: 0 },
    maxStreak: { type: Number, default: 1, min: 0 },
    lastSpinAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    rating: { type: Number, min: 0, max: 5 },
    reviewNote: { type: String, maxlength: 500 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "spin-histories",
  }
);

SpinHistorySchema.index({ userId: 1, categoryId: 1, createdAt: -1 });
SpinHistorySchema.index({ userId: 1, lastSpinAt: -1 });
SpinHistorySchema.index({ userId: 1, status: 1 });
SpinHistorySchema.index({ status: 1, expiresAt: 1 });

export const SpinHistory = mongoose.model<ISpinHistory>("SpinHistory", SpinHistorySchema);

/**
 * Separate model to track streak state per user+category.
 * This avoids recalculating streak from all history records.
 */
export interface IStreakTracker extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  currentStreak: number;
  maxStreak: number;
  lastSpinDate: string; // YYYY-MM-DD format for day comparison
  totalSpins: number;
  createdAt: Date;
  updatedAt: Date;
}

const StreakTrackerSchema = new Schema<IStreakTracker>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    currentStreak: { type: Number, default: 0, min: 0 },
    maxStreak: { type: Number, default: 0, min: 0 },
    lastSpinDate: { type: String, default: "" },
    totalSpins: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "streak-trackers",
  }
);

StreakTrackerSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

export const StreakTracker = mongoose.model<IStreakTracker>("StreakTracker", StreakTrackerSchema);
