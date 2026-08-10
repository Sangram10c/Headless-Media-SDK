# Changelog

All notable changes to the Headless Media SDK project will be documented in this file.

## [0.1.0] - 2026-08-10

### Initial Release

#### `@headless-media/core`
- Framework-agnostic Pexels API SDK client (`createMediaClient`).
- Support for `searchPhotos`, `getCurated`, `getPhotoById`, `searchVideos`, `getPopularVideos`, `getVideoById`, `download`.
- Nominal branded types (`ApiKey`, `PhotoId`, `VideoId`).
- `MemoryCache` with configurable TTL and FIFO eviction.
- `Deduplicator` for in-flight request deduplication.
- Observer pattern event emitter (`subscribe`, `unsubscribe`, `emit`).
- Exponential backoff retry with random jitter.
- Hierarchical linked `AbortController` cancellation.
- Centralized error hierarchy (`APIError`, `NetworkError`, `ValidationError`, `AuthenticationError`, `RateLimitError`, `CacheError`).

#### `@headless-media/react`
- `MediaProvider` & `MediaContext` wrapper.
- Hooks: `useMedia`, `useSearch`, `useCurated`, `useDownload`, `useMediaEvents`.
- State machines for loading/error state management.

#### `@headless-media/ui-react`
- Headless components following prop-getters pattern (`useGrid`, `useLightbox`, `useReelSwiper`).
- Focus trap utility for modal accessibility.
- Zero-CSS headless design contract.

#### `@headless-media/native` & `@headless-media/ui-native`
- Contract-complete React Native package stubs.

#### `apps/web-app`
- Production Vite + React demo application composing all monorepo packages.
- Dark mode glassmorphism design system.
- Live SDK Event Stream viewer.
