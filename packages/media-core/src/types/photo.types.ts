import { type PhotoId } from './branded.types';

/**
 * Pexels Photo source URLs at various resolutions.
 * All properties are readonly — response data is immutable.
 */
export interface PhotoSrc {
  readonly original: string;
  readonly large2x: string;
  readonly large: string;
  readonly medium: string;
  readonly small: string;
  readonly portrait: string;
  readonly landscape: string;
  readonly tiny: string;
}

/**
 * Pexels Photo resource.
 * Represents a single photo returned by the API.
 */
export interface PexelsPhoto {
  readonly id: PhotoId;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly photographer: string;
  readonly photographer_url: string;
  readonly photographer_id: number;
  readonly avg_color: string;
  readonly src: PhotoSrc;
  readonly liked: boolean;
  readonly alt: string;
}

/**
 * Parameters for searching photos.
 */
export interface PhotoSearchParams {
  readonly query: string;
  readonly orientation?: import('./common.types').Orientation;
  readonly size?: import('./common.types').Size;
  readonly color?: import('./common.types').Color;
  readonly locale?: import('./common.types').Locale;
  readonly page?: number;
  readonly per_page?: number;
}

/**
 * Parameters for curated photos endpoint.
 */
export interface CuratedParams {
  readonly page?: number;
  readonly per_page?: number;
}
