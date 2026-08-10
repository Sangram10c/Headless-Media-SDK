import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryCache, Deduplicator } from '../src/cache';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new MemoryCache({ ttl: 1000, maxEntries: 3 });
  });

  it('stores and retrieves cached items before TTL expires', () => {
    cache.set('key1', { foo: 'bar' });
    expect(cache.get('key1')).toEqual({ foo: 'bar' });
  });

  it('returns undefined for non-existent keys', () => {
    expect(cache.get('missing')).toBeUndefined();
  });

  it('evicts expired items on read (lazy eviction)', () => {
    cache.set('key1', 'data');
    vi.advanceTimersByTime(1001);
    expect(cache.get('key1')).toBeUndefined();
  });

  it('evicts oldest items when maxEntries capacity is exceeded (FIFO)', () => {
    cache.set('k1', 1);
    cache.set('k2', 2);
    cache.set('k3', 3);
    cache.set('k4', 4); // Overflow maxEntries=3

    expect(cache.get('k1')).toBeUndefined(); // k1 evicted
    expect(cache.get('k2')).toBe(2);
    expect(cache.get('k3')).toBe(3);
    expect(cache.get('k4')).toBe(4);
  });

  it('clears all entries', () => {
    cache.set('k1', 1);
    cache.set('k2', 2);
    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get('k1')).toBeUndefined();
  });
});

describe('Deduplicator', () => {
  it('deduplicates concurrent in-flight promises with the same key', async () => {
    const dedup = new Deduplicator();
    let executionCount = 0;

    const factory = () =>
      new Promise<string>((resolve) => {
        executionCount++;
        setTimeout(() => resolve('result'), 100);
      });

    const promise1 = dedup.dedupe('key1', factory);
    const promise2 = dedup.dedupe('key1', factory);

    expect(promise1).toBe(promise2); // Same promise instance
    expect(executionCount).toBe(1); // Factory called only once

    vi.runAllTimers();
    const res1 = await promise1;
    const res2 = await promise2;

    expect(res1).toBe('result');
    expect(res2).toBe('result');
    expect(dedup.has('key1')).toBe(false); // Cleaned up after resolve
  });
});
