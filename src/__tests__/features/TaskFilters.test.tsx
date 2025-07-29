import { describe, it, expect } from 'vitest';

// Mock task data for filter testing
const mockTasks = [
  {
    id: '1',
    title: 'High Priority Task',
    description: 'Important task',
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    dueDate: '2024-12-31',
    tags: ['work'],
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Medium Priority Task',
    description: 'Regular task',
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    dueDate: '2024-12-30',
    tags: ['personal'],
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    title: 'Low Priority Task',
    description: 'Simple task',
    status: 'COMPLETED' as const,
    priority: 'LOW' as const,
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
  const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  
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
    const todoTasks = filterTasks(mockTasks, '', 'TODO', 'all');
    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0].status).toBe('TODO');

    const inProgressTasks = filterTasks(mockTasks, '', 'IN_PROGRESS', 'all');
    expect(inProgressTasks).toHaveLength(1);
    expect(inProgressTasks[0].status).toBe('IN_PROGRESS');

    const completedTasks = filterTasks(mockTasks, '', 'COMPLETED', 'all');
    expect(completedTasks).toHaveLength(1);
    expect(completedTasks[0].status).toBe('COMPLETED');
  });

  it('filters tasks by priority', () => {
    const highPriorityTasks = filterTasks(mockTasks, '', 'all', 'HIGH');
    expect(highPriorityTasks).toHaveLength(1);
    expect(highPriorityTasks[0].priority).toBe('HIGH');

    const mediumPriorityTasks = filterTasks(mockTasks, '', 'all', 'MEDIUM');
    expect(mediumPriorityTasks).toHaveLength(1);
    expect(mediumPriorityTasks[0].priority).toBe('MEDIUM');

    const lowPriorityTasks = filterTasks(mockTasks, '', 'all', 'LOW');
    expect(lowPriorityTasks).toHaveLength(1);
    expect(lowPriorityTasks[0].priority).toBe('LOW');
  });

  it('combines multiple filters', () => {
    const filtered = filterTasks(mockTasks, 'task', 'TODO', 'HIGH');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('High Priority Task');
    expect(filtered[0].status).toBe('TODO');
    expect(filtered[0].priority).toBe('HIGH');
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
    expect(sorted[0].priority).toBe('HIGH');
    expect(sorted[1].priority).toBe('MEDIUM');
    expect(sorted[2].priority).toBe('LOW');
  });

  it('sorts tasks by status', () => {
    const sorted = sortTasks(mockTasks, 'status');
    expect(sorted[0].status).toBe('COMPLETED');
    expect(sorted[1].status).toBe('IN_PROGRESS');
    expect(sorted[2].status).toBe('TODO');
  });
});