import { LoginFormData, RegisterFormData, AuthResponse, User } from '../types/auth';
import config from "./base";

const API_URL = config.baseUrl;



export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await config.request.post(`${API_URL}/users/login`, data);
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await config.request.post(`${API_URL}/users/register`, data);
    return response.data;
  },

  async getUserProfile(): Promise<{ success: boolean; data: User }> {
    const response = await config.request.get(`${API_URL}/users/profile`);
    return response.data;
  },

  async updateUserProfile(data: {
    nickname?: string;
    signature?: string;
    status?: string;
  }): Promise<{ success: boolean; message: string; data: User }> {
    const response = await config.request.put(`${API_URL}/users/profile`, data);
    return response.data;
  },

  async searchUsers(search: string): Promise<{ success: boolean; data: User[] }> {
    const response = await config.request.get(`${API_URL}/users/search?search=${encodeURIComponent(search)}`);
    return response.data;
  }
}; 