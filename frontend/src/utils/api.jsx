import axios from 'axios';
import { Cookies } from 'react-cookie';
import { API_BASE_URL, FRONTEND_BASE_PATH } from './env';

const cookies = new Cookies();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear cookies and redirect to signin
      cookies.remove('token');
      cookies.remove('user');
      window.location.href = `${FRONTEND_BASE_PATH}/signin`;
    }
    return Promise.reject(error);
  }
);

export default api;
