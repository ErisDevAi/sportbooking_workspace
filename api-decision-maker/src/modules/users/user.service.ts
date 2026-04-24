/**
 * modules/users/user.service.ts
 *
 * All database logic for users.
 * Returns raw documents — controllers wrap them in respond.ok().
 */

import { User, IUser } from "./user.model";
import { hashPassword } from "../../utils/hash";
import { AppError } from "../../middlewares/error.middleware";
import { PaginationMeta } from "../../common/pagination";

export interface UsersPage {
  items: IUser[];
  meta: PaginationMeta;
}

export interface CreateUserDto {
  name: string; email: string; password: string; role?: string;
}
export interface UpdateUserDto {
  name?: string; email?: string; role?: string; isActive?: boolean;
}

export const userService = {
  async getAll(skip: number, limit: number, page: number): Promise<UsersPage> {
    const [items, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async getById(id: string): Promise<IUser> {
    const u = await User.findById(id);
    if (!u) throw new AppError("User not found", 404);
    return u;
  },

  async create(dto: CreateUserDto): Promise<IUser> {
    if (await User.findOne({ email: dto.email })) {
      throw new AppError("Email already in use", 409);
    }
    const password = await hashPassword(dto.password);
    return User.create({ ...dto, password });
  },

  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    if (dto.email) {
      const conflict = await User.findOne({ email: dto.email, _id: { $ne: id } });
      if (conflict) throw new AppError("Email already in use", 409);
    }
    const u = await User.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
    if (!u) throw new AppError("User not found", 404);
    return u;
  },

  async delete(id: string): Promise<void> {
    const u = await User.findByIdAndDelete(id);
    if (!u) throw new AppError("User not found", 404);
  },
};
