import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { DemoProvider } from '@/contexts/DemoContext';
import i18n from './setup';

// Basic providers for simple tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <DemoProvider>
              <TaskProvider>
                {children}
              </TaskProvider>
            </DemoProvider>
          </AuthProvider>
        </I18nextProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

// Full providers for complex tests
export const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <DemoProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </DemoProvider>
      </AuthProvider>
    </I18nextProvider>
  </HelmetProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };