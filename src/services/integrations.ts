import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : `${window.location.protocol}//${window.location.hostname}:3001/api`;

console.log('🔗 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
  console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export const whatsappApi = {
  connect: (userId = 'user_1') => {
    return apiClient.post('/integrations/whatsapp/connect', { userId });
  },
  disconnect: (userId = 'user_1') => {
    return apiClient.post('/integrations/whatsapp/disconnect', { userId });
  },
  getStatus: (userId = 'user_1') => {
    return apiClient.get(`/integrations/whatsapp/status?userId=${userId}`);
  }
};

export const emailApi = {
  connect: (provider: string, email: string, password: string, userId = 'user_1') => {
    return apiClient.post('/integrations/email/connect', { 
      provider, 
      email, 
      password, 
      userId 
    });
  },
  disconnect: (userId = 'user_1') => {
    return apiClient.post('/integrations/email/disconnect', { userId });
  },
  getStatus: (userId = 'user_1') => {
    return apiClient.get(`/integrations/email/status?userId=${userId}`);
  }
};