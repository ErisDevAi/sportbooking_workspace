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
import { Category } from "../modules/categories/category.model";
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
    Category.deleteMany({}),
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
    { slug: "create_category",     label: "Create Category",     module: "categories",  description: "Can create categories" },
    { slug: "edit_category",       label: "Edit Category",       module: "categories",  description: "Can edit own categories" },
    { slug: "delete_category",     label: "Delete Category",     module: "categories",  description: "Can delete own categories" },
    { slug: "view_category",       label: "View Categories",     module: "categories",  description: "Can list and view categories" },
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
      permissions: ["view_user", "edit_user", "view_dashboard", "create_category", "edit_category", "delete_category", "view_category"],
      isSystem: true,
    },
    {
      name: "viewer",
      label: "Viewer",
      permissions: ["view_user", "view_dashboard", "view_category"],
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

  // ── Default Categories ───────────────────────────────────────────────────
  const adminUser = await User.findOne({ email: "admin@example.com" });
  const defaultCategories = [
    { name: "Cuộc sống",     slug: "cuoc-song",     icon: "🏠", color: "#2ECC71", description: "Quyết định liên quan đến cuộc sống hàng ngày",         isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Công việc",     slug: "cong-viec",     icon: "💼", color: "#3498DB", description: "Quyết định liên quan đến công việc và sự nghiệp",      isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Tài chính",     slug: "tai-chinh",     icon: "💰", color: "#F1C40F", description: "Quyết định liên quan đến tài chính và đầu tư",         isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Sức khỏe",      slug: "suc-khoe",      icon: "❤️", color: "#E74C3C", description: "Quyết định liên quan đến sức khỏe và thể chất",       isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Học tập",       slug: "hoc-tap",       icon: "📚", color: "#9B59B6", description: "Quyết định liên quan đến học tập và phát triển bản thân", isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Giải trí",      slug: "giai-tri",      icon: "🎮", color: "#E67E22", description: "Quyết định liên quan đến giải trí và thư giãn",        isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Mối quan hệ",   slug: "moi-quan-he",   icon: "👥", color: "#1ABC9C", description: "Quyết định liên quan đến các mối quan hệ xã hội",      isDefault: true, isPublic: true, createdBy: adminUser!._id },
    { name: "Khác",          slug: "khac",          icon: "📁", color: "#95A5A6", description: "Các quyết định không thuộc danh mục cụ thể",           isDefault: true, isPublic: true, createdBy: adminUser!._id },
  ];
  await Category.insertMany(defaultCategories);
  logger.info(`Created ${defaultCategories.length} default categories`);

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
