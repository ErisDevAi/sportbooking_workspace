import apiClient from './client';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthResult {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResult>>('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get<ApiResponse<AuthUser>>('/auth/me'),
};
