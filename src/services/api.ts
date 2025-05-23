
import axios from 'axios';

// Get the current host dynamically to handle different environments
const currentHost = window.location.hostname;
const port = '5000';

const api = axios.create({
  baseURL: `http://${currentHost}:${port}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor para log de erros
api.interceptors.response.use(
  response => {
    console.log('API Success:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

// Interceptor para adicionar retentativas em caso de falha de rede
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      method: config.method
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
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
      // Criar um caso para cada marca
      const cases = prospectionData.brands.map(brand => ({
        brand,
        storeUrl: prospectionData.storeUrl,
        adUrl: prospectionData.adUrl,
        status: 'received',
        column: 'received',
        createdAt: new Date().toISOString()
      }));

      console.log('Sending cases to API:', cases);
      const response = await api.post('/cases/batch', { cases });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar casos:', error);
      throw error;
    }
  }
};

export const UsersService = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }
};

export const PaymentsService = {
  getAll: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      throw error;
    }
  }
};
