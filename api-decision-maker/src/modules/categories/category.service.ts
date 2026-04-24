/**
 * modules/categories/category.service.ts
 *
 * Business logic for categories.
 * - getAll: returns categories owned by the user OR public ones
 * - create: auto-generates slug from name
 * - update/delete: only the owner can modify; default categories cannot be deleted
 */

import { Category, ICategory } from "./category.model";
import { AppError } from "../../middlewares/error.middleware";
import { PaginationMeta } from "../../common/pagination";

export interface CategoriesPage {
  items: ICategory[];
  meta: PaginationMeta;
}

export interface CreateCategoryDto {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  color?: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * Converts a name to a URL-friendly slug.
 * Handles Vietnamese diacritics and special characters.
 */
function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove non-alphanumeric
    .replace(/[\s_]+/g, "-")         // spaces/underscores → hyphens
    .replace(/-+/g, "-")             // collapse multiple hyphens
    .replace(/^-|-$/g, "");          // trim leading/trailing hyphens
}

/**
 * Ensures slug uniqueness by appending a numeric suffix when needed.
 */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Category.findOne(query);
    if (!exists) return slug;
    counter++;
    slug = `${base}-${counter}`;
  }
}

export const categoryService = {
  /**
   * List categories visible to the user:
   *   - all public categories
   *   - plus the user's own private categories
   */
  async getAll(
    userId: string,
    skip: number,
    limit: number,
    page: number,
    search?: string
  ): Promise<CategoriesPage> {
    const filter: Record<string, unknown> = {
      $or: [{ isPublic: true }, { createdBy: userId }],
    };
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const [items, total] = await Promise.all([
      Category.find(filter)
        .populate("createdBy", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ isDefault: -1, createdAt: -1 }),
      Category.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string, userId: string): Promise<ICategory> {
    const cat = await Category.findById(id).populate("createdBy", "name email");
    if (!cat) throw new AppError("Category not found", 404);

    // Only visible if public or owned by the user
    if (!cat.isPublic && String(cat.createdBy._id) !== userId) {
      throw new AppError("Category not found", 404);
    }
    return cat;
  },

  async create(dto: CreateCategoryDto, userId: string): Promise<ICategory> {
    const slug = await uniqueSlug(generateSlug(dto.name));
    if (!slug) throw new AppError("Cannot generate slug from name", 400);

    return Category.create({ ...dto, slug, createdBy: userId });
  },

  async update(id: string, dto: UpdateCategoryDto, userId: string): Promise<ICategory> {
    const cat = await Category.findById(id);
    if (!cat) throw new AppError("Category not found", 404);
    if (String(cat.createdBy) !== userId) {
      throw new AppError("You can only edit your own categories", 403);
    }

    // If name changes, regenerate slug
    const updates: Record<string, unknown> = { ...dto };
    if (dto.name && dto.name !== cat.name) {
      updates.slug = await uniqueSlug(generateSlug(dto.name), id);
    }

    const updated = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");
    if (!updated) throw new AppError("Category not found", 404);
    return updated;
  },

  async delete(id: string, userId: string): Promise<void> {
    const cat = await Category.findById(id);
    if (!cat) throw new AppError("Category not found", 404);
    if (String(cat.createdBy) !== userId) {
      throw new AppError("You can only delete your own categories", 403);
    }
    if (cat.isDefault) {
      throw new AppError("Cannot delete a default category", 400);
    }
    await Category.findByIdAndDelete(id);
  },
};
