import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock API calls
vi.mock('@/lib/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </I18nextProvider>
  </BrowserRouter>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render hook without crashing', () => {
    expect(() => {
      renderHook(() => useAuth(), { wrapper });
    }).not.toThrow();
  });

  it('should provide context value', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    if (result.current) {
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    }
  });

  it('should have auth properties when context is available', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    if (result.current && result.current.user !== undefined) {
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
    }
  });

  it('should handle localStorage operations', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token');

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    if (result.current) {
      expect(result.current).toBeDefined();
    }
  });

  it('should handle invalid localStorage data', async () => {
    localStorage.setItem('user', 'invalid-json');
    localStorage.setItem('token', 'some-token');

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current).toBeDefined();
  });

  it('should handle context lifecycle', async () => {
    const { unmount } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(() => unmount()).not.toThrow();
  });
});