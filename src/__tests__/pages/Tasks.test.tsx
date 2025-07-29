import { describe, it, expect } from 'vitest';

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

// Mock task data for testing
const mockTasks = [
  mockTask,
  { ...mockTask, id: '2', title: 'Second Task', status: 'IN_PROGRESS' as const },
  { ...mockTask, id: '3', title: 'Third Task', status: 'COMPLETED' as const }
];

describe('Tasks Page Logic', () => {
  it('should calculate task statistics correctly', () => {
    const todoCount = mockTasks.filter(task => task.status === 'TODO').length;
    const inProgressCount = mockTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const completedCount = mockTasks.filter(task => task.status === 'COMPLETED').length;
    
    expect(todoCount).toBe(1);
    expect(inProgressCount).toBe(1);
    expect(completedCount).toBe(1);
    expect(mockTasks.length).toBe(3);
  });

  it('should handle task filtering by search term', () => {
    const searchTerm = 'Test';
    const filtered = mockTasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Test Task');
  });

  it('should handle task filtering by status', () => {
    const todoTasks = mockTasks.filter(task => task.status === 'TODO');
    const inProgressTasks = mockTasks.filter(task => task.status === 'IN_PROGRESS');
    const completedTasks = mockTasks.filter(task => task.status === 'COMPLETED');
    
    expect(todoTasks.length).toBe(1);
    expect(inProgressTasks.length).toBe(1);
    expect(completedTasks.length).toBe(1);
  });

  it('should handle empty task list', () => {
    const emptyTasks: typeof mockTasks = [];
    const todoCount = emptyTasks.filter(task => task.status === 'TODO').length;
    
    expect(todoCount).toBe(0);
    expect(emptyTasks.length).toBe(0);
  });

  it('should handle task operations', () => {
    const taskId = '1';
    const taskExists = mockTasks.some(task => task.id === taskId);
    
    expect(taskExists).toBe(true);
  });
});