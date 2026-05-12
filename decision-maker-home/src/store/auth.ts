import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/auth";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: string[];
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: async (email: string, password: string) => {
        const res = await authApi.login({ email, password });
        const { token, user } = res.data.data;
        const u = user as any;
        set({
          token,
          user: {
            _id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role || 'viewer',
            isActive: u.isActive ?? true,
            permissions: u.permissions ?? [],
            createdAt: u.createdAt,
          },
        });
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
