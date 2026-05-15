/**
 * scripts/fix-viewer-permissions.ts
 *
 * One-time migration: update the "viewer" role to include full content CRUD permissions.
 * This fixes existing users who registered with role "viewer" but need create/edit/delete access.
 *
 * Run: npx ts-node src/scripts/fix-viewer-permissions.ts
 */

import "../configs/env";
import mongoose from "mongoose";
import { env } from "../configs/env";
import { Role } from "../modules/roles/role.model";
import { logger } from "../utils/logger";

async function fix() {
  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB");

  const viewerRole = await Role.findOne({ name: "viewer" });
  if (!viewerRole) {
    logger.error("Role 'viewer' not found. Run seed first.");
    process.exit(1);
  }

  const requiredPermissions = [
    "view_dashboard",
    "create_category", "edit_category", "delete_category", "view_category",
    "create_wheel_content", "edit_wheel_content", "delete_wheel_content", "view_wheel_content",
    "create_spin", "view_spin_history",
  ];

  const before = [...viewerRole.permissions];
  const merged = [...new Set([...viewerRole.permissions, ...requiredPermissions])];

  viewerRole.permissions = merged;
  await viewerRole.save();

  const added = merged.filter((p) => !before.includes(p));

  logger.info(`
──────────────────────────────────────────────────────
  Viewer role permissions updated!

  Before: ${before.length} permissions
  After:  ${merged.length} permissions
  Added:  ${added.length > 0 ? added.join(", ") : "(none, already up to date)"}

  Existing viewer users will get new permissions
  on their next login (JWT refresh).
──────────────────────────────────────────────────────`);

  await mongoose.disconnect();
}

fix().catch((err) => {
  logger.error("Fix failed:", err);
  process.exit(1);
});
