import { type ApiKey } from '../types/branded.types';
import { APIError } from '../errors/api-error';
import { AuthenticationError } from '../errors/authentication-error';
import { NetworkError } from '../errors/network-error';
import { RateLimitError } from '../errors/rate-limit-error';
import { type RetryConfig, DEFAULT_RETRY_CONFIG, withRetry, isRetryable } from '../retry/retry';
import { createLinkedController } from '../utils/abort';

/**
 * Low-level HTTP client for the Pexels API.
 *
 * Responsibilities:
 * - Attaches Authorization header to every request
 * - Translates HTTP errors into typed SDK errors
 * - Applies retry logic with exponential backoff
 * - Manages AbortController for request cancellation
 *
 * This is an internal module — consumers interact with MediaClient, not HttpClient.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: ApiKey;
  private readonly retryConfig: RetryConfig | false;
  private readonly globalController = new AbortController();

  constructor(
    apiKey: ApiKey,
    baseUrl: string,
    retryConfig: Partial<RetryConfig> | false = DEFAULT_RETRY_CONFIG,
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, ''); // Normalize trailing slashes
    this.retryConfig = retryConfig === false ? false : { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Performs a GET request to the Pexels API.
   *
   * @param endpoint - API path (e.g., "/v1/search")
   * @param params - Query parameters
   * @param signal - Optional AbortSignal for per-request cancellation
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    signal?: AbortSignal,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const linkedController = createLinkedController(this.globalController.signal);

    // Also link to the caller's signal if provided
    if (signal) {
      const callerController = createLinkedController(signal);
      signal.addEventListener('abort', () => linkedController.abort(signal.reason), { once: true });
      callerController.signal.addEventListener(
        'abort',
        () => linkedController.abort(callerController.signal.reason),
        { once: true },
      );
    }

    const fetchFn = () => this.executeFetch<T>(url, endpoint, linkedController.signal);

    if (this.retryConfig === false) {
      return fetchFn();
    }

    return withRetry(
      fetchFn,
      this.retryConfig,
      (error) => {
        if (error instanceof APIError) return isRetryable(error.statusCode);
        if (error instanceof NetworkError) return true;
        return false;
      },
      linkedController.signal,
    );
  }

  /**
   * Aborts all in-flight requests. Called by MediaClient.destroy().
   */
  destroy(): void {
    this.globalController.abort(new Error('MediaClient destroyed'));
  }

  private async executeFetch<T>(url: string, endpoint: string, signal: AbortSignal): Promise<T> {
    let response: Response;

    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.apiKey,
          Accept: 'application/json',
        },
        signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error; // Re-throw abort errors as-is
      }
      throw new NetworkError(
        `Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        url,
        error,
      );
    }

    if (!response.ok) {
      await this.handleErrorResponse(response, endpoint);
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new APIError(
        'Failed to parse API response as JSON',
        response.status,
        endpoint,
        error,
      );
    }
  }

  private async handleErrorResponse(response: Response, endpoint: string): Promise<never> {
    let body = '';
    try {
      body = await response.text();
    } catch {
      // Ignore body parse failure
    }

    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError(
        `Authentication failed (HTTP ${String(response.status)}): ${body || 'Invalid or missing API key'}`,
        'Ensure your Pexels API key is valid and passed to createMediaClient({ apiKey })',
      );
    }

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') ?? '60', 10);
      throw new RateLimitError(
        `Rate limit exceeded. Retry after ${String(retryAfter)} seconds.`,
        isNaN(retryAfter) ? 60 : retryAfter,
      );
    }

    throw new APIError(
      `API request failed (HTTP ${String(response.status)}): ${body || response.statusText}`,
      response.status,
      endpoint,
    );
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }
}
