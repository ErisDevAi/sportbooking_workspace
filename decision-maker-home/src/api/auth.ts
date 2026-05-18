import apiClient from './client';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: string[];
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

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResult>>('/auth/login', data),
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<AuthResult>>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get<ApiResponse<AuthUser>>('/auth/me'),
};
