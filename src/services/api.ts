
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://0.0.0.0:5000/api'
});

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
