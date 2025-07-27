import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task } from "@/components/TaskCard";
import { tasksAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import { useDemoContext } from "./DemoContext";
import { useTranslation } from "react-i18next";
import { transformServerTask, transformClientTask, transformStatus } from "@/lib/taskTransformers";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Task | undefined;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { 
    isDemoMode, 
    demoTasks, 
    addDemoTask, 
    updateDemoTask, 
    deleteDemoTask, 
    toggleDemoTaskStatus 
  } = useDemoContext();

  // Fetch tasks from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);
  
  // Fetch tasks from the API
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await tasksAPI.getAllTasks();
      const transformedTasks = response.data.map(transformServerTask);
      setTasks(transformedTasks);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks. Please try again.");
      toast({
        title: t('toast.error'),
        description: t('toast.loadTasksError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    if (isDemoMode) {
      // In demo mode, use the demo context functions
      addDemoTask(taskData);
      return;
    }
    
    // In authenticated mode, use the API
    setIsLoading(true);
    setError(null);
    
    try {
      const serverTaskData = transformClientTask(taskData);
      const response = await tasksAPI.createTask(serverTaskData);
      
      // Add the new task to the state
      const transformedTask = transformServerTask(response.data);
      setTasks((prevTasks) => [...prevTasks, transformedTask]);
      
      toast({
        title: t('toast.createTaskSuccess'),
        description: t('toast.createTaskMessage'),
      });
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setError(err.response?.data?.message || "Failed to create task. Please try again.");
      toast({
        title: t('toast.error'),
        description: t('toast.createTaskError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    if (isDemoMode) {
      // In demo mode, use the demo context functions
      updateDemoTask(updatedTask);
      return;
    }
    
    // In authenticated mode, use the API
    setIsLoading(true);
    setError(null);
    
    try {
      const serverTaskData = transformClientTask(updatedTask);
      await tasksAPI.updateTask(updatedTask.id, serverTaskData);
      
      // Update the task in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      
      toast({
        title: t('toast.updateTaskSuccess'),
        description: t('toast.updateTaskMessage'),
      });
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(err.response?.data?.message || "Failed to update task. Please try again.");
      toast({
        title: t('toast.error'),
        description: t('toast.updateTaskError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (isDemoMode) {
      // In demo mode, use the demo context functions
      deleteDemoTask(taskId);
      return;
    }
    
    // In authenticated mode, use the API
    setIsLoading(true);
    setError(null);
    
    try {
      await tasksAPI.deleteTask(taskId);
      
      // Remove the task from the state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      
      toast({
        title: t('toast.deleteTaskSuccess'),
        description: t('toast.deleteTaskMessage'),
      });
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError(err.response?.data?.message || "Failed to delete task. Please try again.");
      toast({
        title: t('toast.error'),
        description: t('toast.deleteTaskError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    if (isDemoMode) {
      // In demo mode, use the demo context functions
      toggleDemoTaskStatus(taskId);
      return;
    }
    
    // In authenticated mode, use the API
    setIsLoading(true);
    setError(null);
    
    // Find the current task
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Determine the next status
    const nextStatus =
      task.status === "todo"
        ? "in-progress"
        : task.status === "in-progress"
        ? "completed"
        : "todo";
    
    try {
      const serverStatus = transformStatus(nextStatus);
      await tasksAPI.updateTaskStatus(taskId, serverStatus);
      
      // Update the task in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, status: nextStatus };
          }
          return task;
        })
      );
      
      toast({
        title: t('toast.updateStatusSuccess'),
        description: t('toast.updateStatusMessage'),
      });
    } catch (err: any) {
      console.error("Failed to update task status:", err);
      setError(err.response?.data?.message || "Failed to update task status. Please try again.");
      toast({
        title: t('toast.error'),
        description: t('toast.updateStatusError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskById = (taskId: string) => {
    if (isDemoMode) {
      // In demo mode, search in demo tasks
      return demoTasks.find((task) => task.id === taskId);
    }
    // In authenticated mode, search in regular tasks
    return tasks.find((task) => task.id === taskId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: isDemoMode ? demoTasks : tasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getTaskById,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};