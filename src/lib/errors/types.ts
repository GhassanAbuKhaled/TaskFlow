export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  AUTH = 'AUTH',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface BaseError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface APIError extends BaseError {
  type: ErrorType.API;
  status: number;
  endpoint?: string;
  method?: string;
}

export interface NetworkError extends BaseError {
  type: ErrorType.NETWORK;
  isOffline?: boolean;
}

export interface ValidationError extends BaseError {
  type: ErrorType.VALIDATION;
  field?: string;
  value?: any;
}

export interface AuthError extends BaseError {
  type: ErrorType.AUTH;
  isTokenExpired?: boolean;
}

export type AppError = APIError | NetworkError | ValidationError | AuthError | BaseError;

export interface ErrorResponse {
  title: string;
  message: string;
  action?: string;
  retry?: boolean;
}