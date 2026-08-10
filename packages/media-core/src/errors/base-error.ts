/**
 * Base error class for all media SDK errors.
 *
 * All SDK errors extend this class, enabling consumers to catch
 * the entire error hierarchy with a single `instanceof MediaError` check.
 *
 * Uses a discriminated `code` field for programmatic error handling
 * without relying on string matching against `message`.
 */
export abstract class MediaError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message, { cause });
    this.name = this.constructor.name;

    // Maintains proper prototype chain in transpiled ES5 environments
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Serializes the error for logging/transport.
   * Subclasses extend this with their own fields.
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...(this.cause !== undefined ? { cause: String(this.cause) } : {}),
    };
  }
}
