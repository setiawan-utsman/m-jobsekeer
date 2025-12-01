import { api } from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';
import { API_CONFIG } from '@utils/constants';
import { mockApi } from './mockApi';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.post<AuthResponse>('/auth/login', credentials);
    }
    return await api.post<AuthResponse>('/auth/login', credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.post<AuthResponse>('/auth/register', data);;
    }
    return await api.post<AuthResponse>('/auth/register', data);
  }

  async getCurrentUser(): Promise<User> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<User>('/auth/me');;
    }
    return await api.get<User>('/auth/me');
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async refreshToken(): Promise<{ token: string }> {
    return await api.post<{ token: string }>('/auth/refresh');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return await api.post('/auth/reset-password', { token, password });
  }
}

export const authService = new AuthService();