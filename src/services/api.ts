import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const CasesService = {
  getAll: async () => {
    try {
      const response = await api.get('/cases');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      throw error;
    }
  },

  create: async (prospectionData: {
    storeUrl: string;
    adUrl: string;
    brands: string[];
  }) => {
    try {
      const cases = prospectionData.brands.map(brand => ({
        brand,
        storeUrl: prospectionData.storeUrl,
        adUrl: prospectionData.adUrl,
        status: 'received'
      }));

      const response = await api.post('/cases/batch', { cases });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar casos:', error);
      throw error;
    }
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats?: any;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Test endpoint
  async test() {
    return this.request<{ message: string; timestamp: string }>('/api/test');
  }

  // Cases API
  async getCases(params?: { 
    status?: string; 
    brand?: string; 
    assignedTo?: string; 
  } & PaginationParams) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const endpoint = `/api/cases${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<ApiResponse<any[]>>(endpoint);
  }

  async getCase(id: string) {
    return this.request<ApiResponse<any>>(`/api/cases/${id}`);
  }

  async createCase(data: {
    code: string;
    debtorName: string;
    totalAmount: number;
    currentPayment?: number;
    status?: string;
    userId: string;
    brandId?: string;
  }) {
    return this.request<ApiResponse<any>>('/api/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCase(id: string, data: any) {
    return this.request<ApiResponse<any>>(`/api/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCase(id: string) {
    return this.request<ApiResponse<any>>(`/api/cases/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers(params?: { 
    department?: string; 
    isActive?: boolean; 
  } & PaginationParams) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const endpoint = `/api/users${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<ApiResponse<any[]>>(endpoint);
  }

  async getUser(id: string) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`);
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    mainDepartment: string;
    departments?: string[];
    brands?: string[];
    isAdmin?: boolean;
    isClient?: boolean;
    clientProfile?: string;
    company?: string;
  }) {
    return this.request<ApiResponse<any>>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deactivateUser(id: string) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments API
  async getPayments(params?: {
    status?: string;
    caseId?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
  } & PaginationParams) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const endpoint = `/api/payments${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<ApiResponse<any[]>>(endpoint);
  }

  async getPayment(id: string) {
    return this.request<ApiResponse<any>>(`/api/payments/${id}`);
  }

  async createPayment(data: {
    amount: number;
    status?: string;
    caseId: string;
  }) {
    return this.request<ApiResponse<any>>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(id: string, data: any) {
    return this.request<ApiResponse<any>>(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePayment(id: string) {
    return this.request<ApiResponse<any>>(`/api/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Brands API
  async getBrands(params?: { search?: string } & PaginationParams) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const endpoint = `/api/brands${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<ApiResponse<any[]>>(endpoint);
  }

  async getBrand(id: string) {
    return this.request<ApiResponse<any>>(`/api/brands/${id}`);
  }

  async createBrand(data: { name: string }) {
    return this.request<ApiResponse<any>>('/api/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: string, data: { name: string }) {
    return this.request<ApiResponse<any>>(`/api/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBrand(id: string) {
    return this.request<ApiResponse<any>>(`/api/brands/${id}`, {
      method: 'DELETE',
    });
  }
}

// Templates e PDFs
export const templateAPI = {
  generatePDF: (templateId: string, caseId: string, data: any) =>
    api.post(`/templates/${templateId}/generate-pdf`, { caseId, data }),

  generateNotification: (caseId: string) =>
    api.post(`/templates/generate-notification/${caseId}`),

  getTemplateFields: (templateId: string) =>
    api.get(`/templates/${templateId}/fields`)
};

// E-mail
export const emailAPI = {
  sendNotification: (caseId: string, recipientEmail: string, pdfPath?: string) =>
    api.post('/email/send-notification', { caseId, recipientEmail, pdfPath }),

  getEmailHistory: (caseId: string) =>
    api.get(`/email/history/${caseId}`),

  retryFailedEmails: () =>
    api.post('/email/retry-failed')
};

// Metrics API
export const metricsAPI = {
  getMetrics: (filters?: {
    dateFrom?: string;
    dateTo?: string;
    brand?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value);
      });
    }
    const endpoint = `/api/metrics${queryParams.toString() ? `?${queryParams}` : ''}`;
    return api.get(endpoint);
  },

  getDashboardMetrics: (type: string, filters?: any) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const endpoint = `/api/metrics/dashboard/${type}${queryParams.toString() ? `?${queryParams}` : ''}`;
    return api.get(endpoint);
  },

  getRecentCases: (limit?: number) =>
    api.get(`/api/metrics/cases/recent${limit ? `?limit=${limit}` : ''}`),

  getMonthlyPerformance: (months?: number) =>
    api.get(`/api/metrics/performance/monthly${months ? `?months=${months}` : ''}`),

  getBrandStats: () =>
    api.get('/api/metrics/brands/stats')
};

export default api;