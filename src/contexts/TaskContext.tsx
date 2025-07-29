import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task } from "@/components/TaskCard";
import { tasksAPI } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useDemoContext } from "./DemoContext";
import { useTranslation } from "react-i18next";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { AppError } from "@/lib/errors";


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
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { handleError, showSuccess } = useErrorHandler();
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
      const transformedTasks = response.data.map((task: any) => ({
        ...task,
        dueDate: task.dueDate.split('T')[0],
        tags: task.tags || []
      }));
      setTasks(transformedTasks);
    } catch (error: any) {
      setError(error.message);
      handleError(error, 'fetchTasks', fetchTasks);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    if (isDemoMode) {
      addDemoTask(taskData);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const serverTaskData = {
        ...taskData,
        dueDate: `${taskData.dueDate}T17:00:00`,
        tags: taskData.tags || []
      };
      const response = await tasksAPI.createTask(serverTaskData);
      
      const transformedTask = {
        ...response.data,
        dueDate: response.data.dueDate.split('T')[0],
        tags: response.data.tags || []
      };
      setTasks((prevTasks) => [...prevTasks, transformedTask]);
      
      showSuccess(
        t('toast.createTaskSuccess'),
        t('toast.createTaskMessage')
      );
    } catch (error: any) {
      setError(error.message);
      handleError(error, 'createTask');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    if (isDemoMode) {
      updateDemoTask(updatedTask);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const serverTaskData = {
        ...updatedTask,
        dueDate: `${updatedTask.dueDate}T17:00:00`,
        tags: updatedTask.tags || []
      };
      await tasksAPI.updateTask(updatedTask.id, serverTaskData);
      
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      
      showSuccess(
        t('toast.updateTaskSuccess'),
        t('toast.updateTaskMessage')
      );
    } catch (error: any) {
      setError(error.message);
      handleError(error, 'updateTask');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (isDemoMode) {
      deleteDemoTask(taskId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await tasksAPI.deleteTask(taskId);
      
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      
      showSuccess(
        t('toast.deleteTaskSuccess'),
        t('toast.deleteTaskMessage')
      );
    } catch (error: any) {
      setError(error.message);
      handleError(error, 'deleteTask');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    if (isDemoMode) {
      toggleDemoTaskStatus(taskId);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const nextStatus =
      task.status === "TODO"
        ? "IN_PROGRESS"
        : task.status === "IN_PROGRESS"
        ? "COMPLETED"
        : "TODO";
    
    try {
      await tasksAPI.updateTaskStatus(taskId, nextStatus);
      
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, status: nextStatus };
          }
          return task;
        })
      );
      
      showSuccess(
        t('toast.updateStatusSuccess'),
        t('toast.updateStatusMessage')
      );
    } catch (error: any) {
      setError(error.message);
      handleError(error, 'updateTaskStatus');
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