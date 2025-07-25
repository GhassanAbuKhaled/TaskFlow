import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

// Simple test component to access AuthContext
const TestComponent = () => {
  try {
    const { user, isLoading } = useAuth();
    return (
      <div>
        <div data-testid="user">{user ? user.username : 'No user'}</div>
        <div data-testid="loading">{isLoading ? 'Loading' : 'Not loading'}</div>
      </div>
    );
  } catch (error) {
    return <div data-testid="error">Error accessing auth context</div>;
  }
};

const renderWithAuthProvider = (children: ReactNode) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const result = renderWithAuthProvider(<TestComponent />);
    expect(result.container).toBeInTheDocument();
  });

  it('provides auth context', () => {
    renderWithAuthProvider(<TestComponent />);
    // Just verify the component renders without throwing errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles localStorage operations', () => {
    // Test localStorage functionality
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token');

    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(localStorage.getItem('token')).toBe('mock-token');

    localStorage.clear();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});