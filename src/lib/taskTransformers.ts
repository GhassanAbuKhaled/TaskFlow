import { Task } from '@/components/TaskCard';

// Server task format
export interface ServerTask {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string; // ISO string
  createdAt: string; // ISO string
  tags: string[];
}

// Transform server task to frontend format
export const transformServerTask = (serverTask: ServerTask): Task => {
  const statusMap: Record<ServerTask['status'], Task['status']> = {
    'TODO': 'todo',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed'
  };

  const priorityMap: Record<ServerTask['priority'], Task['priority']> = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high'
  };

  return {
    id: serverTask.id,
    title: serverTask.title,
    description: serverTask.description,
    status: statusMap[serverTask.status],
    priority: priorityMap[serverTask.priority],
    dueDate: serverTask.dueDate.split('T')[0], // Convert ISO to date string
    createdAt: serverTask.createdAt,
    tags: serverTask.tags
  };
};

// Transform frontend task to server format
export const transformClientTask = (clientTask: Omit<Task, 'id' | 'createdAt'>): Omit<ServerTask, 'id' | 'createdAt'> => {
  const statusMap: Record<Task['status'], ServerTask['status']> = {
    'todo': 'TODO',
    'in-progress': 'IN_PROGRESS',
    'completed': 'COMPLETED'
  };

  const priorityMap: Record<Task['priority'], ServerTask['priority']> = {
    'low': 'LOW',
    'medium': 'MEDIUM',
    'high': 'HIGH'
  };

  return {
    title: clientTask.title,
    description: clientTask.description,
    status: statusMap[clientTask.status],
    priority: priorityMap[clientTask.priority],
    dueDate: `${clientTask.dueDate}T17:00:00`, // Convert date to ISO string
    tags: clientTask.tags || []
  };
};

// Transform status for status update
export const transformStatus = (clientStatus: Task['status']): ServerTask['status'] => {
  const statusMap: Record<Task['status'], ServerTask['status']> = {
    'todo': 'TODO',
    'in-progress': 'IN_PROGRESS',
    'completed': 'COMPLETED'
  };
  return statusMap[clientStatus];
};