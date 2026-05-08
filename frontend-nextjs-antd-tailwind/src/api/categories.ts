import apiClient from './client';
import type { Category } from '@/types/category';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export const categoriesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Category[]>>('/categories'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${id}`),

  create: (data: {
    name: string;
    icon?: string;
    color?: string;
    description?: string;
    isPublic?: boolean;
  }) => apiClient.post<ApiResponse<Category>>('/categories', data),

  update: (
    id: string,
    data: Partial<{ name: string; icon: string; color: string; description: string }>
  ) => apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/categories/${id}`),
};