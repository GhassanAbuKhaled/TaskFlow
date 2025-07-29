import { AxiosError } from 'axios';
import { 
  AppError, 
  APIError, 
  NetworkError, 
  ValidationError, 
  AuthError,
  ErrorType, 
  ErrorSeverity 
} from './types';

export class ErrorFactory {
  static fromAxiosError(error: AxiosError): AppError {
    if (!error.response) {
      return this.createNetworkError(error.message, !navigator.onLine);
    }

    const { status, data, config } = error.response;
    const errorData = data as any;
    
    if (status === 401 || status === 403) {
      const isTokenExpired = status === 401 && this.isTokenExpirationError(config?.url, errorData);
      return this.createAuthError(
        errorData?.message || 'Authentication failed',
        isTokenExpired
      );
    }

    if (status === 422) {
      return this.createValidationError(
        errorData?.message || 'Validation failed',
        errorData?.field,
        errorData?.value
      );
    }

    return this.createAPIError(
      errorData?.message || 'API request failed',
      status,
      config?.url,
      config?.method?.toUpperCase()
    );
  }

  static createAPIError(
    message: string, 
    status: number, 
    endpoint?: string, 
    method?: string
  ): APIError {
    return {
      type: ErrorType.API,
      severity: status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      message,
      status,
      endpoint,
      method,
      timestamp: new Date()
    };
  }

  static createNetworkError(message: string, isOffline = false): NetworkError {
    return {
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.HIGH,
      message,
      isOffline,
      timestamp: new Date()
    };
  }

  static createValidationError(
    message: string, 
    field?: string, 
    value?: any
  ): ValidationError {
    return {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      message,
      field,
      value,
      timestamp: new Date()
    };
  }

  static createAuthError(message: string, isTokenExpired = false): AuthError {
    return {
      type: ErrorType.AUTH,
      severity: ErrorSeverity.MEDIUM,
      message,
      isTokenExpired,
      timestamp: new Date()
    };
  }

  static createGenericError(message: string, type = ErrorType.UNKNOWN): AppError {
    return {
      type,
      severity: ErrorSeverity.MEDIUM,
      message,
      timestamp: new Date()
    };
  }

  private static isTokenExpirationError(url?: string, errorData?: any): boolean {
    // Authentication endpoints should not be treated as token expiration
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    const isAuthEndpoint = authEndpoints.some(endpoint => url?.includes(endpoint));
    
    if (isAuthEndpoint) {
      return false;
    }

    // Check for specific token expiration indicators
    const tokenExpiredMessages = ['token expired', 'jwt expired', 'session expired'];
    const message = errorData?.message?.toLowerCase() || '';
    
    return tokenExpiredMessages.some(indicator => message.includes(indicator));
  }
}