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

  smartSpin: (categoryId: string) =>
    apiClient.post<ApiResponse<{ history: SpinHistory; streak: Streak; selected: any }>>(
      '/spin-history/smart-spin',
      { categoryId }
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

  verifyAndReview: (historyId: string, data: { rating?: number; reviewNote?: string }) =>
    apiClient.patch<ApiResponse<SpinHistory>>(
      `/spin-history/${historyId}/verify`,
      data
    ),
};