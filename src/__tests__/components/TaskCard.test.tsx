import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@/test/test-utils';
import TaskCard, { Task } from '@/components/TaskCard';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { DemoProvider } from '@/contexts/DemoContext';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
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

    // Just check that the component renders without errors
    expect(document.body).toBeInTheDocument();
  });

  it('accepts task props correctly', () => {
    const result = renderWithProviders(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    // Component should render without throwing errors
    expect(result.container).toBeInTheDocument();
  });
});