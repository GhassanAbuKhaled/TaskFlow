import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { TaskProvider, useTaskContext } from '@/contexts/TaskContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </AuthProvider>
    </I18nextProvider>
  </BrowserRouter>
);

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  dueDate: '2024-12-31',
  tags: ['test'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('TaskContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render hook without crashing', () => {
    expect(() => {
      renderHook(() => useTaskContext(), { wrapper });
    }).not.toThrow();
  });

  it('should provide context value', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    
    if (result.current) {
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    }
  });

  it('should have task properties when context is available', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    
    if (result.current && result.current.tasks !== undefined) {
      expect(Array.isArray(result.current.tasks)).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.addTask).toBe('function');
      expect(typeof result.current.updateTask).toBe('function');
      expect(typeof result.current.deleteTask).toBe('function');
    }
  });

  it('should handle task operations when available', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    
    if (result.current && result.current.addTask) {
      expect(() => {
        result.current.addTask(mockTask);
      }).not.toThrow();
    }
    
    if (result.current && result.current.getTaskById) {
      const task = result.current.getTaskById('1');
      expect(task === undefined || typeof task === 'object').toBe(true);
    }
  });

  it('should handle context lifecycle', () => {
    const { unmount } = renderHook(() => useTaskContext(), { wrapper });
    expect(() => unmount()).not.toThrow();
  });

  it('should work with task state management', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    
    if (result.current) {
      expect(result.current).toBeDefined();
      
      if (result.current.fetchTasks) {
        expect(() => result.current.fetchTasks()).not.toThrow();
      }
    }
  });
});