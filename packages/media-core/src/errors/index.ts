import { MediaError } from './base-error';

export { MediaError } from './base-error';
export { APIError } from './api-error';
export { NetworkError } from './network-error';
export { ValidationError } from './validation-error';
export { AuthenticationError } from './authentication-error';
export { RateLimitError } from './rate-limit-error';
export { CacheError } from './cache-error';

/**
 * Type guard: checks if an unknown value is a MediaError.
 */
export function isMediaError(error: unknown): error is MediaError {
  return error instanceof MediaError;
}
