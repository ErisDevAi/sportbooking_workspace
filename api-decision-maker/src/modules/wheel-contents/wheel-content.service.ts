/**
 * modules/wheel-contents/wheel-content.service.ts
 *
 * Business logic for wheel content items (options/slices on the wheel).
 */

import { WheelContent, IWheelContent } from "./wheel-content.model";
import { Category } from "../categories/category.model";
import { AppError } from "../../middlewares/error.middleware";
import { PaginationMeta } from "../../common/pagination";

export interface WheelContentsPage {
  items: IWheelContent[];
  meta: PaginationMeta;
}

export interface CreateWheelContentDto {
  label: string;
  description?: string;
  image?: string;
  color?: string;
  weight?: number;
  categoryId: string;
  isActive?: boolean;
}

export interface UpdateWheelContentDto {
  label?: string;
  description?: string;
  image?: string;
  color?: string;
  weight?: number;
  isActive?: boolean;
}

export const wheelContentService = {
  /**
   * Get all wheel contents for a category (active ones only by default).
   */
  async getByCategory(
    categoryId: string,
    _userId: string,
    skip: number,
    limit: number,
    page: number,
    activeOnly = true
  ): Promise<WheelContentsPage> {
    const filter: Record<string, unknown> = { categoryId };
    if (activeOnly) filter.isActive = true;

    const [items, total] = await Promise.all([
      WheelContent.find(filter)
        .populate("categoryId", "name slug icon")
        .populate("createdBy", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      WheelContent.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Get all active contents for a category (no pagination — used for wheel rendering).
   */
  async getAllForWheel(categoryId: string): Promise<IWheelContent[]> {
    return WheelContent.find({ categoryId, isActive: true }).sort({ createdAt: 1 });
  },

  async getById(id: string): Promise<IWheelContent> {
    const item = await WheelContent.findById(id)
      .populate("categoryId", "name slug icon")
      .populate("createdBy", "name email");
    if (!item) throw new AppError("Wheel content not found", 404);
    return item;
  },

  async create(dto: CreateWheelContentDto, userId: string): Promise<IWheelContent> {
    // Verify category exists
    const category = await Category.findById(dto.categoryId);
    if (!category) throw new AppError("Category not found", 404);

    const item = await WheelContent.create({ ...dto, createdBy: userId });

    // Update choiceCount on category
    const count = await WheelContent.countDocuments({ categoryId: dto.categoryId, isActive: true });
    await Category.findByIdAndUpdate(dto.categoryId, { choiceCount: count });

    return item;
  },

  async update(id: string, dto: UpdateWheelContentDto, userId: string): Promise<IWheelContent> {
    const item = await WheelContent.findById(id);
    if (!item) throw new AppError("Wheel content not found", 404);
    if (String(item.createdBy) !== userId) {
      throw new AppError("You can only edit your own wheel contents", 403);
    }

    const updated = await WheelContent.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate("categoryId", "name slug icon")
      .populate("createdBy", "name email");
    if (!updated) throw new AppError("Wheel content not found", 404);

    // Update choiceCount if isActive changed
    if (dto.isActive !== undefined) {
      const count = await WheelContent.countDocuments({ categoryId: item.categoryId, isActive: true });
      await Category.findByIdAndUpdate(item.categoryId, { choiceCount: count });
    }

    return updated;
  },

  async delete(id: string, userId: string): Promise<void> {
    const item = await WheelContent.findById(id);
    if (!item) throw new AppError("Wheel content not found", 404);
    if (String(item.createdBy) !== userId) {
      throw new AppError("You can only delete your own wheel contents", 403);
    }

    await WheelContent.findByIdAndDelete(id);

    // Update choiceCount
    const count = await WheelContent.countDocuments({ categoryId: item.categoryId, isActive: true });
    await Category.findByIdAndUpdate(item.categoryId, { choiceCount: count });
  },
};
