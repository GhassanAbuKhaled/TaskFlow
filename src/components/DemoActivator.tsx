import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoContext } from '@/contexts/DemoContext';

// This component activates demo mode and redirects to dashboard
const DemoActivator = () => {
  const { setDemoMode } = useDemoContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set demo mode to true
    setDemoMode(true);
    
    // Redirect to dashboard
    navigate('/dashboard');
  }, [setDemoMode, navigate]);
  
  // Show loading while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Activating demo mode...</p>
      </div>
    </div>
  );
};

export default DemoActivator;