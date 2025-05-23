
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const CasesService = {
  getAll: async () => {
    const response = await api.get('/cases');
    return response.data;
  },
  
  create: async (caseData: any) => {
    const response = await api.post('/cases', caseData);
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
