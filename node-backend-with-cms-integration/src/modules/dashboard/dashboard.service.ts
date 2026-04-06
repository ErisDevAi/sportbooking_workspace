/**
 * modules/dashboard/dashboard.service.ts
 *
 * Aggregates real counts from the DB + generates mock analytics data.
 * Replace the mock section with real aggregation pipelines as the app grows.
 */

import { User } from "../users/user.model";
import { Role } from "../roles/role.model";
import { Permission } from "../permissions/permission.model";

export const dashboardService = {
  async getStats() {
    const [totalUsers, activeUsers, totalRoles, totalPermissions] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Role.countDocuments(),
      Permission.countDocuments(),
    ]);

    // Users by role
    const byRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // Mock 7-day activity
    const now = new Date();
    const activity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString().slice(0, 10),
        newUsers: Math.floor(Math.random() * 8),
        logins: Math.floor(Math.random() * 50) + 5,
        apiCalls: Math.floor(Math.random() * 300) + 50,
      };
    });

    return {
      totals: { users: totalUsers, activeUsers, roles: totalRoles, permissions: totalPermissions },
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
