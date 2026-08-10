import { type PexelsVideo, type VideoSearchParams, type PopularVideoParams } from '../types/video.types';
import { type PaginatedResponse, type RawVideoResponse } from '../types/pagination.types';
import { type VideoId } from '../types/branded.types';
import { DEFAULT_PER_PAGE } from '../types/common.types';
import { ValidationError } from '../errors/validation-error';

/**
 * Pexels API endpoint definitions for videos.
 */
const ENDPOINTS = {
  SEARCH: '/videos/search',
  POPULAR: '/videos/popular',
  VIDEO_BY_ID: '/videos/videos',
} as const;

/**
 * Transforms raw API params to query string params for the videos search endpoint.
 */
export function buildVideoSearchQuery(
  params: VideoSearchParams,
): Record<string, string | number | undefined> {
  if (!params.query || params.query.trim().length === 0) {
    throw new ValidationError(
      'Search query must be a non-empty string',
      'query',
      'required, non-empty',
    );
  }

  return {
    query: params.query.trim(),
    orientation: params.orientation,
    size: params.size,
    locale: params.locale,
    page: params.page ?? 1,
    per_page: params.per_page ?? DEFAULT_PER_PAGE,
  };
}

/**
 * Transforms popular videos params to query string params.
 */
export function buildPopularVideoQuery(
  params?: PopularVideoParams,
): Record<string, string | number | undefined> {
  return {
    min_width: params?.min_width,
    min_height: params?.min_height,
    min_duration: params?.min_duration,
    max_duration: params?.max_duration,
    page: params?.page ?? 1,
    per_page: params?.per_page ?? DEFAULT_PER_PAGE,
  };
}

/**
 * Normalizes a raw Pexels video response into the SDK's PaginatedResponse<PexelsVideo>.
 */
export function normalizeVideoResponse(raw: RawVideoResponse): PaginatedResponse<PexelsVideo> {
  return {
    data: raw.videos as unknown as readonly PexelsVideo[],
    page: raw.page,
    perPage: raw.per_page,
    totalResults: raw.total_results,
    nextPage: raw.next_page ?? null,
    prevPage: raw.prev_page ?? null,
  };
}

/**
 * Builds the endpoint path for fetching a video by ID.
 */
export function buildVideoByIdPath(id: VideoId): string {
  return `${ENDPOINTS.VIDEO_BY_ID}/${String(id)}`;
}

export { ENDPOINTS as VIDEO_ENDPOINTS };
