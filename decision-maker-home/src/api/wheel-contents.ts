import apiClient from './client';
import type { WheelContent } from '@/types/wheel-contents';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export const wheelContentsApi = {
  getAll: (categoryId: string, page = 1, limit = 10) =>
    apiClient.get<ApiResponse<WheelContent[]>>('/wheel-contents', {
      params: { categoryId, page, limit },
    }),
  getForWheel: (categoryId: string) =>
    apiClient.get<ApiResponse<WheelContent[]>>(
      `/wheel-contents/wheel/${categoryId}`
    ),
  getById: (id: string) =>
    apiClient.get<ApiResponse<WheelContent>>(`/wheel-contents/${id}`),
  create: (data: FormData) =>
    apiClient.post<ApiResponse<WheelContent>>('/wheel-contents', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    apiClient.put<ApiResponse<WheelContent>>(`/wheel-contents/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/wheel-contents/${id}`),
};