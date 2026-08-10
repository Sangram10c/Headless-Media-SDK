import { type ApiKey } from '../types/branded.types';
import { type CacheConfig } from '../cache/cache.types';
import { type RetryConfig } from '../retry/retry';
import { type EventSubscriber } from '../events/event-emitter.types';

/**
 * Configuration for creating a MediaClient instance.
 */
export interface MediaClientConfig {
  /** Pexels API key (branded type enforces validation at creation) */
  readonly apiKey: ApiKey;
  /** API base URL. Default: https://api.pexels.com */
  readonly baseUrl?: string;
  /** Cache configuration. Set to false to disable caching. */
  readonly cache?: Partial<CacheConfig> | false;
  /** Retry configuration. Set to false to disable retries. */
  readonly retry?: Partial<RetryConfig> | false;
  /**
   * Logging configuration.
   * - true: use the default console logger
   * - false: disable logging
   * - EventSubscriber: use a custom subscriber
   */
  readonly logger?: boolean | EventSubscriber;
}
