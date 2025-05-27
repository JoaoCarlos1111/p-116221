
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/integrations';

// Mock user ID - replace with actual auth
const getUserId = () => 'user_1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'user-id': getUserId()
  }
});

export const whatsappApi = {
  connect: () => api.post('/whatsapp/connect'),
  disconnect: () => api.post('/whatsapp/disconnect'),
  getStatus: () => api.get('/whatsapp/status'),
  sendMessage: (to: string, message: string) => 
    api.post('/whatsapp/send', { to, message })
};

export const emailApi = {
  connect: (provider: string, email: string, password: string) =>
    api.post('/email/connect', { provider, email, password }),
  disconnect: () => api.post('/email/disconnect'),
  getStatus: () => api.get('/email/status'),
  sendEmail: (to: string, subject: string, body: string) =>
    api.post('/email/send', { to, subject, body })
};
