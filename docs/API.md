# Public API Reference — Headless Media SDK Ecosystem

## Package 1: `@headless-media/core`

### Client Initialization

```ts
import { createMediaClient, createApiKey } from '@headless-media/core';

const client = createMediaClient({
  apiKey: createApiKey('your-pexels-api-key'),
  baseUrl: 'https://api.pexels.com', // optional
  cache: { ttl: 300000, maxEntries: 100 }, // optional
  retry: { maxRetries: 3, baseDelay: 1000, maxDelay: 10000, jitter: true }, // optional
  logger: true, // optional console logger
});
```

### Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `searchPhotos(params)` | `PhotoSearchParams` | `Promise<PaginatedResponse<PexelsPhoto>>` | Search photos by query |
| `getCurated(params?)` | `CuratedParams` | `Promise<PaginatedResponse<PexelsPhoto>>` | Retrieve curated/trending photos |
| `getPhotoById(id)` | `PhotoId` | `Promise<PexelsPhoto>` | Fetch a single photo |
| `searchVideos(params)` | `VideoSearchParams` | `Promise<PaginatedResponse<PexelsVideo>>` | Search videos by query |
| `getPopularVideos(params?)` | `PopularVideoParams` | `Promise<PaginatedResponse<PexelsVideo>>` | Retrieve popular videos |
| `getVideoById(id)` | `VideoId` | `Promise<PexelsVideo>` | Fetch a single video |
| `download(url)` | `string` | `Promise<void>` | Track download event |
| `subscribe(event, handler)` | `MediaEventType`, `EventHandler` | `Unsubscribe` | Subscribe to SDK events |
| `unsubscribe(event, handler)` | `MediaEventType`, `EventHandler` | `void` | Unsubscribe handler |
| `destroy()` | `void` | `void` | Abort requests, clear cache & listeners |

---

## Package 2: `@headless-media/react`

### Provider

```tsx
<MediaProvider config={sdkConfig}>
  <App />
</MediaProvider>
```

### Hooks

| Hook | Returns | Description |
|---|---|---|
| `useMedia()` | `MediaClient` | Access SDK client instance |
| `useSearch(query, options)` | `{ data, status, error, fetchNextPage, hasNextPage, isFetchingNextPage }` | Reactive photo search with infinite scroll |
| `useCurated(options)` | `{ data, status, error, fetchNextPage, hasNextPage, refetch }` | Reactive curated photo feed |
| `useDownload()` | `{ download, isDownloading, error }` | Download tracker wrapper |
| `useMediaEvents(type, handler)` | `void` | Auto-subscribing event listener |

---

## Package 3: `@headless-media/ui-react`

### Hooks

| Hook | Returns | Description |
|---|---|---|
| `useGrid(options)` | `{ gridItems, getGridProps, getItemProps }` | Headless masonry/grid layout & keyboard nav |
| `useLightbox(options)` | `{ isOpen, currentIndex, currentItem, open, close, next, prev, getBackdropProps, getContentProps, getImageProps, getCloseButtonProps, getNextButtonProps, getPrevButtonProps }` | Headless modal lightbox with focus trap |
| `useReelSwiper(options)` | `{ activeIndex, activeItem, getContainerProps, getSlideProps, scrollTo }` | Headless vertical snap reel swiper |
