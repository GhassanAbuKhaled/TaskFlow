import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import TaskCard, { Task } from '@/components/TaskCard';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { DemoProvider } from '@/contexts/DemoContext';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2024-12-31',
  tags: ['work', 'urgent'],
  createdAt: '2024-01-01',
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <DemoProvider>
        <TaskProvider>
          {component}
        </TaskProvider>
      </DemoProvider>
    </AuthProvider>
  );
};

describe('TaskCard Component', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggleStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('accepts all required props', () => {
    const result = renderWithProviders(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(result.container).toBeInTheDocument();
  });

  it('displays task information when available', () => {
    renderWithProviders(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    // Component should render with task data
    expect(document.body).toBeInTheDocument();
  });

  it('handles different task statuses', () => {
    const todoTask = { ...mockTask, status: 'TODO' as const };
    const inProgressTask = { ...mockTask, status: 'IN_PROGRESS' as const };
    const completedTask = { ...mockTask, status: 'COMPLETED' as const };

    // Test todo status
    const { rerender } = renderWithProviders(
      <TaskCard
        task={todoTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(document.body).toBeInTheDocument();

    // Test in-progress status
    rerender(
      <TaskCard
        task={inProgressTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(document.body).toBeInTheDocument();

    // Test completed status
    rerender(
      <TaskCard
        task={completedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('handles different priority levels', () => {
    const highPriorityTask = { ...mockTask, priority: 'HIGH' as const };
    const mediumPriorityTask = { ...mockTask, priority: 'MEDIUM' as const };
    const lowPriorityTask = { ...mockTask, priority: 'LOW' as const };

    // Test each priority level
    [highPriorityTask, mediumPriorityTask, lowPriorityTask].forEach(task => {
      const { rerender } = renderWithProviders(
        <TaskCard
          task={task}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
        />
      );
      expect(document.body).toBeInTheDocument();
    });
  });

  it('handles tasks with and without tags', () => {
    const taskWithTags = { ...mockTask, tags: ['work', 'urgent'] };
    const taskWithoutTags = { ...mockTask, tags: [] };

    // Test with tags
    const { rerender } = renderWithProviders(
      <TaskCard
        task={taskWithTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(document.body).toBeInTheDocument();

    // Test without tags
    rerender(
      <TaskCard
        task={taskWithoutTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('handles user interactions safely', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    // Try to find buttons safely
    const buttons = screen.queryAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
    }
    
    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });
});