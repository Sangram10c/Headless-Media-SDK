# Architectural Decision Log (ADR)

## ADR 001: Monorepo Architecture via TurboRepo and pnpm

- **Status**: Accepted
- **Context**: The project consists of multiple published libraries with strict dependency direction rules.
- **Decision**: Use pnpm workspace protocol (`workspace:*`) for strict dependency graph enforcement and disk space efficiency, orchestrated by TurboRepo for dependency-aware build pipelines and caching.
- **Trade-off**: Requires pnpm installed on developer machines; prevented arbitrary cross-package imports by failing build when forbidden boundaries are crossed.

## ADR 002: Zero-Dependency Core (`@headless-media/core`)

- **Status**: Accepted
- **Context**: The core SDK must run in any JavaScript runtime (Node.js, Web Browser, React Native, Deno, Bun, CLI).
- **Decision**: Avoid React or DOM dependencies in `media-core`. Use standard `fetch` API and native `AbortController`.
- **Trade-off**: Native `fetch` error handling requires manual classification into typed SDK error instances (`APIError`, `NetworkError`, `RateLimitError`).

## ADR 003: Headless Prop-Getters Pattern in `@headless-media/ui-react`

- **Status**: Accepted
- **Context**: UI component libraries usually leak styling choices or force opinionated CSS frameworks on consumers.
- **Decision**: Adopt the prop-getters pattern popularized by Downshift and Radix UI. Hooks (`useGrid`, `useLightbox`, `useReelSwiper`) return getter functions (`getGridProps`, `getItemProps`, `getBackdropProps`) that return plain DOM props and ARIA attributes without CSS.
- **Trade-off**: Consumers must supply their own markup and CSS. In exchange, consumers retain 100% styling freedom.

## ADR 004: Branded Types for Resource Identifiers

- **Status**: Accepted
- **Context**: `PhotoId` and `VideoId` are both numeric IDs from Pexels, making it easy to accidentally pass a `PhotoId` to a `getVideoById()` endpoint.
- **Decision**: Use TypeScript nominal branded types (`type PhotoId = number & { readonly __brand: unique symbol }`) created via validation factory functions (`createPhotoId`, `createVideoId`).
- **Trade-off**: Requires explicit casting or factory calls when instantiating IDs, but completely eliminates ID category mix-ups at compile time.

## ADR 005: Lazy In-Memory Caching over Background Timers

- **Status**: Accepted
- **Context**: Cache TTL eviction can be managed via `setInterval` or lazy evaluation on access.
- **Decision**: Use lazy evaluation on `cache.get()`. Expired items are deleted when requested. Capacity overflows are evicted via FIFO insertion order tracking.
- **Trade-off**: Avoids unref'd timer handles in Node.js event loops that cause process leaks in unit tests or server environments.
