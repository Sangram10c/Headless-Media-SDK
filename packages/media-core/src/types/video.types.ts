import { type VideoId } from './branded.types';

/**
 * Video file variant — a specific quality/resolution of a video.
 */
export interface VideoFile {
  readonly id: number;
  readonly quality: 'sd' | 'hd' | 'uhd';
  readonly file_type: string;
  readonly width: number;
  readonly height: number;
  readonly link: string;
  readonly fps: number;
}

/**
 * Video preview picture — a still frame from the video.
 */
export interface VideoPicture {
  readonly id: number;
  readonly picture: string;
  readonly nr: number;
}

/**
 * Video author/user metadata.
 */
export interface VideoUser {
  readonly id: number;
  readonly name: string;
  readonly url: string;
}

/**
 * Pexels Video resource.
 * Represents a single video returned by the API.
 */
export interface PexelsVideo {
  readonly id: VideoId;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly image: string;
  readonly full_res: string | null;
  readonly duration: number;
  readonly user: VideoUser;
  readonly video_files: readonly VideoFile[];
  readonly video_pictures: readonly VideoPicture[];
}

/**
 * Parameters for searching videos.
 */
export interface VideoSearchParams {
  readonly query: string;
  readonly orientation?: import('./common.types').Orientation;
  readonly size?: import('./common.types').Size;
  readonly locale?: import('./common.types').Locale;
  readonly page?: number;
  readonly per_page?: number;
}

/**
 * Parameters for popular videos endpoint.
 */
export interface PopularVideoParams {
  readonly min_width?: number;
  readonly min_height?: number;
  readonly min_duration?: number;
  readonly max_duration?: number;
  readonly page?: number;
  readonly per_page?: number;
}
