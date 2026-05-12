import api from './axios';

export const propertiesAPI = {
  // Público
  getAll: async () => {
    const response = await api.get('/properties?populate=*');
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(`/properties/${id}?populate=*`);
    return response.data;
  },

  // Privado
  getMyProperties: async (userId: number | string) => {
    const response = await api.get(`/properties?filters[owner][id][$eq]=${userId}&populate=*`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/properties', { data });
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.put(`/properties/${id}`, { data });
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
  
  // Para subir imágenes a Strapi (retorna IDs de las imágenes subidas)
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Necesitamos sobreescribir el Content-Type para FormData
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Devuelve un array con info de las imágenes subidas
  }
};
