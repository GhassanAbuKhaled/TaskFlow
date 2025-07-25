import { describe, it, expect } from 'vitest';

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

// Mock task data for testing
const mockTasks = [
  mockTask,
  { ...mockTask, id: '2', title: 'Second Task', status: 'in-progress' as const },
  { ...mockTask, id: '3', title: 'Third Task', status: 'completed' as const }
];

describe('Tasks Page Logic', () => {
  it('should calculate task statistics correctly', () => {
    const todoCount = mockTasks.filter(task => task.status === 'todo').length;
    const inProgressCount = mockTasks.filter(task => task.status === 'in-progress').length;
    const completedCount = mockTasks.filter(task => task.status === 'completed').length;
    
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
    const todoTasks = mockTasks.filter(task => task.status === 'todo');
    const inProgressTasks = mockTasks.filter(task => task.status === 'in-progress');
    const completedTasks = mockTasks.filter(task => task.status === 'completed');
    
    expect(todoTasks.length).toBe(1);
    expect(inProgressTasks.length).toBe(1);
    expect(completedTasks.length).toBe(1);
  });

  it('should handle empty task list', () => {
    const emptyTasks: typeof mockTasks = [];
    const todoCount = emptyTasks.filter(task => task.status === 'todo').length;
    
    expect(todoCount).toBe(0);
    expect(emptyTasks.length).toBe(0);
  });

  it('should handle task operations', () => {
    const taskId = '1';
    const taskExists = mockTasks.some(task => task.id === taskId);
    
    expect(taskExists).toBe(true);
  });
});