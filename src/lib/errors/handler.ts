import { TFunction } from 'i18next';
import { AppError, ErrorType, ErrorResponse } from './types';

const ERROR_MESSAGES: Record<string, { titleKey: string; messageKey: string; action?: string }> = {
  // API Errors
  'API_400': { titleKey: 'errors.badRequest', messageKey: 'errors.badRequestMessage' },
  'API_401': { titleKey: 'errors.unauthorized', messageKey: 'errors.unauthorizedMessage', action: 'login' },
  'API_403': { titleKey: 'errors.forbidden', messageKey: 'errors.forbiddenMessage' },
  'API_404': { titleKey: 'errors.notFound', messageKey: 'errors.notFoundMessage' },
  'API_409': { titleKey: 'errors.conflict', messageKey: 'errors.conflictMessage' },
  'API_422': { titleKey: 'errors.validation', messageKey: 'errors.validationMessage' },
  'API_429': { titleKey: 'errors.tooManyRequests', messageKey: 'errors.tooManyRequestsMessage' },
  'API_500': { titleKey: 'errors.serverError', messageKey: 'errors.serverErrorMessage', action: 'retry' },
  'API_502': { titleKey: 'errors.serverError', messageKey: 'errors.serverErrorMessage', action: 'retry' },
  'API_503': { titleKey: 'errors.serverError', messageKey: 'errors.serverErrorMessage', action: 'retry' },
  
  // Network Errors
  'NETWORK': { titleKey: 'errors.networkError', messageKey: 'errors.networkErrorMessage', action: 'retry' },
  'NETWORK_OFFLINE': { titleKey: 'errors.offline', messageKey: 'errors.offlineMessage' },
  
  // Auth Errors
  'AUTH': { titleKey: 'errors.authError', messageKey: 'errors.authErrorMessage', action: 'login' },
  'AUTH_EXPIRED': { titleKey: 'errors.sessionExpired', messageKey: 'errors.sessionExpiredMessage', action: 'login' },
  
  // Validation Errors
  'VALIDATION': { titleKey: 'errors.validationError', messageKey: 'errors.validationErrorMessage' },
  
  // Generic
  'UNKNOWN': { titleKey: 'errors.unknown', messageKey: 'errors.unknownMessage', action: 'retry' }
};

export class ErrorHandler {
  static getErrorKey(error: AppError): string {
    switch (error.type) {
      case ErrorType.API:
        return `API_${'status' in error ? error.status : '500'}`;
      case ErrorType.NETWORK:
        return 'isOffline' in error && error.isOffline ? 'NETWORK_OFFLINE' : 'NETWORK';
      case ErrorType.AUTH:
        return 'isTokenExpired' in error && error.isTokenExpired ? 'AUTH_EXPIRED' : 'AUTH';
      case ErrorType.VALIDATION:
        return 'VALIDATION';
      default:
        return 'UNKNOWN';
    }
  }

  static getErrorResponse(
    error: AppError,
    t: TFunction,
    context?: string
  ): ErrorResponse {
    const errorKey = this.getErrorKey(error);
    const mapping = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.UNKNOWN;
    
    // Use server message for validation errors if available
    const message = error.type === ErrorType.VALIDATION && 'details' in error && error.details?.serverMessage
      ? error.details.serverMessage
      : t(mapping.messageKey, { context });

    return {
      title: t(mapping.titleKey),
      message,
      action: mapping.action,
      retry: mapping.action === 'retry'
    };
  }

  static shouldRetry(error: AppError): boolean {
    if (error.type === ErrorType.NETWORK) return true;
    if (error.type === ErrorType.API && 'status' in error) {
      return error.status >= 500 || error.status === 429;
    }
    return false;
  }

  static getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }

  static logError(error: AppError, context?: string): void {
    const logData = {
      ...error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (error.severity === 'CRITICAL' || error.severity === 'HIGH') {
      console.error('Error:', logData);
    } else {
      console.warn('Warning:', logData);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: logData });
    }
  }
}