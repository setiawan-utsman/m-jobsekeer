export interface User {
  password?: any;
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | string;
  status: 'active' | 'inactive' | string;
  avatar?: string;
  about?: string;
  location?: string;
  phone?:string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  status: string;
  exp: number;
}