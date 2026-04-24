/**
 * modules/auth/auth.service.ts
 *
 * Includes role permission lookup so the JWT carries the user's permissions —
 * this lets checkPermission() work without a DB query on every request.
 */

import { User } from "../users/user.model";
import { Role } from "../roles/role.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/error.middleware";

export interface RegisterDto { name: string; email: string; password: string; }
export interface LoginDto    { email: string; password: string; }

export interface AuthResult {
  token: string;
  user: { id: string; name: string; email: string; role: string };
}

async function getRolePermissions(roleName: string): Promise<string[]> {
  const role = await Role.findOne({ name: roleName });
  return role?.permissions ?? [];
}

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResult> {
    if (await User.findOne({ email: dto.email })) {
      throw new AppError("Email already registered", 409);
    }
    const password = await hashPassword(dto.password);
    const user = await User.create({ ...dto, password, role: "viewer" });

    const permissions = await getRolePermissions(user.role);
    const token = signToken({ userId: String(user._id), email: user.email, role: user.role, permissions });

    return { token, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } };
  },

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await User.findOne({ email: dto.email }).select("+password");
    if (!user) throw new AppError("Invalid email or password", 401);
    if (!user.isActive) throw new AppError("Account is deactivated", 403);

    const valid = await comparePassword(dto.password, user.password);
    if (!valid) throw new AppError("Invalid email or password", 401);

    const permissions = await getRolePermissions(user.role);
    const token = signToken({ userId: String(user._id), email: user.email, role: user.role, permissions });

    return { token, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } };
  },

  async me(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    const permissions = await getRolePermissions(user.role);
    return { ...user.toJSON(), permissions };
  },
};
