
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
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

export const CasesService = {
  getAll: async () => {
    const response = await api.get('/cases');
    return response.data;
  },
  
  create: async (prospectionData: {
    storeUrl: string;
    adUrl: string;
    brands: string[];
  }) => {
    // Criar um caso para cada marca
    const cases = prospectionData.brands.map(brand => ({
      brand,
      storeUrl: prospectionData.storeUrl,
      adUrl: prospectionData.adUrl,
      status: 'received',
      column: 'received',
      createdAt: new Date().toISOString()
    }));

    const response = await api.post('/cases/batch', { cases });
    return response.data;
  }
};

export const UsersService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

export const PaymentsService = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  }
};
