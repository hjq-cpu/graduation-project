import axios from 'axios';
import { LoginFormData, RegisterFormData, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:3001';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/users/login`, data);
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/users/register`, data);
    return response.data;
  }
}; 