import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AppError, ErrorNotificationService, ErrorFactory, ErrorType, ErrorSeverity } from '@/lib/errors';

function isAppError(error: any): error is AppError {
  return error && typeof error === 'object' && 'type' in error && 'severity' in error;
}

export function useErrorHandler() {
  const { t } = useTranslation();

  const handleError = useCallback((
    error: AppError | Error,
    context?: string,
    retryCallback?: () => Promise<void>
  ) => {
    const appError = isAppError(error) 
      ? error 
      : ErrorFactory.createGenericError(error.message || 'Unknown error', ErrorType.UNKNOWN);

    ErrorNotificationService.showError(appError, t, context, retryCallback);
  }, [t]);

  const showSuccess = useCallback((title: string, message: string) => {
    ErrorNotificationService.showSuccess(title, message);
  }, []);

  const showWarning = useCallback((title: string, message: string) => {
    ErrorNotificationService.showWarning(title, message);
  }, []);

  return {
    handleError,
    showSuccess,
    showWarning
  };
}