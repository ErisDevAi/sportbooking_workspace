/**
 * modules/user-streaks/user-streak.service.ts
 *
 * Business logic for global user streaks, levels, badges, and leaderboard.
 */

import mongoose from "mongoose";
import { UserStreak, IUserStreak, IBadge } from "./user-streak.model";
import { SpinHistory } from "../spin-histories/spin-histories.model";
import { PaginationMeta } from "../../common/pagination";

/**
 * Level thresholds based on currentStreak.
 * Level 1: 0-2, Level 2: 3-6, Level 3: 7-13, Level 4: 14-29,
 * Level 5: 30-59, Level 6: 60-99, Level 7: 100+
 */
const LEVEL_THRESHOLDS = [0, 3, 7, 14, 30, 60, 100];

function calculateLevel(currentStreak: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (currentStreak >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Check and award badges based on streak state.
 */
async function checkBadges(streak: IUserStreak, userId: string): Promise<IBadge[]> {
  const newBadges: IBadge[] = [];
  const existingSlugs = new Set(streak.badges.map((b) => b.slug));

  // First Spin
  if (streak.totalDecisions >= 1 && !existingSlugs.has("first_spin")) {
    newBadges.push({ slug: "first_spin", name: "First Spin", icon: "🌟", earnedAt: new Date() });
  }

  // Perfect Week (7-day streak)
  if (streak.currentStreak >= 7 && !existingSlugs.has("perfect_week")) {
    newBadges.push({ slug: "perfect_week", name: "Perfect Week", icon: "🔥", earnedAt: new Date() });
  }

  // Two Weeks (14-day streak)
  if (streak.currentStreak >= 14 && !existingSlugs.has("two_weeks")) {
    newBadges.push({ slug: "two_weeks", name: "Two Weeks", icon: "⚡", earnedAt: new Date() });
  }

  // Monthly Master (30-day streak)
  if (streak.currentStreak >= 30 && !existingSlugs.has("monthly_master")) {
    newBadges.push({ slug: "monthly_master", name: "Monthly Master", icon: "👑", earnedAt: new Date() });
  }

  // Centurion (100 total check-ins)
  if (streak.totalCheckins >= 100 && !existingSlugs.has("centurion")) {
    newBadges.push({ slug: "centurion", name: "Centurion", icon: "💯", earnedAt: new Date() });
  }

  // Explorer (check-in in 5+ different categories)
  const distinctCats = await SpinHistory.distinct("categoryId", {
    userId: new mongoose.Types.ObjectId(userId),
    status: "completed",
  });
  if (distinctCats.length >= 5 && !existingSlugs.has("explorer")) {
    newBadges.push({ slug: "explorer", name: "Explorer", icon: "🧭", earnedAt: new Date() });
  }

  // Foodie (10 completed decisions — any category)
  if (streak.totalCheckins >= 10 && !existingSlugs.has("foodie")) {
    newBadges.push({ slug: "foodie", name: "Foodie", icon: "🍜", earnedAt: new Date() });
  }

  return newBadges;
}

export const userStreakService = {
  /**
   * Get or create UserStreak for a user.
   */
  async getMyStreak(userId: string): Promise<IUserStreak> {
    let streak = await UserStreak.findOne({ userId }).populate("userId", "name email");
    if (!streak) {
      const created = await UserStreak.create({ userId });
      streak = await UserStreak.findById(created._id).populate("userId", "name email");
    }
    return streak!;
  },

  /**
   * Called when a user spins — increments totalDecisions.
   */
  async updateOnSpin(userId: string): Promise<void> {
    await UserStreak.findOneAndUpdate(
      { userId },
      { $inc: { totalDecisions: 1 } },
      { upsert: true, new: true }
    );
  },

  /**
   * Called when a user verifies/checks-in — updates streak, level, badges.
   */
  async updateOnCheckin(userId: string): Promise<{ streak: IUserStreak; newBadges: IBadge[] }> {
    let streak = await UserStreak.findOne({ userId });
    if (!streak) {
      streak = await UserStreak.create({ userId });
    }

    streak.totalCheckins += 1;

    const today = todayStr();
    const yesterday = yesterdayStr();

    if (streak.lastCheckinDate === "") {
      // First ever check-in
      streak.currentStreak = 1;
      streak.streakStartDate = today;
    } else if (streak.lastCheckinDate === today) {
      // Already checked in today — don't change streak
    } else if (streak.lastCheckinDate === yesterday) {
      // Consecutive day — increment streak
      streak.currentStreak += 1;
    } else {
      // Streak broken — reset
      streak.currentStreak = 1;
      streak.streakStartDate = today;
    }

    streak.lastCheckinDate = today;

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    // Calculate level
    streak.level = calculateLevel(streak.currentStreak);

    // Check badges
    const newBadges = await checkBadges(streak, userId);
    if (newBadges.length > 0) {
      streak.badges.push(...newBadges);
    }

    await streak.save();

    return { streak, newBadges };
  },

  /**
   * Get leaderboard — top users sorted by longestStreak.
   */
  async getLeaderboard(
    skip: number,
    limit: number,
    page: number
  ): Promise<{ items: IUserStreak[]; meta: PaginationMeta }> {
    const [items, total] = await Promise.all([
      UserStreak.find()
        .populate("userId", "name email")
        .sort({ longestStreak: -1, totalCheckins: -1 })
        .skip(skip)
        .limit(limit),
      UserStreak.countDocuments(),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
