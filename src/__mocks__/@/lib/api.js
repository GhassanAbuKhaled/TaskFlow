import { vi } from 'vitest';

export const authAPI = {
  login: vi.fn(),
  logout: vi.fn(),
};

export const tasksAPI = {
  getAllTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
};