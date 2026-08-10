import {
  type CacheConfig,
  type CacheEntry,
  DEFAULT_CACHE_CONFIG,
} from './cache.types';

/**
 * TTL-based in-memory cache.
 *
 * Design decisions:
 * - Uses a Map for O(1) get/set/delete operations.
 * - TTL is per-entry and checked on read (lazy eviction).
 * - When maxEntries is exceeded, the oldest entry is evicted (FIFO via Map insertion order).
 * - No background timers — eviction only occurs on access. This avoids
 *   keeping the Node.js event loop alive and is simpler to reason about.
 */
export class MemoryCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly config: CacheConfig;

  constructor(config?: Partial<CacheConfig>) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  /**
   * Retrieve a value from the cache.
   * Returns undefined if the key doesn't exist or has expired.
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (this.isExpired(entry)) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * Store a value in the cache with the configured TTL.
   * Evicts the oldest entry if maxEntries is exceeded.
   */
  set<T>(key: string, value: T): void {
    // If key already exists, delete first to reset insertion order
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    // Evict oldest if at capacity
    if (this.store.size >= this.config.maxEntries) {
      this.evictOldest();
    }

    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      createdAt: now,
      expiresAt: now + this.config.ttl,
    };

    this.store.set(key, entry);
  }

  /**
   * Check if a key exists and is not expired.
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove a specific entry from the cache.
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all entries from the cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Returns the current number of entries (including potentially expired ones).
   */
  get size(): number {
    return this.store.size;
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() > entry.expiresAt;
  }

  private evictOldest(): void {
    // Map iterates in insertion order — first key is the oldest
    const oldestKey = this.store.keys().next().value;
    if (oldestKey !== undefined) {
      this.store.delete(oldestKey);
    }
  }
}
