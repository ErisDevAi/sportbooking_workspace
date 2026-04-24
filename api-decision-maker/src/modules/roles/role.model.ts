/**
 * modules/roles/role.model.ts
 *
 * A Role groups a set of permission slugs.
 * Users get their permissions by looking up their assigned role.
 */

import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  name: string;
  label: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    permissions: { type: [String], default: [] },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);
