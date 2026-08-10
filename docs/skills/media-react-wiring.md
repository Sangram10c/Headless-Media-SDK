---
name: media-react-wiring
description: Teaches AI coding assistants how to correctly initialize and consume @headless-media/react (Provider, hooks, events, error handling).
---

# Skill: `@headless-media/react` Data Wiring & SDK Integration

This skill instructs AI coding assistants on how to connect data, authentication, hooks, and events from `@headless-media/react` to a React application cleanly.

## Core Rules

1. **Provider Requirement**: Always wrap your component tree with `<MediaProvider config={sdkConfig}>`.
2. **Branded API Key**: Never pass raw strings to `config.apiKey`. Always use `createApiKey('your-key')`.
3. **Fail-Fast Hooks**: All hooks (`useMedia`, `useSearch`, `useCurated`, `useDownload`, `useMediaEvents`) MUST be rendered within `<MediaProvider>`. They will throw an explicit error if unmounted.
4. **No Business Logic in UI Components**: UI components must consume hook states (`data`, `status`, `error`, `fetchNextPage`) rather than making direct API calls.

## Quick Start Pattern

```tsx
import { useState, useMemo } from 'react';
import {
  MediaProvider,
  createApiKey,
  useSearch,
  useCurated,
  useMediaEvents,
  type MediaClientConfig,
} from '@headless-media/react';

function App() {
  const config = useMemo<MediaClientConfig>(() => ({
    apiKey: createApiKey(process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'your-key'),
    cache: { ttl: 5 * 60 * 1000, maxEntries: 100 },
    retry: { maxRetries: 3, baseDelay: 1000, maxDelay: 10000, jitter: true },
  }), []);

  return (
    <MediaProvider config={config}>
      <MediaGallery />
    </MediaProvider>
  );
}

function MediaGallery() {
  const [query, setQuery] = useState('nature');

  // Automatic switching between search and curated data
  const search = useSearch(query, { enabled: Boolean(query.trim()) });
  const curated = useCurated({ enabled: !query.trim() });
  const active = query.trim() ? search : curated;

  // Real-time SDK Event Observer
  useMediaEvents('search', (event) => {
    console.log('[SDK Event] Search fired:', event.query);
  });

  if (active.status === 'loading' && active.data.length === 0) {
    return <div>Loading photos...</div>;
  }

  if (active.status === 'error') {
    return <div>Error: {active.error?.message}</div>;
  }

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <PhotoGrid items={active.data} />
      {active.hasNextPage && (
        <button onClick={() => active.fetchNextPage()}>
          {active.isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## Hook Capabilities Matrix

| Hook | Purpose | Return Values |
|---|---|---|
| `useMedia()` | Access raw `MediaClient` instance | `MediaClient` |
| `useSearch(query, options)` | Search photos with auto-refetch & pagination | `{ data, status, error, fetchNextPage, hasNextPage, isFetchingNextPage }` |
| `useCurated(options)` | Trending curated photos | `{ data, status, error, fetchNextPage, hasNextPage, refetch }` |
| `useDownload()` | Track download analytics | `{ download(url), isDownloading, error }` |
| `useMediaEvents(type, handler)` | Reactive event listener | `void` (auto cleanup on unmount) |
