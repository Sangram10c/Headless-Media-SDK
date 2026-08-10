import { MediaError } from './base-error';

/**
 * Thrown when the Pexels API returns a non-2xx response.
 * Contains the HTTP status code and the endpoint for debugging.
 */
export class APIError extends MediaError {
  readonly code = 'API_ERROR' as const;

  constructor(
    message: string,
    readonly statusCode: number,
    readonly endpoint: string,
    cause?: unknown,
  ) {
    super(message, cause);
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      statusCode: this.statusCode,
      endpoint: this.endpoint,
    };
  }
}
