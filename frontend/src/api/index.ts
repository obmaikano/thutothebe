import axios from 'axios';
import { getToken } from '../features/auth/authUtils';

// Use import.meta.env for Vite or set a default URL
const baseURL = typeof import.meta !== 'undefined' 
  ? import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
  : 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      // Dispatch logout action or redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 