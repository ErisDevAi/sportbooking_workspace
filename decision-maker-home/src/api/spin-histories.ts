import apiClient from './client';
import type { SpinHistory, Streak, SpinStats } from '@/types/spin-histories';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const spinHistoryApi = {
  create: (data: { categoryId: string; selectedContentId: string }) =>
    apiClient.post<ApiResponse<{ history: SpinHistory; streak: Streak }>>(
      '/spin-history',
      data
    ),

  getAll: (params?: { categoryId?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<SpinHistory[]>>('/spin-history', { params }),

  getStreak: (categoryId?: string) =>
    apiClient.get<ApiResponse<Streak[]>>('/spin-history/streak', {
      params: categoryId ? { categoryId } : {},
    }),

  getStats: (categoryId: string) =>
    apiClient.get<ApiResponse<SpinStats[]>>(
      `/spin-history/stats/${categoryId}`
    ),
};