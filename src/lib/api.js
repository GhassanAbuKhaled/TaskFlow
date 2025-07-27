import axios from 'axios';
import { ErrorFactory } from './errors/factory';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (token && expiresAt) {
      const now = Date.now();
      const expiry = parseInt(expiresAt);
      
      if (now < expiry) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(ErrorFactory.createAuthError('Session expired', true));
      }
    }
    return config;
  },
  (error) => Promise.reject(ErrorFactory.fromAxiosError(error))
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = ErrorFactory.fromAxiosError(error);
    
    // Handle auth errors globally
    if (appError.type === 'AUTH' && 'status' in appError && appError.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(appError);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Tasks API
export const tasksAPI = {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
};

export default api;