/**
 * modules/dashboard/dashboard.service.ts
 *
 * Aggregates real counts from the DB + generates mock analytics data.
 * Replace the mock section with real aggregation pipelines as the app grows.
 */

import { User } from "../users/user.model";
import { Role } from "../roles/role.model";
import { Permission } from "../permissions/permission.model";
import { Category } from "../categories/category.model";
import { SpinHistory } from "../spin-histories/spin-histories.model";

export const dashboardService = {
  async getStats() {
    const [totalUsers, activeUsers, totalRoles, totalPermissions, totalCategories, totalSpins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Role.countDocuments(),
      Permission.countDocuments(),
      Category.countDocuments(),
      SpinHistory.countDocuments(),
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

    return {
      totals: { users: totalUsers, activeUsers, roles: totalRoles, permissions: totalPermissions, categories: totalCategories, spins: totalSpins },
      usersByRole: byRole.map((r) => ({ role: r._id as string, count: r.count as number })),
      activity,
      system: {
        status: "healthy",
        version: "1.0.0",
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
      },
    };
  },
};
