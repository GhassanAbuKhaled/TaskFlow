# Testing Guide

## Setup
- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **Environment**: jsdom

## Commands
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Structure
```
src/
├── __tests__/
│   ├── components/    # Component tests
│   ├── pages/         # Page tests
│   └── hooks/         # Hook tests
├── __mocks__/         # Mock files
└── test/
    ├── setup.ts       # Test setup
    └── test-utils.tsx # Custom render utilities
```

## Writing Tests
Use the custom render function from `@/test/test-utils` which includes:
- React Router
- i18n Provider

Example:
```tsx
import { render, screen } from '@/test/test-utils';
import MyComponent from '@/components/MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```