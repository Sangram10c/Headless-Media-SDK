import { MediaError } from './base-error';

/**
 * Thrown when authentication fails (invalid or missing API key).
 * Includes a hint for the developer on how to resolve the issue.
 */
export class AuthenticationError extends MediaError {
  readonly code = 'AUTHENTICATION_ERROR' as const;

  constructor(
    message: string,
    readonly hint: string,
    cause?: unknown,
  ) {
    super(message, cause);
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      hint: this.hint,
    };
  }
}
