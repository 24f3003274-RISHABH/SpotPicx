import { apiClient } from '../api/apiClient';
import { User, AuthResponseData, UserRole } from '../types';

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  city?: string;
  bio?: string;
}

export interface LoginPayload {
  email: string; // Accepts email or username
  password: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response: any = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  /**
   * Log in user
   */
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response: any = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  /**
   * Refresh JWT token
   */
  async refresh(refreshToken?: string): Promise<AuthResponseData> {
    const response: any = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    const response: any = await apiClient.get('/auth/me');
    return response.data.user;
  },

  /**
   * Get all registered users (Admin only)
   */
  async getAllUsers(): Promise<{ users: User[]; total: number }> {
    const response: any = await apiClient.get('/auth/users');
    return response.data;
  },

  /**
   * Update a user's role (Admin only)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const response: any = await apiClient.patch(`/auth/users/${userId}/role`, { role });
    return response.data.user;
  },
};
