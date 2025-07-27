import { TFunction } from "i18next";

export interface ErrorResponse {
  title: string;
  message: string;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public serverMessage?: string,
    public originalError?: any
  ) {
    super(`API Error: ${status}`);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(public originalError?: any) {
    super('Network Error');
    this.name = 'NetworkError';
  }
}

const ERROR_MAPPINGS: Record<number, { titleKey: string; messageKey: string }> = {
  401: { titleKey: 'toast.invalidCredentials', messageKey: 'toast.invalidCredentialsMessage' },
  403: { titleKey: 'toast.accountBlocked', messageKey: 'toast.accountBlockedMessage' },
  409: { titleKey: 'toast.emailExists', messageKey: 'toast.emailExistsMessage' },
  422: { titleKey: 'toast.validationError', messageKey: 'toast.validationErrorMessage' },
  429: { titleKey: 'toast.tooManyAttempts', messageKey: 'toast.tooManyAttemptsMessage' },
  500: { titleKey: 'toast.serverError', messageKey: 'toast.serverErrorMessage' },
  502: { titleKey: 'toast.serverError', messageKey: 'toast.serverErrorMessage' },
  503: { titleKey: 'toast.serverError', messageKey: 'toast.serverErrorMessage' },
};

export const parseAPIError = (error: any): APIError | NetworkError => {
  if (!error.response) {
    return new NetworkError(error);
  }
  
  return new APIError(
    error.response.status,
    error.response.data?.message,
    error
  );
};

export const getErrorResponse = (
  error: APIError | NetworkError,
  t: TFunction,
  fallbackTitleKey: string,
  fallbackMessageKey: string
): ErrorResponse => {
  if (error instanceof NetworkError) {
    return {
      title: t('toast.networkError'),
      message: t('toast.networkErrorMessage'),
    };
  }

  if (error instanceof APIError) {
    const mapping = ERROR_MAPPINGS[error.status];
    
    if (mapping) {
      return {
        title: t(mapping.titleKey),
        message: error.status === 422 && error.serverMessage 
          ? error.serverMessage 
          : t(mapping.messageKey),
      };
    }

    return {
      title: t(fallbackTitleKey),
      message: error.serverMessage || t(fallbackMessageKey),
    };
  }

  return {
    title: t(fallbackTitleKey),
    message: t(fallbackMessageKey),
  };
};