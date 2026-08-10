// ─── Client ────────────────────────────────────────────────────
export { MediaClient, createMediaClient } from './client';
export type { MediaClientConfig } from './client';

// ─── Types ─────────────────────────────────────────────────────
export type {
  ApiKey,
  PhotoId,
  VideoId,
  Orientation,
  Size,
  Color,
  Locale,
  PhotoSrc,
  PexelsPhoto,
  PhotoSearchParams,
  CuratedParams,
  VideoFile,
  VideoPicture,
  VideoUser,
  PexelsVideo,
  VideoSearchParams,
  PopularVideoParams,
  PaginatedResponse,
} from './types';

export {
  createApiKey,
  createPhotoId,
  createVideoId,
  isPhotoId,
  isVideoId,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  MIN_PER_PAGE,
  PEXELS_API_BASE_URL,
} from './types';

// ─── Errors ────────────────────────────────────────────────────
export {
  MediaError,
  APIError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
  CacheError,
  isMediaError,
} from './errors';

// ─── Events ────────────────────────────────────────────────────
export { MediaEventEmitter, defaultLogger } from './events';
export type {
  MediaEvent,
  MediaEventType,
  MediaEventPayload,
  EventHandler,
  Unsubscribe,
  EventSubscriber,
  SearchEvent,
  ViewEvent,
  DownloadEvent,
  ErrorEvent,
  CacheHitEvent,
  CacheMissEvent,
} from './events';

// ─── Cache ─────────────────────────────────────────────────────
export { MemoryCache, Deduplicator } from './cache';
export type { CacheConfig, CacheEntry } from './cache';

// ─── Retry ─────────────────────────────────────────────────────
export { withRetry, isRetryable, DEFAULT_RETRY_CONFIG } from './retry';
export type { RetryConfig } from './retry';
