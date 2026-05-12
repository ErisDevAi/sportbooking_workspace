/**
 * modules/dashboard/dashboard.service.ts
 *
 * Aggregates real counts from the DB for admin dashboard.
 */

import { User } from "../users/user.model";
import { Role } from "../roles/role.model";
import { Permission } from "../permissions/permission.model";
import { Category } from "../categories/category.model";
import { WheelContent } from "../wheel-contents/wheel-content.model";
import { SpinHistory } from "../spin-histories/spin-histories.model";
import { UserStreak } from "../user-streaks/user-streak.model";
import { Backup } from "../backup/backup.model";

export const dashboardService = {
  async getStats() {
    const [
      totalUsers, activeUsers, totalRoles, totalPermissions,
      totalCategories, totalSpins, totalWheelContents, totalBackups,
      totalStreaks, completedDecisions, pendingDecisions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Role.countDocuments(),
      Permission.countDocuments(),
      Category.countDocuments(),
      SpinHistory.countDocuments(),
      WheelContent.countDocuments(),
      Backup.countDocuments(),
      UserStreak.countDocuments(),
      SpinHistory.countDocuments({ status: "completed" }),
      SpinHistory.countDocuments({ status: "pending" }),
    ]);

    // Users by role
    const byRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // 7-day spin activity from real data
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailySpins = await SpinHistory.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const activity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const found = dailySpins.find((s) => s._id === dateStr);
      return { date: dateStr, spins: found ? found.count : 0 };
    });

    // Top streaks
    const topStreaks = await UserStreak.find()
      .populate("userId", "name email")
      .sort({ longestStreak: -1 })
      .limit(5);

    return {
      totals: {
        users: totalUsers,
        activeUsers,
        roles: totalRoles,
        permissions: totalPermissions,
        categories: totalCategories,
        spins: totalSpins,
        wheelContents: totalWheelContents,
        backups: totalBackups,
        streaks: totalStreaks,
        completedDecisions,
        pendingDecisions,
      },
      usersByRole: byRole.map((r) => ({ role: r._id as string, count: r.count as number })),
      activity,
      topStreaks: topStreaks.map((s) => ({
        user: s.userId,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        level: s.level,
        totalCheckins: s.totalCheckins,
      })),
      system: {
        status: "healthy",
        version: "1.0.0",
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
      },
    };
  },
};
