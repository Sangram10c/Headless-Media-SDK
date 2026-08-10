/**
 * Branded type utility.
 *
 * Creates a nominal type from a structural base type by intersecting
 * with a unique symbol brand. This prevents accidental interchange
 * of structurally-identical values (e.g., PhotoId vs VideoId).
 *
 * @example
 * type UserId = Brand<number, 'UserId'>;
 * const id: UserId = 42 as UserId; // explicit cast required
 */
declare const __brand: unique symbol;

type Brand<T, B extends string> = T & { readonly [__brand]: B };

/** Pexels API key — branded to prevent passing arbitrary strings */
export type ApiKey = Brand<string, 'ApiKey'>;

/** Photo resource identifier */
export type PhotoId = Brand<number, 'PhotoId'>;

/** Video resource identifier */
export type VideoId = Brand<number, 'VideoId'>;

/**
 * Type guard: narrows an unknown number to PhotoId.
 * Validates the value is a positive integer.
 */
export function isPhotoId(value: unknown): value is PhotoId {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Type guard: narrows an unknown number to VideoId.
 * Validates the value is a positive integer.
 */
export function isVideoId(value: unknown): value is VideoId {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Factory: creates a branded ApiKey from a raw string.
 * Validates that the key is non-empty.
 */
export function createApiKey(key: string): ApiKey {
  if (!key || key.trim().length === 0) {
    throw new Error('API key must be a non-empty string');
  }
  return key as ApiKey;
}

/**
 * Factory: creates a branded PhotoId from a raw number.
 */
export function createPhotoId(id: number): PhotoId {
  if (!isPhotoId(id)) {
    throw new Error(`Invalid photo ID: ${String(id)}. Must be a positive integer.`);
  }
  return id;
}

/**
 * Factory: creates a branded VideoId from a raw number.
 */
export function createVideoId(id: number): VideoId {
  if (!isVideoId(id)) {
    throw new Error(`Invalid video ID: ${String(id)}. Must be a positive integer.`);
  }
  return id;
}
