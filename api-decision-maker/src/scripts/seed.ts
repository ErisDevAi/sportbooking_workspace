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
import { WheelContent } from "../modules/wheel-contents/wheel-content.model";
import { SpinHistory, StreakTracker } from "../modules/spin-histories/spin-histories.model";
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
    WheelContent.deleteMany({}),
    SpinHistory.deleteMany({}),
    StreakTracker.deleteMany({}),
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
    { slug: "view_category",       label: "View Categories",     module: "categories",      description: "Can list and view categories" },
    { slug: "create_wheel_content", label: "Create Wheel Content", module: "wheel-contents", description: "Can create wheel content items" },
    { slug: "edit_wheel_content",   label: "Edit Wheel Content",   module: "wheel-contents", description: "Can edit own wheel content items" },
    { slug: "delete_wheel_content", label: "Delete Wheel Content", module: "wheel-contents", description: "Can delete own wheel content items" },
    { slug: "view_wheel_content",   label: "View Wheel Content",   module: "wheel-contents", description: "Can list and view wheel content" },
    { slug: "create_spin",          label: "Create Spin",          module: "spin-history",   description: "Can spin the wheel and record results" },
    { slug: "view_spin_history",    label: "View Spin History",    module: "spin-history",   description: "Can view spin history and streak" },
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
      permissions: [
        "view_user", "edit_user", "view_dashboard",
        "create_category", "edit_category", "delete_category", "view_category",
        "create_wheel_content", "edit_wheel_content", "delete_wheel_content", "view_wheel_content",
        "create_spin", "view_spin_history",
      ],
      isSystem: true,
    },
    {
      name: "viewer",
      label: "Viewer",
      permissions: [
        "view_dashboard",
        "create_category", "edit_category", "delete_category", "view_category",
        "create_wheel_content", "edit_wheel_content", "delete_wheel_content", "view_wheel_content",
        "create_spin", "view_spin_history",
      ],
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
  const categories = await Category.insertMany(defaultCategories);
  logger.info(`Created ${defaultCategories.length} default categories`);

  // ── Wheel Contents (sample data) ─────────────────────────────────────────
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  const wheelContents = [
    // Cuộc sống
    { label: "Dọn dẹp nhà cửa",    categoryId: catMap["cuoc-song"], color: "#2ECC71", weight: 2, createdBy: adminUser!._id },
    { label: "Đi dạo công viên",    categoryId: catMap["cuoc-song"], color: "#27AE60", weight: 1, createdBy: adminUser!._id },
    { label: "Nấu ăn tại nhà",      categoryId: catMap["cuoc-song"], color: "#1ABC9C", weight: 2, createdBy: adminUser!._id },
    { label: "Xem phim ở nhà",      categoryId: catMap["cuoc-song"], color: "#16A085", weight: 1, createdBy: adminUser!._id },
    // Giải trí
    { label: "Xem phim rạp",        categoryId: catMap["giai-tri"], color: "#E67E22", weight: 2, createdBy: adminUser!._id },
    { label: "Chơi game",           categoryId: catMap["giai-tri"], color: "#D35400", weight: 1, createdBy: adminUser!._id },
    { label: "Đọc sách",            categoryId: catMap["giai-tri"], color: "#F39C12", weight: 1, createdBy: adminUser!._id },
    { label: "Nghe nhạc",           categoryId: catMap["giai-tri"], color: "#E74C3C", weight: 1, createdBy: adminUser!._id },
    { label: "Đi cafe",             categoryId: catMap["giai-tri"], color: "#C0392B", weight: 2, createdBy: adminUser!._id },
    // Học tập
    { label: "Học tiếng Anh",       categoryId: catMap["hoc-tap"], color: "#9B59B6", weight: 3, createdBy: adminUser!._id },
    { label: "Đọc tài liệu kỹ thuật", categoryId: catMap["hoc-tap"], color: "#8E44AD", weight: 2, createdBy: adminUser!._id },
    { label: "Làm bài tập",         categoryId: catMap["hoc-tap"], color: "#6C3483", weight: 2, createdBy: adminUser!._id },
    { label: "Xem tutorial YouTube", categoryId: catMap["hoc-tap"], color: "#5B2C6F", weight: 1, createdBy: adminUser!._id },
    // Sức khỏe
    { label: "Chạy bộ 30 phút",     categoryId: catMap["suc-khoe"], color: "#E74C3C", weight: 2, createdBy: adminUser!._id },
    { label: "Tập yoga",            categoryId: catMap["suc-khoe"], color: "#C0392B", weight: 1, createdBy: adminUser!._id },
    { label: "Đi bơi",              categoryId: catMap["suc-khoe"], color: "#922B21", weight: 1, createdBy: adminUser!._id },
    { label: "Tập gym",             categoryId: catMap["suc-khoe"], color: "#641E16", weight: 2, createdBy: adminUser!._id },
    // Công việc
    { label: "Làm task ưu tiên cao", categoryId: catMap["cong-viec"], color: "#3498DB", weight: 3, createdBy: adminUser!._id },
    { label: "Họp team",            categoryId: catMap["cong-viec"], color: "#2980B9", weight: 1, createdBy: adminUser!._id },
    { label: "Review code",         categoryId: catMap["cong-viec"], color: "#1F618D", weight: 2, createdBy: adminUser!._id },
    { label: "Viết documentation",  categoryId: catMap["cong-viec"], color: "#154360", weight: 1, createdBy: adminUser!._id },
  ];

  await WheelContent.insertMany(wheelContents);
  logger.info(`Created ${wheelContents.length} wheel content items`);

  // Update choiceCount for each category
  for (const cat of categories) {
    const count = await WheelContent.countDocuments({ categoryId: cat._id, isActive: true });
    await Category.findByIdAndUpdate(cat._id, { choiceCount: count });
  }
  logger.info("Updated choiceCount for all categories");

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
