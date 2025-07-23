import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskCard, { Task } from "@/components/TaskCard";
import { useTaskContext } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoContext } from "@/contexts/DemoContext";
import { Plus, Search, Filter, SortAsc, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type FilterProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
};

const TaskFilters = ({ 
  searchTerm, setSearchTerm, 
  statusFilter, setStatusFilter,
  priorityFilter, setPriorityFilter,
  sortBy, setSortBy
}: FilterProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 p-3 sm:p-6 bg-card rounded-2xl border border-border/50 shadow-soft">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('tasks.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl border-border/50 focus:border-primary/50"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 sm:gap-4 md:flex-row">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] rounded-2xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('status.title')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tasks.allStatus')}</SelectItem>
            <SelectItem value="todo">{t('status.todo')}</SelectItem>
            <SelectItem value="in-progress">{t('status.inProgress')}</SelectItem>
            <SelectItem value="completed">{t('status.completed')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[170px] rounded-2xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('taskForm.priority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tasks.allPriority')}</SelectItem>
            <SelectItem value="high">{t('priority.high')}</SelectItem>
            <SelectItem value="medium">{t('priority.medium')}</SelectItem>
            <SelectItem value="low">{t('priority.low')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[140px] rounded-2xl">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('tasks.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">{t('taskForm.dueDate')}</SelectItem>
            <SelectItem value="priority">{t('taskForm.priority')}</SelectItem>
            <SelectItem value="status">{t('status.title')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

type StatusOverviewProps = {
  tasks: Task[];
};

const StatusOverview = ({ tasks }: StatusOverviewProps) => {
  const { t } = useTranslation();
  
  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length;
  };
  
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      <Badge variant="outline" className="px-3 py-2 rounded-full">
        Total: {tasks.length}
      </Badge>
      <Badge variant="outline" className="px-3 py-2 rounded-full text-muted-foreground">
        {t('status.todo')}: {getStatusCount("todo")}
      </Badge>
      <Badge variant="outline" className="px-3 py-2 rounded-full text-warning">
        {t('status.inProgress')}: {getStatusCount("in-progress")}
      </Badge>
      <Badge variant="outline" className="px-3 py-2 rounded-full text-success">
        {t('status.completed')}: {getStatusCount("completed")}
      </Badge>
    </div>
  );
};

type TaskListProps = {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onToggleStatus: (taskId: string) => Promise<void>;
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
};

const TaskList = ({ 
  tasks, isLoading, onEdit, onDelete, onToggleStatus,
  searchTerm, statusFilter, priorityFilter
}: TaskListProps) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-border/50 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
              ? t('tasks.noTasksFound') 
              : t('tasks.noTasks')
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? t('tasks.adjustFilters')
              : t('tasks.createFirstTaskDescription')
            }
          </p>
          <Link to="/create-task">
            <Button className="rounded-2xl">
              {t('tasks.createTask')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              layout: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <TaskCard
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Tasks = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { tasks, deleteTask, toggleTaskStatus, isLoading, error, fetchTasks } = useTaskContext();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        
        switch (sortBy) {
          case "dueDate":
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case "priority":
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case "status":
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy]);

  const handleEditTask = (task: Task) => {
    navigate(`/edit-task/${task.id}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleToggleStatus = async (taskId: string) => {
    await toggleTaskStatus(taskId);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col overflow-x-hidden">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] md:h-[calc(100vh-72px)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={user?.username}
        />
        
        <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('tasks.title')}</h1>
                <p className="text-muted-foreground mt-1">
                  {t('tasks.manage')}
                </p>
              </div>
              
              <Link to="/create-task">
                <Button className="rounded-2xl shadow-medium hover:shadow-large transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('dashboard.newTask')}
                </Button>
              </Link>
            </div>

            <StatusOverview tasks={tasks} />

            <TaskFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;