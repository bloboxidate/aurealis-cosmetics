// Sariee API Error Handling and Response Validation

export interface SarieeError {
  status: boolean;
  internal_code: number;
  code: number;
  message: string;
  data?: any;
}

export class SarieeApiError extends Error {
  public status: boolean;
  public internal_code: number;
  public code: number;
  public data?: any;

  constructor(error: SarieeError) {
    super(error.message);
    this.name = 'SarieeApiError';
    this.status = error.status;
    this.internal_code = error.internal_code;
    this.code = error.code;
    this.data = error.data;
  }
}

export function validateSarieeResponse(response: any): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }

  // Check required fields
  const requiredFields = ['status', 'internal_code', 'code', 'message'];
  for (const field of requiredFields) {
    if (!(field in response)) {
      return false;
    }
  }

  // Validate field types
  if (typeof response.status !== 'boolean') return false;
  if (typeof response.internal_code !== 'number') return false;
  if (typeof response.code !== 'number') return false;
  if (typeof response.message !== 'string') return false;

  return true;
}

export function handleSarieeError(response: any): never {
  if (validateSarieeResponse(response)) {
    throw new SarieeApiError(response);
  } else {
    throw new Error('Invalid response format from Sariee API');
  }
}

export function isSarieeError(error: any): error is SarieeApiError {
  return error instanceof SarieeApiError;
}

export function getErrorMessage(error: any): string {
  if (isSarieeError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function getErrorCode(error: any): number | null {
  if (isSarieeError(error)) {
    return error.code;
  }
  
  return null;
}
