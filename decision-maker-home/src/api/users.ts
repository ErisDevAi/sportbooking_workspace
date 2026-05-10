import apiClient from './client';
import type { User } from '@/types/user';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const usersApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params: { page, limit } }),
  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post<ApiResponse<User>>('/users', data),
  update: (id: string, data: Partial<Pick<User, 'name' | 'email' | 'role' | 'isActive'>>) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/users/${id}`),
};
