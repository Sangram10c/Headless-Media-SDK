// ─── Core Re-exports ───────────────────────────────────────────
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
  MediaError,
  MediaEvent,
  MediaEventType,
} from '@headless-media/core';

export {
  createApiKey,
  createPhotoId,
  createVideoId,
  isPhotoId,
  isVideoId,
  isMediaError,
} from '@headless-media/core';

// ─── Provider ──────────────────────────────────────────────────
export { MediaProvider } from './provider';
export type { MediaProviderProps } from './provider';

// ─── Hooks ─────────────────────────────────────────────────────
export { useMedia, useSearch, useCurated, useDownload, useMediaEvents } from './hooks';
export type {
  UseSearchOptions,
  UseSearchReturn,
  UseCuratedOptions,
  UseCuratedReturn,
  UseDownloadReturn,
} from './hooks';

// ─── Types ─────────────────────────────────────────────────────
export type { QueryStatus, QueryState } from './types';
