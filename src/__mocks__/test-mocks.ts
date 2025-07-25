import { vi } from 'vitest';

// Use manual mocks from __mocks__ folder
export const mockAPI = () => {
  vi.mock('@/lib/api');
};

export const mockToast = () => {
  vi.mock('@/components/ui/use-toast');
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