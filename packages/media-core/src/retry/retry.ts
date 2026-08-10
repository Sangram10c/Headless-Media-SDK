/**
 * Retry configuration and implementation.
 *
 * Uses exponential backoff with jitter to avoid thundering herd.
 * Only retries on network errors and 5xx; never retries 4xx
 * (except 429 with Retry-After header).
 */

export interface RetryConfig {
  /** Maximum number of retry attempts. Default: 3 */
  readonly maxRetries: number;
  /** Base delay in milliseconds. Default: 1000 */
  readonly baseDelay: number;
  /** Maximum delay cap in milliseconds. Default: 10000 */
  readonly maxDelay: number;
  /** Whether to add jitter. Default: true */
  readonly jitter: boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10_000,
  jitter: true,
} as const;

/**
 * Determines if a given error/status should be retried.
 * - Network errors: always retry
 * - 5xx: retry
 * - 429: retry (rate limit, server might recover)
 * - 4xx (except 429): never retry
 */
export function isRetryable(statusCode: number | null): boolean {
  if (statusCode === null) return true; // Network error (no status)
  if (statusCode === 429) return true; // Rate limited
  return statusCode >= 500; // Server errors
}

/**
 * Calculate delay for a given attempt using exponential backoff with optional jitter.
 *
 * Formula: min(baseDelay * 2^attempt, maxDelay) + jitter
 * Jitter is a random value between 0 and half the calculated delay.
 */
export function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = Math.min(
    config.baseDelay * Math.pow(2, attempt),
    config.maxDelay,
  );

  if (!config.jitter) return exponentialDelay;

  const jitterAmount = Math.random() * exponentialDelay * 0.5;
  return exponentialDelay + jitterAmount;
}

/**
 * Sleep for a given number of milliseconds.
 * Returns a promise that can be used with AbortController.
 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason as Error);
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason as Error);
      },
      { once: true },
    );
  });
}

/**
 * Execute a function with retry logic.
 *
 * @param fn - The async function to execute
 * @param config - Retry configuration
 * @param shouldRetry - Predicate to determine if a specific error should be retried
 * @param signal - Optional AbortSignal to cancel retries
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  shouldRetry: (error: unknown) => boolean = () => true,
  signal?: AbortSignal,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === config.maxRetries;
      if (isLastAttempt || !shouldRetry(error)) {
        throw error;
      }

      const delay = calculateDelay(attempt, config);
      await sleep(delay, signal);
    }
  }

  // TypeScript requires this, but it's unreachable
  throw lastError;
}
