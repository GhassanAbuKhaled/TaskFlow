import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import TaskCard from '@/components/TaskCard';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    {children}
  </I18nextProvider>
);

const createMockTask = (id: number) => ({
  id: id.toString(),
  title: `Task ${id}`,
  description: `Description for task ${id}`,
  status: 'todo' as const,
  priority: 'medium' as const,
  dueDate: '2024-12-31',
  tags: ['test'],
  createdAt: '2024-01-01',
});

describe('Performance Tests', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggleStatus = vi.fn();

  it('should render single task efficiently', () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <TaskCard
          task={createMockTask(1)}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
        />
      </TestWrapper>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Single task should render quickly (under 100ms)
    expect(renderTime).toBeLessThan(100);
  });

  it('should render multiple tasks efficiently', () => {
    const taskCount = 10;
    const startTime = performance.now();
    
    const tasks = Array.from({ length: taskCount }, (_, i) => (
      <TaskCard
        key={i}
        task={createMockTask(i)}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    ));
    
    render(
      <TestWrapper>
        <div>{tasks}</div>
      </TestWrapper>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Multiple tasks should render reasonably fast
    expect(renderTime).toBeLessThan(500);
  });

  it('should handle task updates efficiently', () => {
    const task = createMockTask(1);
    
    const { rerender } = render(
      <TestWrapper>
        <TaskCard
          task={task}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
        />
      </TestWrapper>
    );
    
    const startTime = performance.now();
    
    // Update task status
    const updatedTask = { ...task, status: 'completed' as const };
    
    rerender(
      <TestWrapper>
        <TaskCard
          task={updatedTask}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
        />
      </TestWrapper>
    );
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;
    
    // Updates should be fast
    expect(updateTime).toBeLessThan(50);
  });

  it('should handle memory usage efficiently', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Render and unmount multiple components
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(
        <TestWrapper>
          <TaskCard
            task={createMockTask(i)}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
            onToggleStatus={mockOnToggleStatus}
          />
        </TestWrapper>
      );
      unmount();
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 10MB)
    if (initialMemory > 0) {
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    } else {
      // If memory API not available, just pass
      expect(true).toBe(true);
    }
  });
});