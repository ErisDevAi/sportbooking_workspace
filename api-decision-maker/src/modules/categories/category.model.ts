/**
 * modules/categories/category.model.ts
 */

import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  isDefault: boolean;
  isPublic: boolean;
  createdBy: Types.ObjectId;
  choiceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "📁" },
    color: { type: String, default: "#3498DB", match: [/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"] },
    description: { type: String, default: "", maxlength: 500 },
    isDefault: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    choiceCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
