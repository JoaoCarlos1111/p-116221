
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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

export default api;
