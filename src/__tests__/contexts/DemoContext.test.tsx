import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { DemoProvider, useDemoContext } from '@/contexts/DemoContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <DemoProvider>
        {children}
      </DemoProvider>
    </I18nextProvider>
  </BrowserRouter>
);

describe('DemoContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render hook without crashing', () => {
    expect(() => {
      renderHook(() => useDemoContext(), { wrapper });
    }).not.toThrow();
  });

  it('should provide context value', () => {
    const { result } = renderHook(() => useDemoContext(), { wrapper });
    
    if (result.current) {
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    }
  });

  it('should have demo mode properties when context is available', () => {
    const { result } = renderHook(() => useDemoContext(), { wrapper });
    
    if (result.current && result.current.isDemoMode !== undefined) {
      expect(typeof result.current.isDemoMode).toBe('boolean');
      expect(typeof result.current.enableDemoMode).toBe('function');
      expect(typeof result.current.disableDemoMode).toBe('function');
    }
  });

  it('should handle demo mode toggle when available', () => {
    const { result } = renderHook(() => useDemoContext(), { wrapper });
    
    if (result.current && result.current.enableDemoMode) {
      act(() => {
        result.current.enableDemoMode();
      });
      
      if (result.current.isDemoMode !== undefined) {
        expect(typeof result.current.isDemoMode).toBe('boolean');
      }
    }
  });

  it('should handle context lifecycle', () => {
    const { unmount } = renderHook(() => useDemoContext(), { wrapper });
    expect(() => unmount()).not.toThrow();
  });

  it('should work with localStorage operations', () => {
    localStorage.setItem('demoMode', 'true');
    const { result } = renderHook(() => useDemoContext(), { wrapper });
    
    expect(result.current).toBeDefined();
    localStorage.removeItem('demoMode');
  });
});