# Error Handling System

This directory contains a comprehensive, production-grade error handling system for the TaskFlow application.

## Architecture

### Core Components

1. **Types** (`types.ts`) - Centralized error type definitions
2. **Factory** (`factory.ts`) - Error creation and transformation
3. **Handler** (`handler.ts`) - Error processing and response formatting
4. **Boundary** (`boundary.tsx`) - React error boundary component
5. **Notification** (`notification.ts`) - Toast notification service
6. **Validation** (`validation.ts`) - Form validation system

## Usage

### Basic Error Handling

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { handleError, showSuccess } = useErrorHandler();

  const handleApiCall = async () => {
    try {
      await someApiCall();
      showSuccess('Success!', 'Operation completed');
    } catch (error) {
      handleError(error, 'apiCall', retryFunction);
    }
  };
}
```

### Form Validation

```typescript
import { useForm } from '@/hooks/useForm';
import { ValidationRules } from '@/lib/errors';

function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validation: {
      email: {
        required: true,
        rules: [ValidationRules.email(t)]
      },
      password: {
        required: true,
        rules: [ValidationRules.minLength(8, t)]
      }
    },
    onSubmit: async (values) => {
      // Handle form submission
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        value={form.values.email}
        onChange={(e) => form.setValue('email', e.target.value)}
        onBlur={() => form.validateField('email')}
      />
      {form.errors.email && <span>{form.errors.email.message}</span>}
    </form>
  );
}
```

### Error Boundary

```typescript
import { ErrorBoundary } from '@/lib/errors';

function App() {
  return (
    <ErrorBoundary>
      <MyApplication />
    </ErrorBoundary>
  );
}
```

## Error Types

- **APIError** - HTTP API errors with status codes
- **NetworkError** - Network connectivity issues
- **ValidationError** - Form validation failures
- **AuthError** - Authentication/authorization issues

## Features

- **Centralized Error Handling** - Consistent error processing across the app
- **Internationalization** - Multi-language error messages
- **Retry Logic** - Automatic retry for recoverable errors
- **Error Logging** - Comprehensive error tracking
- **User-Friendly Messages** - Clear, actionable error messages
- **Form Integration** - Seamless form validation
- **Toast Notifications** - Non-intrusive error display
- **Error Boundaries** - Graceful error recovery

## Configuration

Error messages are configured in translation files:
- `/public/locales/en/translation.json`
- Error keys under `errors.*` and `validation.*`

## Best Practices

1. Always use the error handling hooks in components
2. Provide context when handling errors
3. Use appropriate error types for different scenarios
4. Include retry callbacks for recoverable operations
5. Validate forms before submission
6. Log errors for monitoring and debugging

## Migration

The old error handling system (`/lib/errorHandler.ts`) is deprecated. Use the new system for all new code and gradually migrate existing code.