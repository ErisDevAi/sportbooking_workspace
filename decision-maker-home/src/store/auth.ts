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
        set({
          token,
          user: {
            _id: user._id, name: user.name, email: user.email,
            role: user.role || 'viewer',
            isActive: (user as any).isActive ?? true,
            permissions: (user as any).permissions ?? [],
            createdAt: (user as any).createdAt,
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
