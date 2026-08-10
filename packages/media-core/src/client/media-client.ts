import { type PhotoSearchParams, type CuratedParams, type PexelsPhoto } from '../types/photo.types';
import { type VideoSearchParams, type PopularVideoParams, type PexelsVideo } from '../types/video.types';
import { type PaginatedResponse, type RawPhotoResponse, type RawVideoResponse } from '../types/pagination.types';
import { type PhotoId, type VideoId } from '../types/branded.types';
import { PEXELS_API_BASE_URL } from '../types/common.types';
import { type MediaClientConfig } from './media-client.types';
import { HttpClient } from './http-client';
import { MemoryCache } from '../cache/memory-cache';
import { Deduplicator } from '../cache/deduplicator';
import { MediaEventEmitter } from '../events/event-emitter';
import { defaultLogger } from '../events/default-logger';
import {
  type EventHandler,
  type MediaEventType,
  type Unsubscribe,
} from '../events/event-emitter.types';
import {
  buildPhotoSearchQuery,
  buildCuratedQuery,
  normalizePhotoResponse,
  buildPhotoByIdPath,
  PHOTO_ENDPOINTS,
} from '../api/photos.api';
import {
  buildVideoSearchQuery,
  buildPopularVideoQuery,
  normalizeVideoResponse,
  buildVideoByIdPath,
  VIDEO_ENDPOINTS,
} from '../api/videos.api';
import { createCacheKey } from '../utils/abort';

/**
 * MediaClient — the main entry point for the Headless Media SDK.
 *
 * Orchestrates HTTP requests, caching, deduplication, events, and
 * error handling into a clean, framework-agnostic public API.
 *
 * Created via the `createMediaClient()` factory function.
 *
 * Architecture:
 * - HttpClient handles low-level fetch, auth, retries, and error classification
 * - MemoryCache handles TTL-based response caching
 * - Deduplicator prevents duplicate in-flight requests
 * - MediaEventEmitter provides the observer pattern for SDK events
 * - API modules (photos.api, videos.api) handle query building and response normalization
 * - MediaClient is a thin orchestration layer — no business logic of its own
 */
export class MediaClient {
  private readonly httpClient: HttpClient;
  private readonly cache: MemoryCache | null;
  private readonly deduplicator: Deduplicator;
  private readonly emitter: MediaEventEmitter;
  private destroyed = false;

  constructor(config: MediaClientConfig) {
    const baseUrl = config.baseUrl ?? PEXELS_API_BASE_URL;

    this.httpClient = new HttpClient(
      config.apiKey,
      baseUrl,
      config.retry === false ? false : config.retry,
    );

    this.cache = config.cache === false ? null : new MemoryCache(config.cache ?? undefined);
    this.deduplicator = new Deduplicator();
    this.emitter = new MediaEventEmitter();

    // Register logger
    if (config.logger === true) {
      this.emitter.subscribe('search', defaultLogger.onEvent);
      this.emitter.subscribe('view', defaultLogger.onEvent);
      this.emitter.subscribe('download', defaultLogger.onEvent);
      this.emitter.subscribe('error', defaultLogger.onEvent);
      this.emitter.subscribe('cache-hit', defaultLogger.onEvent);
      this.emitter.subscribe('cache-miss', defaultLogger.onEvent);
    } else if (config.logger && typeof config.logger === 'object') {
      this.emitter.subscribe('search', config.logger.onEvent);
      this.emitter.subscribe('view', config.logger.onEvent);
      this.emitter.subscribe('download', config.logger.onEvent);
      this.emitter.subscribe('error', config.logger.onEvent);
      this.emitter.subscribe('cache-hit', config.logger.onEvent);
      this.emitter.subscribe('cache-miss', config.logger.onEvent);
    }
  }

  // ─── Photos ──────────────────────────────────────────────────

  /**
   * Search photos by query string with optional filters.
   */
  async searchPhotos(params: PhotoSearchParams): Promise<PaginatedResponse<PexelsPhoto>> {
    this.assertNotDestroyed();

    const queryParams = buildPhotoSearchQuery(params);
    const cacheKey = createCacheKey(PHOTO_ENDPOINTS.SEARCH, queryParams);

    this.emitter.emit({
      type: 'search',
      query: params.query,
      mediaType: 'photo',
      timestamp: Date.now(),
    });

    return this.cachedRequest<PaginatedResponse<PexelsPhoto>>(
      cacheKey,
      async () => {
        const raw = await this.httpClient.get<RawPhotoResponse>(
          PHOTO_ENDPOINTS.SEARCH,
          queryParams,
        );
        return normalizePhotoResponse(raw);
      },
    );
  }

  /**
   * Get curated/trending photos.
   */
  async getCurated(params?: CuratedParams): Promise<PaginatedResponse<PexelsPhoto>> {
    this.assertNotDestroyed();

    const queryParams = buildCuratedQuery(params);
    const cacheKey = createCacheKey(PHOTO_ENDPOINTS.CURATED, queryParams);

    return this.cachedRequest<PaginatedResponse<PexelsPhoto>>(
      cacheKey,
      async () => {
        const raw = await this.httpClient.get<RawPhotoResponse>(
          PHOTO_ENDPOINTS.CURATED,
          queryParams,
        );
        return normalizePhotoResponse(raw);
      },
    );
  }

  /**
   * Get a single photo by its ID.
   */
  async getPhotoById(id: PhotoId): Promise<PexelsPhoto> {
    this.assertNotDestroyed();

    const endpoint = buildPhotoByIdPath(id);
    const cacheKey = createCacheKey(endpoint);

    this.emitter.emit({
      type: 'view',
      id,
      mediaType: 'photo',
      timestamp: Date.now(),
    });

    return this.cachedRequest<PexelsPhoto>(
      cacheKey,
      () => this.httpClient.get<PexelsPhoto>(endpoint),
    );
  }

  // ─── Videos ──────────────────────────────────────────────────

  /**
   * Search videos by query string with optional filters.
   */
  async searchVideos(params: VideoSearchParams): Promise<PaginatedResponse<PexelsVideo>> {
    this.assertNotDestroyed();

    const queryParams = buildVideoSearchQuery(params);
    const cacheKey = createCacheKey(VIDEO_ENDPOINTS.SEARCH, queryParams);

    this.emitter.emit({
      type: 'search',
      query: params.query,
      mediaType: 'video',
      timestamp: Date.now(),
    });

    return this.cachedRequest<PaginatedResponse<PexelsVideo>>(
      cacheKey,
      async () => {
        const raw = await this.httpClient.get<RawVideoResponse>(
          VIDEO_ENDPOINTS.SEARCH,
          queryParams,
        );
        return normalizeVideoResponse(raw);
      },
    );
  }

  /**
   * Get popular/trending videos.
   */
  async getPopularVideos(params?: PopularVideoParams): Promise<PaginatedResponse<PexelsVideo>> {
    this.assertNotDestroyed();

    const queryParams = buildPopularVideoQuery(params);
    const cacheKey = createCacheKey(VIDEO_ENDPOINTS.POPULAR, queryParams);

    return this.cachedRequest<PaginatedResponse<PexelsVideo>>(
      cacheKey,
      async () => {
        const raw = await this.httpClient.get<RawVideoResponse>(
          VIDEO_ENDPOINTS.POPULAR,
          queryParams,
        );
        return normalizeVideoResponse(raw);
      },
    );
  }

  /**
   * Get a single video by its ID.
   */
  async getVideoById(id: VideoId): Promise<PexelsVideo> {
    this.assertNotDestroyed();

    const endpoint = buildVideoByIdPath(id);
    const cacheKey = createCacheKey(endpoint);

    this.emitter.emit({
      type: 'view',
      id,
      mediaType: 'video',
      timestamp: Date.now(),
    });

    return this.cachedRequest<PexelsVideo>(
      cacheKey,
      () => this.httpClient.get<PexelsVideo>(endpoint),
    );
  }

  // ─── Download Tracking ───────────────────────────────────────

  /**
   * Track a download event. This doesn't perform the actual download —
   * it emits a 'download' event for analytics/attribution purposes.
   */
  async download(url: string): Promise<void> {
    this.assertNotDestroyed();

    this.emitter.emit({
      type: 'download',
      url,
      timestamp: Date.now(),
    });
  }

  // ─── Events ──────────────────────────────────────────────────

  /**
   * Subscribe to SDK events.
   * Returns an unsubscribe function for cleanup.
   */
  subscribe<E extends MediaEventType>(event: E, handler: EventHandler<E>): Unsubscribe {
    return this.emitter.subscribe(event, handler);
  }

  /**
   * Unsubscribe a handler from SDK events.
   */
  unsubscribe<E extends MediaEventType>(event: E, handler: EventHandler<E>): void {
    this.emitter.unsubscribe(event, handler);
  }

  // ─── Lifecycle ───────────────────────────────────────────────

  /**
   * Destroys the client: aborts all in-flight requests,
   * clears cache, and removes all event listeners.
   *
   * After calling destroy(), all method calls will throw.
   */
  destroy(): void {
    this.destroyed = true;
    this.httpClient.destroy();
    this.cache?.clear();
    this.deduplicator.clear();
    this.emitter.destroy();
  }

  // ─── Internals ───────────────────────────────────────────────

  /**
   * Orchestrates cache + deduplication for a request.
   *
   * Flow: cache check → dedup check → HTTP request → cache store
   */
  private async cachedRequest<T>(cacheKey: string, factory: () => Promise<T>): Promise<T> {
    // 1. Check cache
    if (this.cache) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== undefined) {
        this.emitter.emit({ type: 'cache-hit', key: cacheKey, timestamp: Date.now() });
        return cached;
      }
      this.emitter.emit({ type: 'cache-miss', key: cacheKey, timestamp: Date.now() });
    }

    // 2. Deduplicate in-flight requests
    return this.deduplicator.dedupe(cacheKey, async () => {
      const result = await factory();

      // 3. Store in cache
      if (this.cache) {
        this.cache.set(cacheKey, result);
      }

      return result;
    });
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error('[MediaSDK] Cannot use a destroyed MediaClient. Create a new instance.');
    }
  }
}

/**
 * Factory function to create a MediaClient instance.
 *
 * This is the recommended entry point for consumers:
 * ```ts
 * const client = createMediaClient({
 *   apiKey: createApiKey('your-key'),
 *   logger: true,
 * });
 * ```
 */
export function createMediaClient(config: MediaClientConfig): MediaClient {
  return new MediaClient(config);
}
