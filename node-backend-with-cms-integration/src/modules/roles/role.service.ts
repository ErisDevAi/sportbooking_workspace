import { Role, IRole } from "./role.model";
import { AppError } from "../../middlewares/error.middleware";

export const roleService = {
  async getAll(): Promise<IRole[]> {
    return Role.find().sort({ name: 1 });
  },

  async getById(id: string): Promise<IRole> {
    const r = await Role.findById(id);
    if (!r) throw new AppError("Role not found", 404);
    return r;
  },

  async create(data: Partial<IRole>): Promise<IRole> {
    return Role.create(data);
  },

  async update(id: string, data: Partial<IRole>): Promise<IRole> {
    const r = await Role.findById(id);
    if (!r) throw new AppError("Role not found", 404);
    if (r.isSystem) throw new AppError("System roles cannot be modified", 403);
    return (await Role.findByIdAndUpdate(id, data, { new: true }))!;
  },

  async delete(id: string): Promise<void> {
    const r = await Role.findById(id);
    if (!r) throw new AppError("Role not found", 404);
    if (r.isSystem) throw new AppError("System roles cannot be deleted", 403);
    await Role.findByIdAndDelete(id);
  },
};
