import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { authAPI } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AppError } from '@/lib/errors';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  issued_at: string;
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
  const { t } = useTranslation();
  const { handleError, showSuccess } = useErrorHandler();



  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (token && storedUser && expiresAt) {
      const now = Date.now();
      const expiry = parseInt(expiresAt);
      
      if (now < expiry) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.clear();
        }
      } else {
        localStorage.clear();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, refresh_token, expires_in, user }: AuthResponse = response.data;
      
      const expiresAt = Date.now() + (expires_in * 1000);
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('token_expires_at', expiresAt.toString());
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      showSuccess(
        t('toast.loginSuccess'),
        t('toast.loginWelcome', { username: user.username })
      );
      
      return true;
    } catch (error: any) {
      handleError(error, 'login');
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
      
      showSuccess(
        t('toast.registerSuccess'),
        message || t('toast.registerMessage')
      );
      
      return true;
    } catch (error: any) {
      handleError(error, 'register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    showSuccess(
      t('toast.logoutSuccess'),
      t('toast.logoutMessage')
    );
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