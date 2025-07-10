import { LoginFormData, RegisterFormData, AuthResponse, User } from '../types/auth';
import config from "./base";

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await config.request.post("/users/login", data);
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await config.request.post("/users/register", data);
    return response.data;
  },

  async getUserProfile(): Promise<{ success: boolean; data: User }> {
    try {
      console.log('Attempting to get user profile...');
      const response = await config.request.get("/users/profile");
      console.log('User profile response:', response);
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(data: {
    nickname?: string;
    signature?: string;
    status?: string;
  }): Promise<{ success: boolean; message: string; data: User }> {
    const response = await config.request.put("/users/profile", data);
    return response.data;
  },

  async searchUsers(search: string): Promise<{ success: boolean; data: User[] }> {
    const response = await config.request.get(`/users/search?search=${encodeURIComponent(search)}`);
    return response.data;
  }
}; 