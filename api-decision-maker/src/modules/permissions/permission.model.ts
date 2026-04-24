/**
 * modules/permissions/permission.model.ts
 *
 * A Permission is one atomic action that can be granted to a Role.
 * Slug convention: snake_case action name — e.g. "create_user", "view_dashboard".
 */

import mongoose, { Document, Schema } from "mongoose";

export interface IPermission extends Document {
  slug: string;
  label: string;
  description: string;
  module: string;
  createdAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    module: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true, versionKey: false }
);

export const Permission = mongoose.model<IPermission>("Permission", PermissionSchema);
