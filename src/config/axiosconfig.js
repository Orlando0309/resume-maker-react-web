import axios from 'axios';
import { BASE_URL } from '../utils';

// Base Axios instance (for public, unauthenticated requests)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Secure Axios instance (adds Authorization header automatically)
const secureApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for secureApi to attach token automatically
secureApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api, secureApi };
