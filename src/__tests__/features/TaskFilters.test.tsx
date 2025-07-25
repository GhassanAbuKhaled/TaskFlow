import { describe, it, expect } from 'vitest';

// Mock task data for filter testing
const mockTasks = [
  {
    id: '1',
    title: 'High Priority Task',
    description: 'Important task',
    status: 'todo' as const,
    priority: 'high' as const,
    dueDate: '2024-12-31',
    tags: ['work'],
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Medium Priority Task',
    description: 'Regular task',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    dueDate: '2024-12-30',
    tags: ['personal'],
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    title: 'Low Priority Task',
    description: 'Simple task',
    status: 'completed' as const,
    priority: 'low' as const,
    dueDate: '2024-12-29',
    tags: ['hobby'],
    createdAt: '2024-01-03',
  },
];

// Filter functions (extracted from Tasks component logic)
const filterTasks = (
  tasks: typeof mockTasks,
  searchTerm: string,
  statusFilter: string,
  priorityFilter: string
) => {
  return tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
};

const sortTasks = (tasks: typeof mockTasks, sortBy: string) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};

describe('Task Filters', () => {
  it('filters tasks by search term', () => {
    const filtered = filterTasks(mockTasks, 'High', 'all', 'all');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('High Priority Task');
  });

  it('filters tasks by status', () => {
    const todoTasks = filterTasks(mockTasks, '', 'todo', 'all');
    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0].status).toBe('todo');

    const inProgressTasks = filterTasks(mockTasks, '', 'in-progress', 'all');
    expect(inProgressTasks).toHaveLength(1);
    expect(inProgressTasks[0].status).toBe('in-progress');

    const completedTasks = filterTasks(mockTasks, '', 'completed', 'all');
    expect(completedTasks).toHaveLength(1);
    expect(completedTasks[0].status).toBe('completed');
  });

  it('filters tasks by priority', () => {
    const highPriorityTasks = filterTasks(mockTasks, '', 'all', 'high');
    expect(highPriorityTasks).toHaveLength(1);
    expect(highPriorityTasks[0].priority).toBe('high');

    const mediumPriorityTasks = filterTasks(mockTasks, '', 'all', 'medium');
    expect(mediumPriorityTasks).toHaveLength(1);
    expect(mediumPriorityTasks[0].priority).toBe('medium');

    const lowPriorityTasks = filterTasks(mockTasks, '', 'all', 'low');
    expect(lowPriorityTasks).toHaveLength(1);
    expect(lowPriorityTasks[0].priority).toBe('low');
  });

  it('combines multiple filters', () => {
    const filtered = filterTasks(mockTasks, 'task', 'todo', 'high');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('High Priority Task');
    expect(filtered[0].status).toBe('todo');
    expect(filtered[0].priority).toBe('high');
  });

  it('returns empty array when no matches', () => {
    const filtered = filterTasks(mockTasks, 'nonexistent', 'all', 'all');
    expect(filtered).toHaveLength(0);
  });

  it('sorts tasks by due date', () => {
    const sorted = sortTasks(mockTasks, 'dueDate');
    expect(sorted[0].dueDate).toBe('2024-12-29');
    expect(sorted[1].dueDate).toBe('2024-12-30');
    expect(sorted[2].dueDate).toBe('2024-12-31');
  });

  it('sorts tasks by priority', () => {
    const sorted = sortTasks(mockTasks, 'priority');
    expect(sorted[0].priority).toBe('high');
    expect(sorted[1].priority).toBe('medium');
    expect(sorted[2].priority).toBe('low');
  });

  it('sorts tasks by status', () => {
    const sorted = sortTasks(mockTasks, 'status');
    expect(sorted[0].status).toBe('completed');
    expect(sorted[1].status).toBe('in-progress');
    expect(sorted[2].status).toBe('todo');
  });
});