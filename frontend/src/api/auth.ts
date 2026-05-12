import api from './axios';

export const authAPI = {
  login: async (identifier: string, password: string) => {
    const response = await api.post('/auth/local', {
      identifier,
      password,
    });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/local/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
};
