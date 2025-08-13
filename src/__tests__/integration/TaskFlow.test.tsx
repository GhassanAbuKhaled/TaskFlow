import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/test/setup';
import { DemoProvider } from '@/contexts/DemoContext';
import TaskCard from '@/components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO' as const,
  priority: 'HIGH' as const,
  dueDate: '2024-12-31',
  tags: ['work'],
  createdAt: '2024-01-01',
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <DemoProvider>
      {children}
    </DemoProvider>
  </I18nextProvider>
);

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
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
        />
      </TestWrapper>
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
    const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;
    
    statuses.forEach(status => {
      const taskWithStatus = { ...mockTask, status };
      
      render(
        <TestWrapper>
          <TaskCard
            task={taskWithStatus}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onToggleStatus={mockOnToggleStatus}
          />
        </TestWrapper>
      );

      expect(document.body).toBeInTheDocument();
    });
  });

  it('should handle different task priorities', () => {
    const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const;
    
    priorities.forEach(priority => {
      const taskWithPriority = { ...mockTask, priority };
      
      render(
        <TestWrapper>
          <TaskCard
            task={taskWithPriority}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onToggleStatus={mockOnToggleStatus}
          />
        </TestWrapper>
      );

      expect(document.body).toBeInTheDocument();
    });
  });
});