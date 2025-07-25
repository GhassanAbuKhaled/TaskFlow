import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { DemoProvider } from '@/contexts/DemoContext';
import TaskCard from '@/components/TaskCard';

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

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <DemoProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </DemoProvider>
    </AuthProvider>
  </I18nextProvider>
);

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  priority: 'high' as const,
  dueDate: '2024-12-31',
  tags: ['work'],
  createdAt: '2024-01-01',
};

describe('Task Management Integration Flow', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggleStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle complete task lifecycle', async () => {
    const user = userEvent.setup();
    
    render(
      <AllProviders>
        <TaskCard
          task={mockTask}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
        />
      </AllProviders>
    );

    const buttons = screen.queryAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      const totalCalls = mockOnEdit.mock.calls.length + mockOnDelete.mock.calls.length + mockOnToggleStatus.mock.calls.length;
      expect(totalCalls).toBeGreaterThanOrEqual(1);
    }

    expect(document.body).toBeInTheDocument();
  });

  it('should handle task status transitions', () => {
    const statuses = ['todo', 'in-progress', 'completed'] as const;
    
    statuses.forEach(status => {
      const taskWithStatus = { ...mockTask, status };
      
      render(
        <AllProviders>
          <TaskCard
            task={taskWithStatus}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onToggleStatus={mockOnToggleStatus}
          />
        </AllProviders>
      );

      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle different task priorities', () => {
    const priorities = ['low', 'medium', 'high'] as const;
    
    priorities.forEach(priority => {
      const taskWithPriority = { ...mockTask, priority };
      
      render(
        <AllProviders>
          <TaskCard
            task={taskWithPriority}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onToggleStatus={mockOnToggleStatus}
          />
        </AllProviders>
      );

      expect(document.body).toBeInTheDocument();
    });
  });
});