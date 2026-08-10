/**
 * Generic paginated response wrapper.
 *
 * The Pexels API returns different field names for photos vs videos,
 * but this type normalizes them into a consistent shape for consumers.
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly page: number;
  readonly perPage: number;
  readonly totalResults: number;
  readonly nextPage: string | null;
  readonly prevPage: string | null;
}

/**
 * Raw Pexels photo search/curated response shape.
 * Used internally before normalization to PaginatedResponse.
 */
export interface RawPhotoResponse {
  readonly page: number;
  readonly per_page: number;
  readonly total_results: number;
  readonly next_page?: string;
  readonly prev_page?: string;
  readonly photos: readonly Record<string, unknown>[];
}

/**
 * Raw Pexels video search/popular response shape.
 * Used internally before normalization to PaginatedResponse.
 */
export interface RawVideoResponse {
  readonly page: number;
  readonly per_page: number;
  readonly total_results: number;
  readonly next_page?: string;
  readonly prev_page?: string;
  readonly videos: readonly Record<string, unknown>[];
  readonly url?: string;
}
