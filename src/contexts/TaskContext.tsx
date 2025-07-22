import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task } from "@/components/TaskCard";
import { tasksAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import { useDemoContext } from "./DemoContext";

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
      setTasks(response.data);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
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
      const response = await tasksAPI.createTask({
        ...taskData,
        createdAt: new Date().toISOString(),
      });
      
      // Add the new task to the state
      setTasks((prevTasks) => [...prevTasks, response.data]);
      
      toast({
        title: "Task created",
        description: "Your task has been successfully created.",
      });
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setError(err.response?.data?.message || "Failed to create task. Please try again.");
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
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
      await tasksAPI.updateTask(updatedTask.id, updatedTask);
      
      // Update the task in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(err.response?.data?.message || "Failed to update task. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
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
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError(err.response?.data?.message || "Failed to delete task. Please try again.");
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
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
      await tasksAPI.updateTaskStatus(taskId, nextStatus);
      
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
        title: "Task updated",
        description: "Task status has been updated.",
      });
    } catch (err: any) {
      console.error("Failed to update task status:", err);
      setError(err.response?.data?.message || "Failed to update task status. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
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