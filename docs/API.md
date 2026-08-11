# Public API Reference (`@headless-media/core`)

This page documents all public classes, functions, types, and configurations exported by `@headless-media/core`.

---

## Client Initialization

### `createMediaClient(config: MediaClientConfig): MediaClient`
Factory function that constructs and returns a new `MediaClient` instance.

```ts
import { createMediaClient, createApiKey } from '@headless-media/core';

const client = createMediaClient({
  apiKey: createApiKey('your-pexels-api-key'),
  cache: { ttl: 300000, maxEntries: 100 },
  retry: { maxRetries: 3, baseDelay: 1000 },
});
```

---

## Configuration Interfaces

### `MediaClientConfig`
```ts
interface MediaClientConfig {
  /** Branded Pexels API Key */
  readonly apiKey: ApiKey;
  /** In-memory cache configuration */
  readonly cache?: CacheConfig;
  /** Exponential backoff retry configuration */
  readonly retry?: RetryConfig;
  /** Enable default console logging (default: false) */
  readonly logger?: boolean;
}
```

### `CacheConfig`
```ts
interface CacheConfig {
  /** Time to live in milliseconds (default: 300,000 / 5 mins) */
  readonly ttl?: number;
  /** Maximum number of entries stored in LRU cache (default: 100) */
  readonly maxEntries?: number;
}
```

### `RetryConfig`
```ts
interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  readonly maxRetries?: number;
  /** Initial delay before first retry in milliseconds (default: 1000) */
  readonly baseDelay?: number;
  /** Maximum backoff ceiling in milliseconds (default: 8000) */
  readonly maxDelay?: number;
  /** Apply random full jitter to backoff delay (default: true) */
  readonly jitter?: boolean;
}
```

---

## `MediaClient` Methods

### `client.searchPhotos(params: PhotoSearchParams): Promise<PaginatedResponse<PexelsPhoto>>`
Search Pexels photos by query phrase with optional filters.

```ts
const response = await client.searchPhotos({
  query: 'nature',
  page: 1,
  per_page: 20,
  orientation: 'landscape',
  color: 'violet',
});
```

### `client.getCuratedPhotos(params?: CuratedParams): Promise<PaginatedResponse<PexelsPhoto>>`
Fetch curated Pexels photos selected by Pexels editors.

```ts
const response = await client.getCuratedPhotos({ page: 1, per_page: 15 });
```

### `client.getPhotoById(id: PhotoId): Promise<PexelsPhoto>`
Fetch a single photo by its branded `PhotoId`.

```ts
const photo = await client.getPhotoById(createPhotoId(2014422));
```

### `client.searchVideos(params: VideoSearchParams): Promise<PaginatedResponse<PexelsVideo>>`
Search Pexels video reels by query phrase.

```ts
const response = await client.searchVideos({
  query: 'cyberpunk',
  page: 1,
  per_page: 10,
  orientation: 'portrait',
});
```

### `client.getPopularVideos(params?: PopularVideoParams): Promise<PaginatedResponse<PexelsVideo>>`
Fetch popular videos on Pexels.

### `client.getVideoById(id: VideoId): Promise<PexelsVideo>`
Fetch a single video by its branded `VideoId`.

### `client.clearCache(): void`
Clear all entries in the `MemoryCache` and in-flight request `Deduplicator`.

### `client.destroy(): void`
Clean up all cache entries, clear pending request deduplication queues, and unsubscribe all event listeners.

---

## Branded Types & Constructors

```ts
type ApiKey = string & { readonly __brand: unique symbol };
type PhotoId = number & { readonly __brand: unique symbol };
type VideoId = number & { readonly __brand: unique symbol };

function createApiKey(key: string): ApiKey;
function createPhotoId(id: number): PhotoId;
function createVideoId(id: number): VideoId;
function isPhotoId(id: unknown): id is PhotoId;
function isVideoId(id: unknown): id is VideoId;
```

---

## Error Classes

- `MediaError`: Base class for all SDK errors.
- `APIError`: Error returned by Pexels HTTP endpoint.
- `AuthenticationError`: 401 Unauthorized error (invalid/missing API key).
- `RateLimitError`: 429 Too Many Requests error.
- `NetworkError`: Fetch / connection failure.
- `ValidationError`: Invalid input parameter error.
- `CacheError`: Internal cache operational error.
