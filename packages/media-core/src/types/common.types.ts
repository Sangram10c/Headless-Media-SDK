/**
 * Shared enum-like constants for Pexels API query parameters.
 * These are string literal unions rather than TS enums for tree-shaking.
 */

/** Photo/video orientation filter */
export type Orientation = 'landscape' | 'portrait' | 'square';

/** Photo/video size filter */
export type Size = 'large' | 'medium' | 'small';

/** Photo color filter — Pexels supports hex or named colors */
export type Color =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'turquoise'
  | 'blue'
  | 'violet'
  | 'pink'
  | 'brown'
  | 'black'
  | 'gray'
  | 'white'
  | (string & Record<never, never>); // allows hex strings while keeping autocomplete

/** Pexels API supported locales */
export type Locale =
  | 'en-US'
  | 'pt-BR'
  | 'es'
  | 'ca-ES'
  | 'de-DE'
  | 'it-IT'
  | 'fr-FR'
  | 'sv-SE'
  | 'id-ID'
  | 'pl-PL'
  | 'ja-JP'
  | 'zh-TW'
  | 'zh-CN'
  | 'ko-KR'
  | 'th-TH'
  | 'nl-NL'
  | 'hu-HU'
  | 'vi-VN'
  | 'cs-CZ'
  | 'da-DK'
  | 'fi-FI'
  | 'uk-UA'
  | 'el-GR'
  | 'ro-RO'
  | 'nb-NO'
  | 'sk-SK'
  | 'tr-TR'
  | 'ru-RU';

/** Default pagination constants */
export const DEFAULT_PER_PAGE = 15;
export const MAX_PER_PAGE = 80;
export const MIN_PER_PAGE = 1;

/** Default API base URL */
export const PEXELS_API_BASE_URL = 'https://api.pexels.com';
