import { MediaError } from './base-error';

/**
 * Thrown when input validation fails before making an API request.
 * Contains the field name and the constraint that was violated.
 */
export class ValidationError extends MediaError {
  readonly code = 'VALIDATION_ERROR' as const;

  constructor(
    message: string,
    readonly field: string,
    readonly constraint: string,
  ) {
    super(message);
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
      constraint: this.constraint,
    };
  }
}
