# Caching & Resilience Architecture

To maximize network efficiency, minimize Pexels API credit usage, and ensure instant user interaction, `@headless-media/core` integrates a 3-pillar resilience pipeline:

1. **In-Memory LRU Cache (`MemoryCache`)**
2. **Concurrent Request Deduplication (`Deduplicator`)**
3. **Exponential Backoff Retry with Randomized Jitter (`withRetry`)**

---

## 1. In-Memory LRU Cache (`MemoryCache`)

The `MemoryCache` class implements a Least Recently Used (LRU) eviction strategy with time-to-live (TTL) expiration.

### Execution Flow
```
Incoming Request
       │
       ▼
Check MemoryCache ──────► [Cache Hit] ──► Emit 'cache-hit' ──► Return Cached Data
       │
       ▼ [Cache Miss]
Emit 'cache-miss'
       │
       ▼
Execute HTTP Request ──► Store in MemoryCache ──► Return Fresh Data
```

### Cache Configuration
```ts
const client = createMediaClient({
  apiKey: createApiKey('your-key'),
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes TTL
    maxEntries: 100,     // Max 100 responses in RAM
  },
});
```

---

## 2. Request Deduplication (`Deduplicator`)

If multiple components attempt to request the exact same search query or curated feed simultaneously (e.g. 5 UI cards mounting at the same millisecond):

1. The `Deduplicator` intercepts the concurrent requests.
2. The initial request starts the network fetch.
3. Subsequent concurrent calls with the exact same cache key attach to the **pending Promise** of the first request.
4. Only **1 network request** is dispatched to the Pexels API.
5. All callers resolve simultaneously with the same response object.

---

## 3. Exponential Backoff Retry with Randomized Jitter (`withRetry`)

Network glitches or Pexels rate limits (`429 Too Many Requests`) are handled automatically by `withRetry`.

### Delay Formula
The backoff delay between retry attempts is calculated using exponential growth with randomized full jitter to prevent thundering herd problems on API endpoints:

$$ \text{Delay} = \text{random}(0, \min(\text{maxDelay}, \text{baseDelay} \times 2^{\text{attempt}})) $$

### Retry Configuration
```ts
const client = createMediaClient({
  apiKey: createApiKey('your-key'),
  retry: {
    maxRetries: 3,     // Retry up to 3 times before throwing
    baseDelay: 1000,   // Initial 1s delay
    maxDelay: 8000,    // Max 8s delay ceiling
    jitter: true,      // Apply full randomized jitter
  },
});
```

---

## Cache Invalidation Strategy

Clear all cached responses and in-flight request queues programmatically when rotating API keys or clearing user sessions:

```ts
// Invalidate cache immediately
client.clearCache();
```
