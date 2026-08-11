# Event Streaming System

The **Headless Media SDK** features a built-in event bus (`MediaEventEmitter`) that broadcasts real-time telemetry events whenever operations are performed in the SDK runtime.

---

## Event Types

The SDK emits 6 event types:

| Event Type | Description | Payload Attributes |
| :--- | :--- | :--- |
| `search` | Emitted when a photo or video search query is executed. | `query`: string, `mediaType`: `'photo' \| 'video'` |
| `view` | Emitted when a photo or video item is viewed. | `id`: `PhotoId \| VideoId`, `mediaType`: `'photo' \| 'video'` |
| `download` | Emitted when a media file download is initiated. | `url`: string |
| `cache-hit` | Emitted when a request is served directly from `MemoryCache`. | `key`: string |
| `cache-miss` | Emitted when a request misses the cache and initiates an HTTP fetch. | `key`: string |
| `error` | Emitted when an API, authentication, network, or rate limit error occurs. | `error`: `MediaError` |

---

## Subscribing in Pure TypeScript (`@headless-media/core`)

```ts
import { createMediaClient, createApiKey } from '@headless-media/core';

const client = createMediaClient({
  apiKey: createApiKey('your-pexels-api-key'),
});

// Subscribe to all error events
const unsubscribe = client.emitter.on('error', (event) => {
  if (event.type === 'error') {
    console.error('Captured SDK Error:', event.error.message);
  }
});

// Clean up when done
unsubscribe();
```

---

## Subscribing in React Components (`@headless-media/react`)

Use the `useMediaEvents` hook to listen to event streams directly inside React components:

```tsx
import React, { useState } from 'react';
import { useMediaEvents, type MediaEvent } from '@headless-media/react';

export function ActivityDrawer() {
  const [events, setEvents] = useState<MediaEvent[]>([]);

  useMediaEvents('search', (ev) => setEvents((prev) => [ev, ...prev]));
  useMediaEvents('cache-hit', (ev) => setEvents((prev) => [ev, ...prev]));
  useMediaEvents('cache-miss', (ev) => setEvents((prev) => [ev, ...prev]));
  useMediaEvents('error', (ev) => setEvents((prev) => [ev, ...prev]));

  return (
    <div className="event-stream">
      {events.map((ev, i) => (
        <div key={i} className={`badge ${ev.type}`}>
          {ev.type} - {ev.timestamp}
        </div>
      ))}
    </div>
  );
}
```

---

## Default Console Logger

The SDK includes a built-in `defaultLogger` utility that prints formatted log entries to `console.debug`, `console.warn`, and `console.error`:

```ts
import { createMediaClient, createApiKey, defaultLogger } from '@headless-media/core';

const client = createMediaClient({
  apiKey: createApiKey('your-key'),
  logger: true, // Automatically attaches defaultLogger subscriber
});
```
