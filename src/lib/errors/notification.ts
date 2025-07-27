import { toast } from '@/hooks/use-toast';
import { TFunction } from 'i18next';
import { AppError } from './types';
import { ErrorHandler } from './handler';

export class ErrorNotificationService {
  private static retryCallbacks = new Map<string, () => Promise<void>>();

  static showError(
    error: AppError,
    t: TFunction,
    context?: string,
    retryCallback?: () => Promise<void>
  ): void {
    const errorResponse = ErrorHandler.getErrorResponse(error, t, context);
    
    // Store retry callback if provided
    const toastId = Date.now().toString();
    if (retryCallback && errorResponse.retry) {
      this.retryCallbacks.set(toastId, retryCallback);
    }

    toast({
      title: errorResponse.title,
      description: errorResponse.message,
      variant: 'destructive'
    });

    // Log error for monitoring
    ErrorHandler.logError(error, context);
  }

  static showSuccess(title: string, message: string): void {
    toast({
      title,
      description: message,
      variant: 'default'
    });
  }

  static showWarning(title: string, message: string): void {
    toast({
      title,
      description: message,
      variant: 'default'
    });
  }

  private static async handleRetry(toastId: string): Promise<void> {
    const retryCallback = this.retryCallbacks.get(toastId);
    if (retryCallback) {
      try {
        await retryCallback();
        this.retryCallbacks.delete(toastId);
      } catch (error) {
        // Retry failed, keep the callback for another attempt
        console.error('Retry failed:', error);
      }
    }
  }

  static clearRetryCallbacks(): void {
    this.retryCallbacks.clear();
  }
}