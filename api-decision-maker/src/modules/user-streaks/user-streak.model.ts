/**
 * modules/user-streaks/user-streak.model.ts
 *
 * Global user streak aggregation — tracks overall streak, level, and badges
 * across all categories for a single user.
 */

import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBadge {
  slug: string;
  name: string;
  icon: string;
  earnedAt: Date;
}

export interface IUserStreak extends Document {
  userId: Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  totalDecisions: number;
  totalCheckins: number;
  lastCheckinDate: string; // YYYY-MM-DD
  streakStartDate: string; // YYYY-MM-DD
  level: number; // 1-7
  badges: IBadge[];
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserStreakSchema = new Schema<IUserStreak>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },
    totalDecisions: { type: Number, default: 0, min: 0 },
    totalCheckins: { type: Number, default: 0, min: 0 },
    lastCheckinDate: { type: String, default: "" },
    streakStartDate: { type: String, default: "" },
    level: { type: Number, default: 1, min: 1, max: 7 },
    badges: { type: [BadgeSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "user-streaks",
  }
);

UserStreakSchema.index({ userId: 1 }, { unique: true });
UserStreakSchema.index({ longestStreak: -1 });

export const UserStreak = mongoose.model<IUserStreak>("UserStreak", UserStreakSchema);
