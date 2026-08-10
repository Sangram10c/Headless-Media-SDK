import { MediaError } from './base-error';

/**
 * Thrown when a network-level failure occurs (DNS, timeout, connection refused).
 * Distinguished from APIError because no HTTP response was received.
 */
export class NetworkError extends MediaError {
  readonly code = 'NETWORK_ERROR' as const;

  constructor(
    message: string,
    readonly url: string,
    cause?: unknown,
  ) {
    super(message, cause);
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      url: this.url,
    };
  }
}
