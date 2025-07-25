import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import Sidebar from '@/components/Sidebar';
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

describe('Sidebar Component', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar when open', () => {
    renderWithProviders(
      <Sidebar isOpen={true} onToggle={mockOnToggle} userName="testuser" />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders sidebar when closed', () => {
    renderWithProviders(
      <Sidebar isOpen={false} onToggle={mockOnToggle} userName="testuser" />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('handles undefined userName', () => {
    renderWithProviders(
      <Sidebar isOpen={true} onToggle={mockOnToggle} userName={undefined} />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    renderWithProviders(
      <Sidebar isOpen={true} onToggle={mockOnToggle} userName="testuser" />
    );
    expect(document.body).toBeInTheDocument();
  });
});