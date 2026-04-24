import { Permission, IPermission } from "./permission.model";
import { AppError } from "../../middlewares/error.middleware";

export const permissionService = {
  async getAll(): Promise<IPermission[]> {
    return Permission.find().sort({ module: 1, slug: 1 });
  },

  async getByModule(module: string): Promise<IPermission[]> {
    return Permission.find({ module }).sort({ slug: 1 });
  },

  async create(data: Partial<IPermission>): Promise<IPermission> {
    return Permission.create(data);
  },

  async delete(id: string): Promise<void> {
    const p = await Permission.findByIdAndDelete(id);
    if (!p) throw new AppError("Permission not found", 404);
  },
};
