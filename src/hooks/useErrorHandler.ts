import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AppError, ErrorNotificationService } from '@/lib/errors';

export function useErrorHandler() {
  const { t } = useTranslation();

  const handleError = useCallback((
    error: AppError | Error,
    context?: string,
    retryCallback?: () => Promise<void>
  ) => {
    let appError: AppError;
    
    if (error instanceof Error && !('type' in error)) {
      appError = {
        type: 'UNKNOWN' as any,
        severity: 'MEDIUM' as any,
        message: error.message,
        timestamp: new Date()
      };
    } else {
      appError = error as AppError;
    }

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