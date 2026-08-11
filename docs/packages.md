# Packages Overview

The **Headless Media SDK** monorepo consists of 5 specialized packages and 1 reference demo application.

---

## 1. `@headless-media/core`

The foundational, framework-agnostic TypeScript core engine.

- **Primary Entrypoint**: `packages/media-core/src/index.ts`
- **Key Modules**:
  - `MediaClient`: The main API client orchestrating HTTP requests, cache, deduplication, retry, and event dispatching.
  - `MemoryCache`: An in-memory LRU cache storing HTTP responses with configurable TTL and entry limits.
  - `Deduplicator`: Concurrent request deduplicator preventing duplicate in-flight requests.
  - `withRetry`: Exponential backoff with full randomized jitter for 429 rate limit / network error recovery.
  - `MediaEventEmitter`: Structured pub/sub event bus emitting SDK runtime telemetry.
  - Branded Types: `ApiKey`, `PhotoId`, `VideoId`.

---

## 2. `@headless-media/react`

React context provider and state management hooks for Web applications.

- **Primary Entrypoint**: `packages/media-react/src/index.ts`
- **Key Exports**:
  - `<MediaProvider>`: React Context provider initializing `MediaClient`.
  - `useMedia()`: Access active `MediaClient` instance from React context.
  - `useSearch(query, options)`: Execute paginated photo searches with state management.
  - `useCurated(options)`: Fetch curated Pexels photo feeds.
  - `useDownload()`: Download media files safely.
  - `useMediaEvents(type, handler)`: Subscribe to real-time SDK telemetry events inside React components.

---

## 3. `@headless-media/ui-react`

Headless accessibility and layout prop getters for React Web UI components.

- **Primary Entrypoint**: `packages/media-ui-react/src/index.ts`
- **Key Hooks**:
  - `useGrid(options)`: Generate keyboard-navigable grid layouts.
  - `useLightbox(options)`: Fullscreen modal lightbox state with focus trap and keyboard shortcuts.
  - `useReelSwiper(options)`: Vertical video reel gesture swiper.
  - `useFocusTrap(ref, active)`: Accessible DOM focus trap helper.

---

## 4. `@headless-media/native`

React Native implementation matching the exact hook & provider contracts as `@headless-media/react`.

- **Primary Entrypoint**: `packages/media-native/src/index.ts`
- **Key Components**:
  - `<MediaProvider>`: Native context provider.
  - `useMedia()`, `useSearch()`, `useCurated()`, `useMediaEvents()` for React Native.

---

## 5. `@headless-media/ui-native`

Headless UI prop getters tailored for React Native primitives (`View`, `Text`, `Image`, `Pressable`, `FlatList`).

- **Primary Entrypoint**: `packages/media-ui-native/src/index.ts`
- **Key Hooks**:
  - `useGrid(options)`: Produces `numColumns` and `onPress` props for `FlatList` / `Pressable`.
  - `useLightbox(options)`: Returns backdrop, content, and close pressable getters for React Native modals.
  - `useReelSwiper(options)`: `FlatList` props (`pagingEnabled`, `scrollTo`) for vertical video feeds.

---

## 6. `apps/web-app` (Reference App)

The Pinterest-inspired showcase web application demonstrating real-world SDK integration, Masonry photo grid, Video Reels vertical swiper, Favorites storage, live event log drawer, and API key rotation.
