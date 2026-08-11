---
layout: home

hero:
  name: "Headless Media SDK"
  text: "High-Performance Media Engine for Pexels"
  tagline: "Type-safe, resilient, zero-dependency headless SDK for photo & video integration in React and React Native"
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Architecture
      link: /architecture
    - theme: alt
      text: API Reference
      link: /api

features:
  - icon: ⚡
    title: Headless & UI-Agnostic
    details: Complete separation of core media logic, HTTP cache, and UI state getters. Design your own Pinterest grids or video reels freely.
  - icon: 🛡️
    title: Full Type Safety & Branded Types
    details: Nominal type safety with ApiKey, PhotoId, and VideoId branded types preventing illegal string usage at compile time.
  - icon: 🔄
    title: Built-in Resilience & Deduplication
    details: In-memory LRU caching, in-flight request deduplication, and exponential backoff retry with random jitter.
  - icon: 📡
    title: Real-time Event Streaming
    details: Lightweight event emitter broadcasting search, view, download, cache hit/miss, and rate limit errors across your app.
  - icon: 📱
    title: Cross-Platform (React & React Native)
    details: Shared core TypeScript runtime with specialized wrapper packages for Web (@headless-media/react) and Mobile (@headless-media/native).
---

# Welcome to Headless Media SDK

The **Headless Media SDK** is a modular TypeScript monorepo designed to power modern media platforms using the Pexels API. 

## Key Ecosystem Packages

| Package | Version | Purpose |
| :--- | :--- | :--- |
| [`@headless-media/core`](/packages#media-core) | `0.1.0` | Core TypeScript HTTP client, LRU cache, deduplicator, event emitter, & retry logic. |
| [`@headless-media/react`](/packages#media-react) | `0.1.0` | React context provider, search hooks, curated feed hooks, and event subscribers. |
| [`@headless-media/ui-react`](/packages#media-ui-react) | `0.1.0` | Headless UI prop getters (`useGrid`, `useLightbox`, `useReelSwiper`, `useFocusTrap`). |
| [`@headless-media/native`](/packages#media-native) | `0.1.0` | React Native provider and custom hooks for mobile apps. |
| [`@headless-media/ui-native`](/packages#media-ui-native) | `0.1.0` | Headless UI prop getters for React Native (`View`, `Pressable`, `FlatList`). |

## Quick Installation

::: code-group
```bash [pnpm]
pnpm add @headless-media/core @headless-media/react @headless-media/ui-react
```

```bash [npm]
npm install @headless-media/core @headless-media/react @headless-media/ui-react
```

```bash [yarn]
yarn add @headless-media/core @headless-media/react @headless-media/ui-react
```
:::

## Basic Usage Example

```tsx
import { MediaProvider, useSearch } from '@headless-media/react';
import { createApiKey } from '@headless-media/core';

const sdkConfig = {
  apiKey: createApiKey(import.meta.env.VITE_PEXELS_API_KEY),
  cache: { ttl: 300000, maxEntries: 100 },
};

export function App() {
  return (
    <MediaProvider config={sdkConfig}>
      <PhotoFeed />
    </MediaProvider>
  );
}

function PhotoFeed() {
  const { data, status, fetchNextPage } = useSearch('nature');

  if (status === 'loading') return <div>Loading photos...</div>;

  return (
    <div className="grid">
      {data.map((photo) => (
        <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
      ))}
      <button onClick={fetchNextPage}>Load More</button>
    </div>
  );
}
```
