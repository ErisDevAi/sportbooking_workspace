/**
 * modules/spin-histories/spin-histories.service.ts
 *
 * Business logic for spin results and streak tracking.
 *
 * Streak logic:
 *   - A streak increments when a user spins on consecutive days (for same category).
 *   - If a day is missed, the streak resets to 1.
 *   - maxStreak records the highest streak achieved.
 */

import mongoose from "mongoose";
import { SpinHistory, ISpinHistory, StreakTracker, IStreakTracker } from "./spin-histories.model";
import { WheelContent } from "../wheel-contents/wheel-content.model";
import { AppError } from "../../middlewares/error.middleware";
import { PaginationMeta } from "../../common/pagination";

export interface SpinHistoryPage {
  items: ISpinHistory[];
  meta: PaginationMeta;
}

export interface SpinResultDto {
  categoryId: string;
  selectedContentId: string;
}

/**
 * Returns today's date string in YYYY-MM-DD format (UTC).
 */
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Returns yesterday's date string in YYYY-MM-DD format (UTC).
 */
function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const spinHistoryService = {
  /**
   * Record a spin result and update streak.
   */
  async recordSpin(dto: SpinResultDto, userId: string): Promise<{ history: ISpinHistory; streak: IStreakTracker }> {
    // Verify the selected content exists and belongs to the category
    const content = await WheelContent.findById(dto.selectedContentId);
    if (!content) throw new AppError("Selected wheel content not found", 404);
    if (String(content.categoryId) !== dto.categoryId) {
      throw new AppError("Selected content does not belong to this category", 400);
    }

    // Calculate streak
    const today = todayStr();
    const yesterday = yesterdayStr();

    let tracker = await StreakTracker.findOne({ userId, categoryId: dto.categoryId });

    let newStreak = 1;
    let newMax = 1;

    if (tracker) {
      if (tracker.lastSpinDate === today) {
        // Already spun today — streak stays the same, just record history
        newStreak = tracker.currentStreak;
        newMax = tracker.maxStreak;
      } else if (tracker.lastSpinDate === yesterday) {
        // Consecutive day — increment streak
        newStreak = tracker.currentStreak + 1;
        newMax = Math.max(newStreak, tracker.maxStreak);
      } else {
        // Streak broken — reset to 1
        newStreak = 1;
        newMax = tracker.maxStreak; // keep historical max
      }

      tracker.currentStreak = newStreak;
      tracker.maxStreak = newMax;
      tracker.lastSpinDate = today;
      tracker.totalSpins += 1;
      await tracker.save();
    } else {
      // First spin ever for this user+category
      tracker = await StreakTracker.create({
        userId,
        categoryId: dto.categoryId,
        currentStreak: 1,
        maxStreak: 1,
        lastSpinDate: today,
        totalSpins: 1,
      });
    }

    // Record the spin history
    const history = await SpinHistory.create({
      userId,
      categoryId: dto.categoryId,
      selectedContentId: dto.selectedContentId,
      selectedLabel: content.label,
      currentStreak: tracker.currentStreak,
      maxStreak: tracker.maxStreak,
      lastSpinAt: new Date(),
    });

    return { history, streak: tracker };
  },

  /**
   * Get spin history for a user, optionally filtered by category.
   */
  async getHistory(
    userId: string,
    skip: number,
    limit: number,
    page: number,
    categoryId?: string
  ): Promise<SpinHistoryPage> {
    const filter: Record<string, unknown> = { userId };
    if (categoryId) filter.categoryId = categoryId;

    const [items, total] = await Promise.all([
      SpinHistory.find(filter)
        .populate("categoryId", "name slug icon")
        .populate("selectedContentId", "label image color")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      SpinHistory.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Get streak info for a user across all categories or a specific one.
   */
  async getStreak(userId: string, categoryId?: string): Promise<IStreakTracker | IStreakTracker[] | null> {
    if (categoryId) {
      const tracker = await StreakTracker.findOne({ userId, categoryId })
        .populate("categoryId", "name slug icon");
      return tracker;
    }

    // All streaks for this user
    return StreakTracker.find({ userId })
      .populate("categoryId", "name slug icon")
      .sort({ currentStreak: -1 });
  },

  /**
   * Get stats for a specific content (how many times it was selected).
   */
  async getContentStats(categoryId: string): Promise<Array<{ _id: string; label: string; count: number }>> {
    return SpinHistory.aggregate([
      { $match: { categoryId: new mongoose.Types.ObjectId(categoryId) } },
      {
        $group: {
          _id: "$selectedContentId",
          label: { $first: "$selectedLabel" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  },
};
