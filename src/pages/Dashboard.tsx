import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import Spinner from "@/components/ui/spinner";
import SEO from "@/components/SEO";
import { useTaskContext } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoContext } from "@/contexts/DemoContext";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { tasks, deleteTask, toggleTaskStatus, isLoading, error, fetchTasks } = useTaskContext();
  const { user } = useAuth();
  const { isDemoMode } = useDemoContext();
  


  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "COMPLETED").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "COMPLETED").length
  };

  const recentTasks = tasks.slice(0, 3);

  // Create dynamic meta description
  const metaDescription = t('dashboard.metaDescription', {
    total: stats.total,
    completed: stats.completed,
    inProgress: stats.inProgress,
    overdue: stats.overdue
  });

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      <SEO 
        title={t('dashboard.title')} 
        description={metaDescription}
        keywords="task dashboard, productivity, task statistics, task management"
        ogImage="/placeholder.svg"
      />
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] md:h-[calc(100vh-72px)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={user?.username}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                  <Spinner size="lg" className="mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('dashboard.loading')}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Welcome Section */}
                <div className="space-y-2">
                  <h1 className="text-responsive-2xl font-bold text-foreground">
                    {isDemoMode 
                      ? t('dashboard.welcomeDemo')
                      : t('dashboard.welcome', { username: user?.username || 'User' })
                    }
                  </h1>
                  <p className="text-responsive-base text-muted-foreground">
                    {isDemoMode
                      ? t('dashboard.subtitleDemo')
                      : t('dashboard.subtitle')
                    }
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 dashboard-stats-grid">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className="rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 stat-card-header h-auto min-h-[40px]">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground break-words hyphens-auto">
                          {t('dashboard.stats.total')}
                        </CardTitle>
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg md:text-2xl font-bold text-foreground stat-card-value">{stats.total}</div>
                        <p className="text-xs text-success mt-1 break-words hyphens-auto">
                          {t('dashboard.stats.fromYesterday')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className="rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-auto min-h-[40px]">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground break-words hyphens-auto">
                          {t('dashboard.stats.completed')}
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
                        <p className="text-xs text-success mt-1 break-words hyphens-auto">
                          {t('dashboard.stats.greatProgress')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className="rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-auto min-h-[40px]">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground break-words hyphens-auto">
                          {t('dashboard.stats.inProgress')}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-warning" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.inProgress}</div>
                        <p className="text-xs text-warning mt-1 break-words hyphens-auto">
                          {t('dashboard.stats.keepItUp')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className="rounded-2xl border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-auto min-h-[40px]">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground break-words hyphens-auto">
                          {t('dashboard.stats.overdue')}
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.overdue}</div>
                        <p className="text-xs text-destructive mt-1 break-words hyphens-auto">
                          {stats.overdue > 0 ? t('dashboard.stats.needsAttention') : t('dashboard.stats.allCaughtUp')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <Card className="rounded-2xl border-border/50 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{t('dashboard.quickActions')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/create-task">
                        <Button className="rounded-2xl shadow-medium hover:shadow-large transition-all duration-300 w-auto min-w-[140px] px-4 h-10 font-medium">
                          <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">{t('dashboard.newTask')}</span>
                        </Button>
                      </Link>
                      <Link to="/tasks">
                        <Button variant="outline" className="rounded-2xl w-auto min-w-[160px] px-4 h-10 font-medium">
                          <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">{t('dashboard.viewAllTasks')}</span>
                        </Button>
                      </Link>
                      {/* <Button variant="outline" className="rounded-2xl w-auto min-w-[160px] px-4 h-10 font-medium">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">{t('dashboard.calendarView')}</span>
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tasks */}
                <Card className="rounded-2xl border-border/50 shadow-soft ">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{t('dashboard.recentTasks')}</CardTitle>
                    <Link to="/tasks">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium px-4 w-auto">
                        <span className="whitespace-nowrap">{t('dashboard.viewAll')}</span>
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(task) => navigate(`/edit-task/${task.id}`)}
                          onDelete={async (id) => await deleteTask(id)}
                          onToggleStatus={async (id) => await toggleTaskStatus(id)}
                        />
                      ))}
                      {recentTasks.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">{t('dashboard.noTasks')}</p>
                          <Link to="/create-task">
                            <Button className="mt-4 rounded-2xl w-auto px-4">
                              {t('dashboard.createFirstTask')}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;