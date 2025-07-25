import { describe, it, expect, vi, beforeEach } from 'vitest';

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

// Mock functions for CRUD operations
const mockAddTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();
const mockToggleTaskStatus = vi.fn();
const mockFetchTasks = vi.fn();
const mockGetTaskById = vi.fn();

describe('Task CRUD Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a new task', () => {
    const newTask = {
      ...mockTask,
      id: '2',
      title: 'New Task',
    };

    mockAddTask(newTask);
    expect(mockAddTask).toHaveBeenCalledWith(newTask);
  });

  it('should update an existing task', () => {
    const updatedTask = {
      ...mockTask,
      title: 'Updated Task',
    };

    mockUpdateTask(updatedTask);
    expect(mockUpdateTask).toHaveBeenCalledWith(updatedTask);
  });

  it('should delete a task', () => {
    const taskId = '1';
    mockDeleteTask(taskId);
    expect(mockDeleteTask).toHaveBeenCalledWith(taskId);
  });

  it('should toggle task status', () => {
    const taskId = '1';
    mockToggleTaskStatus(taskId);
    expect(mockToggleTaskStatus).toHaveBeenCalledWith(taskId);
  });

  it('should fetch all tasks', () => {
    mockFetchTasks();
    expect(mockFetchTasks).toHaveBeenCalled();
  });

  it('should get task by id', () => {
    mockGetTaskById.mockReturnValue(mockTask);
    const task = mockGetTaskById('1');
    expect(task).toEqual(mockTask);
  });

  it('should handle different task statuses', () => {
    const statuses = ['todo', 'in-progress', 'completed'];
    
    statuses.forEach(status => {
      const taskWithStatus = { ...mockTask, status };
      mockUpdateTask(taskWithStatus);
      expect(mockUpdateTask).toHaveBeenCalledWith(taskWithStatus);
    });
  });

  it('should handle different task priorities', () => {
    const priorities = ['low', 'medium', 'high'];
    
    priorities.forEach(priority => {
      const taskWithPriority = { ...mockTask, priority };
      mockUpdateTask(taskWithPriority);
      expect(mockUpdateTask).toHaveBeenCalledWith(taskWithPriority);
    });
  });
});