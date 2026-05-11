import apiClient from './client';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Role {
  _id: string;
  name: string;
  label: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export const rolesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Role[]>>('/roles'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Role>>(`/roles/${id}`),

  create: (data: { name: string; label: string; permissions: string[] }) =>
    apiClient.post<ApiResponse<Role>>('/roles', data),

  update: (id: string, data: { name?: string; label?: string; permissions?: string[] }) =>
    apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/roles/${id}`),
};
