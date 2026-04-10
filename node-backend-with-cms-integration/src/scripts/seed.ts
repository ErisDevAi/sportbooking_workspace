/**
 * scripts/seed.ts
 *
 * Seeds the database with:
 *   - 7 permissions (create_user, edit_user, delete_user, view_user,
 *                    manage_roles, manage_permissions, view_dashboard)
 *   - 3 roles (admin, editor, viewer) with appropriate permission sets
 *   - 3 users (admin / editor / viewer)
 *
 * Run: npm run seed
 * WARNING: Clears existing data first.
 */

import "../configs/env";
import mongoose from "mongoose";
import { env } from "../configs/env";
import { User } from "../modules/users/user.model";
import { Role } from "../modules/roles/role.model";
import { Permission } from "../modules/permissions/permission.model";
import { hashPassword } from "../utils/hash";
import { logger } from "../utils/logger";

async function seed() {
  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB");

  // ── Wipe ──────────────────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Role.deleteMany({}),
    Permission.deleteMany({}),
  ]);
  logger.info("Cleared existing data");

  // ── Permissions ───────────────────────────────────────────────────────────
  const permDefs = [
    { slug: "create_user",         label: "Create User",         module: "users",       description: "Can create new users" },
    { slug: "edit_user",           label: "Edit User",           module: "users",       description: "Can update user details" },
    { slug: "delete_user",         label: "Delete User",         module: "users",       description: "Can delete users" },
    { slug: "view_user",           label: "View Users",          module: "users",       description: "Can list and view users" },
    { slug: "manage_roles",        label: "Manage Roles",        module: "roles",       description: "Can create, update, delete roles" },
    { slug: "manage_permissions",  label: "Manage Permissions",  module: "permissions", description: "Can create and delete permissions" },
    { slug: "view_dashboard",      label: "View Dashboard",      module: "dashboard",   description: "Can view dashboard stats" },
  ];
  await Permission.insertMany(permDefs);
  logger.info(`Created ${permDefs.length} permissions`);

  // ── Roles ─────────────────────────────────────────────────────────────────
  await Role.insertMany([
    {
      name: "admin",
      label: "Administrator",
      permissions: permDefs.map((p) => p.slug), // all permissions
      isSystem: true,
    },
    {
      name: "editor",
      label: "Editor",
      permissions: ["view_user", "edit_user", "view_dashboard"],
      isSystem: true,
    },
    {
      name: "viewer",
      label: "Viewer",
      permissions: ["view_user", "view_dashboard"],
      isSystem: true,
    },
  ]);
  logger.info("Created 3 roles");

  // ── Users ─────────────────────────────────────────────────────────────────
  const password = await hashPassword("password123");
  await User.insertMany([
    { name: "Admin User",  email: "admin@example.com",  password, role: "admin",  isActive: true },
    { name: "Editor User", email: "editor@example.com", password, role: "editor", isActive: true },
    { name: "Viewer User", email: "viewer@example.com", password, role: "viewer", isActive: true },
  ]);
  logger.info("Created 3 users");

  logger.info(`
──────────────────────────────────────────────────────
  Seed complete. Test credentials:

  admin@example.com   / password123  (role: admin)
  editor@example.com  / password123  (role: editor)
  viewer@example.com  / password123  (role: viewer)

  POST /auth/login  →  returns { token, user }
──────────────────────────────────────────────────────`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  logger.error("Seed failed:", err);
  process.exit(1);
});
