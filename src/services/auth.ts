import { api } from './api';

export const departments = {
  ADMIN: 'admin',
  PROSPECCAO: 'prospeccao',
  VERIFICACAO: 'verificacao',
  AUDITORIA: 'auditoria',
  APROVACAO: 'aprovacao',
  LOGISTICA: 'logistica',
  IP_TOOLS: 'ip_tools',
  ATENDIMENTO: 'atendimento',
  FINANCEIRO: 'financeiro',
  CLIENT: 'client'
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  departments: string[];
  mainDepartment: string;
  isAdmin: boolean;
  isClient?: boolean;
  clientProfile?: string;
  brands?: string[];
  company?: string;
}

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token for future requests
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { token, user };
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas');
      } else if (error.response?.status === 400) {
        throw new Error('Email e senha são obrigatórios');
      } else {
        throw new Error('Erro de conexão. Tente novamente.');
      }
    }
  },

  async verifyToken(): Promise<AuthUser | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/auth/verify');
      const { user } = response.data;

      return user;
    } catch (error) {
      console.error('Token verification failed:', error);
      this.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }
};

// Initialize token on app start
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}