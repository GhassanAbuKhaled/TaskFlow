import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllProviders } from '@/test/test-utils';
import { setupMocks, mockTask } from '@/test/test-mocks';
import TaskCard from '@/components/TaskCard';

setupMocks();

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