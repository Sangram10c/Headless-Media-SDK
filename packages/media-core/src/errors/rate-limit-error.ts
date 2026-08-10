import { MediaError } from './base-error';

/**
 * Thrown when the API returns 429 Too Many Requests.
 * Contains the Retry-After value in seconds (parsed from response headers).
 */
export class RateLimitError extends MediaError {
  readonly code = 'RATE_LIMIT_ERROR' as const;

  constructor(
    message: string,
    readonly retryAfter: number,
    cause?: unknown,
  ) {
    super(message, cause);
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
    };
  }
}
