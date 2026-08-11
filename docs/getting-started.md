# Getting Started

Welcome to the **Headless Media SDK** getting started guide. This document will walk you through setting up your Pexels API key, initializing the SDK, fetching photo and video data, and listening to real-time events.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher.
- **Pexels API Key**: A free API key from [pexels.com/api](https://www.pexels.com/api/).
- **React / React Native**: React `^18.0.0` or `^19.0.0` (for React/Web or React Native projects).

---

## Step 1: Install Packages

Install the appropriate packages for your framework:

::: code-group
```bash [React / Web]
pnpm add @headless-media/core @headless-media/react @headless-media/ui-react
```

```bash [React Native / Mobile]
pnpm add @headless-media/core @headless-media/native @headless-media/ui-native
```
:::

---

## Step 2: Initialize `MediaProvider`

Wrap your React root with `<MediaProvider>` and supply an `MediaClientConfig` containing a branded `ApiKey`.

```tsx
import React, { useMemo } from 'react';
import { MediaProvider } from '@headless-media/react';
import { createApiKey, type MediaClientConfig } from '@headless-media/core';

export function App() {
  const config = useMemo<MediaClientConfig>(() => ({
    // Use createApiKey helper to instantiate nominal branded type
    apiKey: createApiKey(import.meta.env.VITE_PEXELS_API_KEY || ''),
    cache: {
      ttl: 5 * 60 * 1000, // 5 minutes in-memory cache
      maxEntries: 100,
    },
    retry: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 8000,
      jitter: true,
    },
  }), []);

  return (
    <MediaProvider config={config}>
      <MediaGallery />
    </MediaProvider>
  );
}
```

---

## Step 3: Fetch Media with `useSearch` & `useCurated`

Inside any child component, use `useSearch` or `useCurated` to fetch paginated photo data.

```tsx
import React from 'react';
import { useSearch } from '@headless-media/react';
import { useGrid, useLightbox } from '@headless-media/ui-react';
import { photoToLightboxItem } from './utils';

export function MediaGallery() {
  const { data: photos, status, error, fetchNextPage, hasNextPage } = useSearch('nature', {
    perPage: 20,
    orientation: 'landscape',
  });

  const lightbox = useLightbox({
    items: photos.map((p) => ({ src: p.src.large, alt: p.alt })),
  });

  const { gridItems, getItemProps } = useGrid({
    items: photos,
    columns: 4,
    getItemKey: (item) => item.id,
    onItemClick: (_, index) => lightbox.open(index),
  });

  if (status === 'loading') return <div>Loading curated photos...</div>;
  if (status === 'error') return <div>Error: {error?.message}</div>;

  return (
    <div>
      <div className="masonry-grid">
        {gridItems.map((gi) => (
          <div key={gi.key} {...getItemProps(gi)}>
            <img src={gi.item.src.medium} alt={gi.item.alt} />
          </div>
        ))}
      </div>

      {hasNextPage && (
        <button onClick={fetchNextPage}>Load More</button>
      )}
    </div>
  );
}
```

---

## Step 4: Real-time Event Subscription

Subscribe to SDK telemetry events such as `search`, `download`, `cache-hit`, or `error`:

```tsx
import React from 'react';
import { useMediaEvents } from '@headless-media/react';
import type { MediaEvent } from '@headless-media/core';

export function EventLogger() {
  useMediaEvents('search', (ev: MediaEvent) => {
    console.log('🔍 Search event emitted:', ev);
  });

  useMediaEvents('error', (ev: MediaEvent) => {
    console.error('⚠️ SDK Error event:', ev);
  });

  return null;
}
```
