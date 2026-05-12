import api from './axios';

export const paymentsAPI = {
  createPreference: async (propertyId: number | string) => {
    const response = await api.post('/payments/create-preference', {
      propertyId,
    });
    return response.data;
  },
};
