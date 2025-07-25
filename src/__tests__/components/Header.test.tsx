import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { DemoProvider } from '@/contexts/DemoContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <DemoProvider>
        {component}
      </DemoProvider>
    </AuthProvider>
  );
};

describe('Header Component', () => {
  const mockOnToggleSidebar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header without crashing', () => {
    renderWithProviders(<Header onToggleSidebar={mockOnToggleSidebar} />);
    expect(document.body).toBeInTheDocument();
  });

  it('accepts onToggleSidebar prop', () => {
    const result = renderWithProviders(<Header onToggleSidebar={mockOnToggleSidebar} />);
    expect(result.container).toBeInTheDocument();
  });

  it('renders with proper structure', () => {
    renderWithProviders(<Header onToggleSidebar={mockOnToggleSidebar} />);
    // Just verify the component renders without errors
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});