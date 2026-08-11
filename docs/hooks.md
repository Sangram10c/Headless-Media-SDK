# React & React Native Hooks Reference

This guide details all hooks exported by `@headless-media/react`, `@headless-media/native`, `@headless-media/ui-react`, and `@headless-media/ui-native`.

---

## Data Fetching Hooks (`@headless-media/react` & `@headless-media/native`)

### `useMedia(): MediaClient`
Returns the active `MediaClient` instance from `MediaContext`. Must be called inside a `<MediaProvider>`.

```tsx
const client = useMedia();
```

---

### `useSearch(query: string, options?: UseSearchOptions): UseSearchReturn`
Executes paginated photo queries with automated pagination and status management.

#### Parameters
- `query` (`string`): Search query term (e.g. `'nature'`).
- `options`:
  - `page` (`number`, default: `1`): Starting page index.
  - `perPage` (`number`, default: `20`): Items per page.
  - `orientation` (`'landscape' | 'portrait' | 'square'`): Filter by aspect ratio.
  - `color` (`string`): Filter by dominant color.
  - `enabled` (`boolean`, default: `true`): Pause or enable auto-fetching.

#### Return Value (`UseSearchReturn`)
- `data`: `readonly PexelsPhoto[]`
- `status`: `'idle' | 'loading' | 'success' | 'error'`
- `error`: `MediaError | null`
- `page`: `number`
- `hasNextPage`: `boolean`
- `isFetchingNextPage`: `boolean`
- `fetchNextPage`: `() => Promise<void>`
- `refetch`: `() => Promise<void>`

```tsx
function SearchFeed({ topic }: { topic: string }) {
  const { data, status, fetchNextPage, hasNextPage } = useSearch(topic, { perPage: 15 });

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div>
      {data.map((photo) => (
        <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
      ))}
      {hasNextPage && <button onClick={fetchNextPage}>Load More</button>}
    </div>
  );
}
```

---

### `useCurated(options?: UseCuratedOptions): UseCuratedReturn`
Fetches curated photo feeds selected by Pexels editors.

```tsx
const { data, status, fetchNextPage } = useCurated({ page: 1, perPage: 20 });
```

---

### `useDownload(): UseDownloadReturn`
Provides a download handler for media files.

```tsx
const { download, downloading, error } = useDownload();
```

---

### `useMediaEvents(type: MediaEventType, handler: EventHandler): void`
Subscribes a React component to SDK telemetry events.

```tsx
useMediaEvents('error', (ev) => {
  console.error('Captured SDK Error Event:', ev);
});
```

---

## Headless UI Prop Getter Hooks (`@headless-media/ui-react`)

### `useGrid<T>(options: UseGridOptions<T>): UseGridReturn<T>`
Provides grid item mapping and accessibility props.

```tsx
const { gridItems, getGridProps, getItemProps } = useGrid({
  items: photos,
  columns: 4,
  gap: 16,
  getItemKey: (photo) => photo.id,
  onItemClick: (photo, index) => console.log('Clicked', photo.id, index),
});
```

---

### `useLightbox(options: UseLightboxOptions): UseLightboxReturn`
Manages lightbox modal open/close state, index navigation, keyboard shortcuts (Left/Right/Esc), and DOM focus trapping.

```tsx
const lightbox = useLightbox({
  items: photos.map(p => ({ src: p.src.large, alt: p.alt })),
  loop: true,
});

// Controls:
// lightbox.isOpen (boolean)
// lightbox.currentIndex (number)
// lightbox.open(index)
// lightbox.close()
// lightbox.next()
// lightbox.prev()
```

---

### `useReelSwiper<T>(options: UseReelSwiperOptions<T>): UseReelSwiperReturn<T>`
Provides vertical video reel snap scrolling state management.

```tsx
const swiper = useReelSwiper({
  items: videos,
  onActiveChange: (index, video) => console.log('Active reel:', index, video.id),
});
```
