import apiClient from './client';
import type { UserStreak } from '@/types/user-streak';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export const userStreakApi = {
  getMyStreak: () =>
    apiClient.get<ApiResponse<UserStreak>>('/streaks/me'),

  getLeaderboard: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<UserStreak[]>>('/streaks/leaderboard', { params }),
};
