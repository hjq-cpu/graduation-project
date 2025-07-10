export type UserStatusType = 'online' | 'away' | 'busy' | 'offline';

export interface User {
  unreadCount: number;
  online: boolean | undefined;
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatusType;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  username: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user:{
    avatar:string;
    email:string;
    id:string;
    nickname:string;
  }
} 