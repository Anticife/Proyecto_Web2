import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
  if (!STRAPI_TOKEN) {
    console.warn('VITE_STRAPI_TOKEN is missing. Requests to restricted Strapi endpoints will fail with 401.');
  }
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use a request interceptor to dynamically set the token
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('jwt');
    
    if (userToken) {
      // Prioritize logged-in user token
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (STRAPI_TOKEN && STRAPI_TOKEN !== 'undefined' && STRAPI_TOKEN !== '') {
      // Use fallback Strapi API Token if provided
      config.headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
