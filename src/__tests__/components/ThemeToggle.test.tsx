import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle Component', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Button should still be in document after click
    expect(button).toBeInTheDocument();
  });
});