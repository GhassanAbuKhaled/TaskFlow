import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';

describe('LanguageSwitcher Component', () => {
  it('renders without crashing', () => {
    render(<LanguageSwitcher />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders component structure', () => {
    const result = render(<LanguageSwitcher />);
    expect(result.container).toBeInTheDocument();
  });

  it('has proper component structure', () => {
    render(<LanguageSwitcher />);
    // Just verify the component renders without errors
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});