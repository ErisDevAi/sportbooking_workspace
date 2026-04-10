/**
 * types/index.ts — shared application types.
 */

export type UserRole = "admin" | "editor" | "viewer";

export type PermissionSlug =
  | "create_user"
  | "edit_user"
  | "delete_user"
  | "view_user"
  | "manage_roles"
  | "manage_permissions"
  | "view_dashboard";
