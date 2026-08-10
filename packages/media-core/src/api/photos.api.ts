import { type PexelsPhoto, type PhotoSearchParams, type CuratedParams } from '../types/photo.types';
import { type PaginatedResponse, type RawPhotoResponse } from '../types/pagination.types';
import { type PhotoId } from '../types/branded.types';
import { DEFAULT_PER_PAGE } from '../types/common.types';
import { ValidationError } from '../errors/validation-error';

/**
 * Pexels API endpoint definitions for photos.
 */
const ENDPOINTS = {
  SEARCH: '/v1/search',
  CURATED: '/v1/curated',
  PHOTO_BY_ID: '/v1/photos',
} as const;

/**
 * Transforms raw API params to query string params for the photos search endpoint.
 */
export function buildPhotoSearchQuery(
  params: PhotoSearchParams,
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
    color: params.color,
    locale: params.locale,
    page: params.page ?? 1,
    per_page: params.per_page ?? DEFAULT_PER_PAGE,
  };
}

/**
 * Transforms curated params to query string params.
 */
export function buildCuratedQuery(
  params?: CuratedParams,
): Record<string, string | number | undefined> {
  return {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? DEFAULT_PER_PAGE,
  };
}

/**
 * Normalizes a raw Pexels photo response into the SDK's PaginatedResponse<PexelsPhoto>.
 */
export function normalizePhotoResponse(raw: RawPhotoResponse): PaginatedResponse<PexelsPhoto> {
  return {
    data: raw.photos as unknown as readonly PexelsPhoto[],
    page: raw.page,
    perPage: raw.per_page,
    totalResults: raw.total_results,
    nextPage: raw.next_page ?? null,
    prevPage: raw.prev_page ?? null,
  };
}

/**
 * Builds the endpoint path for fetching a photo by ID.
 */
export function buildPhotoByIdPath(id: PhotoId): string {
  return `${ENDPOINTS.PHOTO_BY_ID}/${String(id)}`;
}

export { ENDPOINTS as PHOTO_ENDPOINTS };
