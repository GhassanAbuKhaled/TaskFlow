import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskProvider } from "./contexts/TaskContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DemoProvider } from "./contexts/DemoContext";
import { useAuth } from "./contexts/AuthContext";
import { useDemoContext } from "./contexts/DemoContext";
import { ErrorBoundary } from "./lib/errors";
import DemoBanner from "./components/DemoBanner";
import DemoActivator from "./components/DemoActivator";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component that allows demo mode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDemoMode } = useDemoContext();
  
  // Allow access if authenticated or in demo mode
  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
};

// Public route component that redirects authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <div className="overflow-x-hidden w-full">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DemoProvider>
            <TaskProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={
                      <PublicRoute>
                        <Welcome />
                      </PublicRoute>
                    } />
                    <Route path="/login" element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    } />
                    <Route path="/register" element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    } />
                    <Route path="/demo" element={
                      <PublicRoute>
                        <DemoActivator />
                      </PublicRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/tasks" element={
                      <ProtectedRoute>
                        <Layout>
                          <Tasks />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/create-task" element={
                      <ProtectedRoute>
                        <Layout>
                          <CreateTask />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/edit-task/:id" element={
                      <ProtectedRoute>
                        <Layout>
                          <CreateTask />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={
                      <Layout showFooter={false}>
                        <NotFound />
                      </Layout>
                    } />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </TaskProvider>
          </DemoProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </ErrorBoundary>
);

export default App;
