import apiClient from './client';
import type { Backup } from '@/types/backup';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export const backupApi = {
  create: (note?: string) =>
    apiClient.post<ApiResponse<Backup>>('/backup/create', { note }),

  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<Backup[]>>('/backup/list', { params }),

  restore: (id: string) =>
    apiClient.post<ApiResponse<{ restoredCollections: string[] }>>(`/backup/restore/${id}`),

  download: (id: string) =>
    apiClient.get(`/backup/download/${id}`, { responseType: 'blob' }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/backup/${id}`),
};
