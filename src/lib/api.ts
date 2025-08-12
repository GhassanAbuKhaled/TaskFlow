import axios, { AxiosResponse } from 'axios';
import { ErrorFactory } from './errors/factory';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.taskflow.ghassanabukhaled.com/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = ErrorFactory.fromAxiosError(error);
    
    if (appError.type === 'AUTH' && 'status' in appError && appError.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(appError);
  }
);

export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse> => api.post('/auth/login', credentials),
  register: (userData: RegisterData): Promise<AxiosResponse> => api.post('/auth/register', userData),
  forgotPassword: (data: ForgotPasswordData): Promise<AxiosResponse> => api.post('/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordData): Promise<AxiosResponse> => api.post('/auth/reset-password', data),
};

export const tasksAPI = {
  getAllTasks: (): Promise<AxiosResponse> => api.get('/tasks'),
  getTaskById: (id: string): Promise<AxiosResponse> => api.get(`/tasks/${id}`),
  createTask: (task: any): Promise<AxiosResponse> => api.post('/tasks', task),
  updateTask: (id: string, task: any): Promise<AxiosResponse> => api.put(`/tasks/${id}`, task),
  deleteTask: (id: string): Promise<AxiosResponse> => api.delete(`/tasks/${id}`),
  updateTaskStatus: (id: string, status: string): Promise<AxiosResponse> => api.patch(`/tasks/${id}/status`, { status }),
};

export default api;