import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { authAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error(t('toast.parseUserDataError'));
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast({
        title: t('toast.loginSuccess'),
        description: t('toast.loginWelcome', { username: user.username }),
      });
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || t('toast.loginErrorMessage');
      toast({
        title: t('toast.loginError'),
        description: message || t('toast.loginErrorMessage'),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ username, email, password });
      const { message } = response.data;
      
      toast({
        title: t('toast.registerSuccess'),
        description: message || t('toast.registerMessage'),
      });
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || t('toast.registerErrorMessage');
      toast({
        title: t('toast.registerError'),
        description: message || t('toast.registerErrorMessage'),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    toast({
      title: t('toast.logoutSuccess'),
      description: t('toast.logoutMessage'),
    });
  };

  const authValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { t } = useTranslation();
  if (context === undefined) {
    throw new Error(t('toast.authProviderError'));
  }
  return context;
};