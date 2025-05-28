
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://0.0.0.0:8080/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  mainDepartment: string;
  departments: string[];
  isAdmin: boolean;
  isClient: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export class AuthService {
  private static token: string | null = null;
  private static user: User | null = null;

  static getToken(): string | null {
    if (this.token) return this.token;
    return localStorage.getItem('token');
  }

  static getCurrentUser(): User | null {
    if (this.user) return this.user;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { email, apiUrl: API_URL });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed with error:', errorData);
        throw new Error(errorData.message || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      console.log('Login successful for user:', data.user.email);
      
      // Store in memory and localStorage
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  static logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
