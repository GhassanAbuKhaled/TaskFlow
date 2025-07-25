import { vi } from 'vitest';

// Common API mocks
export const mockAPI = () => {
  vi.mock('@/lib/api', () => ({
    authAPI: {
      login: vi.fn(),
      logout: vi.fn(),
    },
    tasksAPI: {
      getAllTasks: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    },
  }));
};

// Common toast mock
export const mockToast = () => {
  vi.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({
      toast: vi.fn(),
    }),
  }));
};

// Mock task data
export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  priority: 'high' as const,
  dueDate: '2024-12-31',
  tags: ['work'],
  createdAt: '2024-01-01',
};

// Setup all common mocks
export const setupMocks = () => {
  mockAPI();
  mockToast();
};