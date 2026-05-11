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

/**
 * Smart Random (Weighted Random Selection) algorithm.
 *
 * Adjusts base weights with:
 *   - Cooldown: if selected within last 3 days → weight × 0.5 (min 1)
 *   - Boost: if never selected → weight × 1.5
 *
 * Returns the selected content after updating its stats.
 */
async function smartRandom(categoryId: string): Promise<typeof WheelContent.prototype> {
  const choices = await WheelContent.find({ categoryId, isActive: true });
  if (choices.length === 0) {
    throw new AppError("Không có lựa chọn nào trong danh mục", 400);
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  // Calculate adjusted weights
  const weighted = choices.map((choice) => {
    let w = choice.weight;

    // Cooldown: recently selected → reduce weight
    if (choice.lastSelectedAt && choice.lastSelectedAt > threeDaysAgo) {
      w = Math.max(1, Math.floor(w * 0.5));
    }

    // Boost: never selected → increase weight
    if (choice.timesSelected === 0) {
      w = Math.ceil(w * 1.5);
    }

    return { choice, weight: w };
  });

  // Weighted random selection
  const totalWeight = weighted.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * totalWeight;

  let selected = weighted[0].choice;
  for (const entry of weighted) {
    rand -= entry.weight;
    if (rand <= 0) {
      selected = entry.choice;
      break;
    }
  }

  // Update stats on the selected content
  selected.timesSelected += 1;
  selected.lastSelectedAt = now;
  await selected.save();

  return selected;
}

export const spinHistoryService = {
  /**
   * Smart spin: use smartRandom algorithm to pick a choice,
   * then record the result and update streak.
   */
  async smartSpin(categoryId: string, userId: string): Promise<{ history: ISpinHistory; streak: IStreakTracker; selected: any }> {
    const selected = await smartRandom(categoryId);
    const result = await this.recordSpin(
      { categoryId, selectedContentId: String(selected._id) },
      userId
    );
    return { ...result, selected };
  },

  /**
   * Record a spin result (no streak update — streak only updates on verify).
   */
  async recordSpin(dto: SpinResultDto, userId: string): Promise<{ history: ISpinHistory; streak: IStreakTracker }> {
    // Verify the selected content exists and belongs to the category
    const content = await WheelContent.findById(dto.selectedContentId);
    if (!content) throw new AppError("Selected wheel content not found", 404);
    if (String(content.categoryId) !== dto.categoryId) {
      throw new AppError("Selected content does not belong to this category", 400);
    }

    // Update selection stats on the content
    content.timesSelected = (content.timesSelected || 0) + 1;
    content.lastSelectedAt = new Date();
    await content.save();

    // Ensure tracker exists (for totalSpins count) but don't touch streak
    let tracker = await StreakTracker.findOne({ userId, categoryId: dto.categoryId });
    if (tracker) {
      tracker.totalSpins += 1;
      await tracker.save();
    } else {
      tracker = await StreakTracker.create({
        userId,
        categoryId: dto.categoryId,
        currentStreak: 0,
        maxStreak: 0,
        lastSpinDate: "",
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
   * If userId is undefined, returns all users' history (admin).
   */
  async getHistory(
    userId: string | undefined,
    skip: number,
    limit: number,
    page: number,
    categoryId?: string
  ): Promise<SpinHistoryPage> {
    const filter: Record<string, unknown> = {};
    if (userId) filter.userId = userId;
    if (categoryId) filter.categoryId = categoryId;

    const [items, total] = await Promise.all([
      SpinHistory.find(filter)
        .populate("userId", "name email")
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
   * Verify/review a spin history entry AND update streak.
   * Streak only increments when user confirms completion (verify).
   */
  async verifyAndReview(
    historyId: string,
    userId: string,
    data: { rating?: number; reviewNote?: string }
  ): Promise<{ history: ISpinHistory; streak: IStreakTracker | null }> {
    const history = await SpinHistory.findById(historyId);
    if (!history) throw new AppError("Spin history not found", 404);
    if (String(history.userId) !== userId) {
      throw new AppError("You can only review your own spin history", 403);
    }

    history.isVerified = true;
    history.verifiedAt = new Date();
    if (data.rating !== undefined) history.rating = data.rating;
    if (data.reviewNote !== undefined) history.reviewNote = data.reviewNote;
    await history.save();

    // Update streak on verify
    const today = todayStr();
    const yesterday = yesterdayStr();
    const categoryId = String(history.categoryId);

    let tracker = await StreakTracker.findOne({ userId, categoryId });

    if (tracker) {
      if (tracker.lastSpinDate === today) {
        // Already verified today — streak stays
      } else if (tracker.lastSpinDate === yesterday || tracker.lastSpinDate === "") {
        // Consecutive day or first verify — increment streak
        tracker.currentStreak += 1;
        tracker.maxStreak = Math.max(tracker.currentStreak, tracker.maxStreak);
        tracker.lastSpinDate = today;
      } else {
        // Streak broken — reset to 1
        tracker.currentStreak = 1;
        // keep historical max
        tracker.lastSpinDate = today;
      }
      await tracker.save();
    } else {
      tracker = await StreakTracker.create({
        userId,
        categoryId,
        currentStreak: 1,
        maxStreak: 1,
        lastSpinDate: today,
        totalSpins: 0,
      });
    }

    // Update history with latest streak values
    history.currentStreak = tracker.currentStreak;
    history.maxStreak = tracker.maxStreak;
    await history.save();

    return { history, streak: tracker };
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
