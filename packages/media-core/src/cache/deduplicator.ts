/**
 * Request deduplicator.
 *
 * Prevents duplicate in-flight requests by caching the Promise
 * for a given cache key. If a second request arrives with the same
 * key while the first is still pending, the exact same Promise is returned.
 *
 * The entry is removed once the Promise resolves or rejects,
 * so subsequent requests will make a fresh API call.
 */
export class Deduplicator {
  private readonly inflight = new Map<string, Promise<unknown>>();

  /**
   * Execute a factory function with deduplication.
   *
   * If a request with the same key is already in-flight, returns the
   * existing Promise instance instead of invoking the factory.
   */
  dedupe<T>(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.inflight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = factory().finally(() => {
      this.inflight.delete(key);
    });

    this.inflight.set(key, promise);
    return promise;
  }

  /**
   * Check if a request with the given key is currently in-flight.
   */
  has(key: string): boolean {
    return this.inflight.has(key);
  }

  /**
   * Returns the number of currently in-flight requests.
   */
  get size(): number {
    return this.inflight.size;
  }

  /**
   * Clears all tracked in-flight requests.
   * Does NOT abort the underlying promises.
   */
  clear(): void {
    this.inflight.clear();
  }
}
