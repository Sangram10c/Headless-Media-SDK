# Changelog

All notable changes to the **Headless Media SDK** monorepo are documented in this file.

---

## [0.1.0] - 2026-08-11

### Added
- **Monorepo Topology**: Initial release of `@headless-media/core`, `@headless-media/react`, `@headless-media/ui-react`, `@headless-media/native`, and `@headless-media/ui-native`.
- **Core Engine (`@headless-media/core`)**:
  - `MediaClient` orchestrating Pexels REST endpoints (`searchPhotos`, `getCuratedPhotos`, `searchVideos`, `getPopularVideos`).
  - Branded Types (`ApiKey`, `PhotoId`, `VideoId`) for nominal type safety.
  - LRU `MemoryCache` with configurable TTL and entry limits.
  - `Deduplicator` preventing duplicate in-flight network requests.
  - `withRetry` implementing exponential backoff with full randomized jitter.
  - `MediaEventEmitter` pub/sub event bus emitting structured telemetry (`search`, `view`, `download`, `cache-hit`, `cache-miss`, `error`).
- **React Bindings (`@headless-media/react`)**:
  - `<MediaProvider>` context container.
  - Custom data hooks: `useMedia()`, `useSearch()`, `useCurated()`, `useDownload()`, `useMediaEvents()`.
- **Headless UI Primitives (`@headless-media/ui-react`)**:
  - `useGrid()`: Keyboard-navigable grid layout prop getters.
  - `useLightbox()`: Accessible modal lightbox state with focus trap.
  - `useReelSwiper()`: Vertical video reel gesture swiper.
- **Showcase Demo App (`apps/web-app`)**:
  - Pinterest-inspired responsive Web Application.
  - Live Pexels API key verification and error handling.
  - Fullscreen Lightbox, Favorites persistence, and SDK event log drawer.
  - Fully responsive layout across 320px to 1920px+ breakpoints.
