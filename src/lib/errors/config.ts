export const ERROR_CONFIG = {
  RETRY: {
    BASE_DELAY: 1000,
    MAX_DELAY: 10000,
    MAX_ATTEMPTS: 3
  },
  AUTH_ENDPOINTS: ['/auth/login', '/auth/register', '/auth/refresh'],
  TOKEN_EXPIRED_INDICATORS: ['token expired', 'jwt expired', 'session expired']
} as const;

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;