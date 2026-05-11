import apiClient from './client';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Permission {
  _id: string;
  slug: string;
  label: string;
  description: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export const permissionsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Permission[]>>('/permissions'),

  create: (data: { slug: string; label: string; description?: string; module: string }) =>
    apiClient.post<ApiResponse<Permission>>('/permissions', data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/permissions/${id}`),
};
