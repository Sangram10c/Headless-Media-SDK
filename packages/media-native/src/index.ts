/**
 * @headless-media/native — React Native wrapper for @headless-media/core.
 *
 * Implements the exact same provider & hook contracts as @headless-media/react,
 * adapted for React Native platform idioms.
 */

// ─── Re-export Core ───────────────────────────────────────────
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

// ─── Provider & Context ───────────────────────────────────────
export { MediaContext } from './provider/media-context';
export { MediaProvider } from './provider/media-provider';
export type { MediaProviderProps } from './provider/media-provider';

// ─── Hooks ─────────────────────────────────────────────────────
export { useMedia, useSearch, useCurated, useDownload, useMediaEvents } from './hooks';
export type {
  UseSearchOptions,
  UseSearchReturn,
  UseCuratedOptions,
  UseCuratedReturn,
  UseDownloadReturn,
} from './hooks';
