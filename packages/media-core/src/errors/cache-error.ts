import { MediaError } from './base-error';

/**
 * Thrown when a cache operation fails.
 * Contains the operation that failed (get, set, delete, clear).
 */
export class CacheError extends MediaError {
  readonly code = 'CACHE_ERROR' as const;

  constructor(
    message: string,
    readonly operation: 'get' | 'set' | 'delete' | 'clear',
    cause?: unknown,
  ) {
    super(message, cause);
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      operation: this.operation,
    };
  }
}
