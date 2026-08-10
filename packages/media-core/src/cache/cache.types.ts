/**
 * Cache configuration and entry types.
 */

/** Configuration for the in-memory cache */
export interface CacheConfig {
  /** Time-to-live in milliseconds. Default: 5 minutes (300_000) */
  readonly ttl: number;
  /** Maximum number of entries. Default: 100 */
  readonly maxEntries: number;
}

/** A single cache entry with metadata for TTL eviction */
export interface CacheEntry<T> {
  readonly value: T;
  readonly createdAt: number;
  readonly expiresAt: number;
}

/** Default cache configuration */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxEntries: 100,
} as const;
