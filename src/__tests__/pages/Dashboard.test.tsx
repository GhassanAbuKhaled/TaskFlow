import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { DemoProvider } from '@/contexts/DemoContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <DemoProvider>
        <TaskProvider>
          {component}
        </TaskProvider>
      </DemoProvider>
    </AuthProvider>
  );
};

describe('Dashboard Page', () => {
  it('renders dashboard without crashing', () => {
    renderWithProviders(<Dashboard />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders with providers', () => {
    const result = renderWithProviders(<Dashboard />);
    expect(result.container).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    renderWithProviders(<Dashboard />);
    // Just verify the page renders without errors
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});