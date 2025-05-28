import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : '/api';

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

// WhatsApp API
export const whatsappApi = {
  connect: (userId = 'user_1') => apiClient.post('/integrations/whatsapp/connect', { userId }),
  disconnect: (userId = 'user_1') => apiClient.post('/integrations/whatsapp/disconnect', { userId }),
  getStatus: (userId = 'user_1') => apiClient.get(`/integrations/whatsapp/status?userId=${userId}`),
  sendMessage: (data: { to: string; message: string; caseId?: string }) => 
    apiClient.post('/whatsapp/send', data)
};

// Email API
export const emailApi = {
  connect: (provider: string, email: string, password: string) => 
    apiClient.post('/integrations/email/connect', { provider, email, password }),
  disconnect: () => apiClient.post('/integrations/email/disconnect'),
  getStatus: (userId = 'user_1') => apiClient.get(`/integrations/email/status?userId=${userId}`),
  sendMessage: (data: { to: string; subject: string; content: string; caseId?: string }) => 
    apiClient.post('/email/send', data)
};