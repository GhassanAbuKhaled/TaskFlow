import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Task } from '@/components/TaskCard';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

// Default demo tasks
const defaultDemoTasks: Task[] = [
  {
    id: "demo-1",
    title: "Try adding a new task",
    description: "Click the 'New Task' button to create your first task in demo mode.",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date().toISOString(),
    tags: ["demo", "getting-started"]
  },
  {
    id: "demo-2",
    title: "Explore task management features",
    description: "Try changing task status, priority, and other properties to see how the app works.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    createdAt: new Date().toISOString(),
    tags: ["demo", "features"]
  },
  {
    id: "demo-3",
    title: "Create an account to save your data",
    description: "Sign up to keep your tasks and preferences saved across sessions.",
    status: "completed",
    priority: "low",
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ["demo", "account"]
  },
  {
    id: "demo-4",
    title: "Prepare project presentation",
    description: "Create slides and talking points for the quarterly review meeting.",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days from now
    createdAt: new Date().toISOString(),
    tags: ["work", "presentation"]
  },
  {
    id: "demo-5",
    title: "Research new productivity tools",
    description: "Find and evaluate new tools that could improve team workflow and efficiency.",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 432000000).toISOString().split('T')[0], // 5 days from now
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    tags: ["research", "productivity"]
  }
];

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  demoTasks: Task[];
  addDemoTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateDemoTask: (task: Task) => void;
  deleteDemoTask: (taskId: string) => void;
  toggleDemoTaskStatus: (taskId: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoTasks, setDemoTasks] = useState<Task[]>(defaultDemoTasks);
  const { toast } = useToast();
  const { t } = useTranslation();

  const addDemoTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: `demo-${uuidv4()}`,
      createdAt: new Date().toISOString(),
    };
    
    setDemoTasks(prev => [...prev, newTask]);
    toast({
      title: t('toast.demoMode'),
      description: t('toast.demoTaskCreated'),
    });
  };

  const updateDemoTask = (updatedTask: Task) => {
    setDemoTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    toast({
      title: t('toast.demoMode'),
      description: t('toast.demoTaskUpdated'),
    });
  };

  const deleteDemoTask = (taskId: string) => {
    setDemoTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: t('toast.demoMode'),
      description: t('toast.demoTaskDeleted'),
    });
  };

  const toggleDemoTaskStatus = (taskId: string) => {
    const statusMap: Record<string, Task['status']> = { "todo": "in-progress", "in-progress": "completed", "completed": "todo" };
    
    setDemoTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: statusMap[task.status] } 
        : task
    ));
    
    toast({
      title: t('toast.demoMode'),
      description: t('toast.demoTaskStatusUpdated'),
    });
  };

  const contextValue = useMemo(() => ({
    isDemoMode,
    setDemoMode: setIsDemoMode,
    demoTasks,
    addDemoTask,
    updateDemoTask,
    deleteDemoTask,
    toggleDemoTaskStatus,
  }), [isDemoMode, demoTasks]);

  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  const { t } = useTranslation();
  if (context === undefined) {
    throw new Error(t('toast.demoProviderError'));
  }
  return context;
};