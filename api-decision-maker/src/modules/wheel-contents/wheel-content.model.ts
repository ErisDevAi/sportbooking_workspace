/**
 * modules/wheel-contents/wheel-content.model.ts
 *
 * Each wheel content represents one option/slice on the lucky wheel.
 * Belongs to a category. Optionally has an image.
 */

import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWheelContent extends Document {
  label: string;
  description: string;
  image: string; // file path or URL, empty if no image
  color: string;
  weight: number; // probability weight (higher = more likely)
  categoryId: Types.ObjectId;
  createdBy: Types.ObjectId;
  isActive: boolean;
  timesSelected: number; // how many times this choice was selected
  lastSelectedAt: Date | null; // when it was last selected
  createdAt: Date;
  updatedAt: Date;
}

const WheelContentSchema = new Schema<IWheelContent>(
  {
    label: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    description: { type: String, default: "", maxlength: 1000 },
    image: { type: String, default: "" },
    color: { type: String, default: "#3498DB", match: [/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"] },
    weight: { type: Number, default: 1, min: 1, max: 100 },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    timesSelected: { type: Number, default: 0, min: 0 },
    lastSelectedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "wheel-contents",
  }
);

WheelContentSchema.index({ categoryId: 1, isActive: 1 });
WheelContentSchema.index({ createdBy: 1 });

export const WheelContent = mongoose.model<IWheelContent>("WheelContent", WheelContentSchema);
