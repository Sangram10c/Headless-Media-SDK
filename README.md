# ⚡️ Headless Media SDK Ecosystem

> A production-grade, npm-publishable Headless Media SDK ecosystem for the Pexels API, built as a TurboRepo / pnpm monorepo.

---

## 📦 Packages

| Package | Version | Description | Target |
|---|---|---|---|
| [`@headless-media/core`](./packages/media-core) | `0.1.0` | Framework-agnostic SDK core (API, Cache, Dedup, Events, Retry, Errors) | Any JS runtime |
| [`@headless-media/react`](./packages/media-react) | `0.1.0` | React wrapper (`MediaProvider` & reactive hooks) | React 18+ |
| [`@headless-media/ui-react`](./packages/media-ui-react) | `0.1.0` | Headless UI primitives (`useGrid`, `useLightbox`, `useReelSwiper`) | React 18+ |
| [`@headless-media/native`](./packages/media-native) | `0.1.0` | React Native SDK wrapper stub | React Native |
| [`@headless-media/ui-native`](./packages/media-ui-native) | `0.1.0` | Headless UI primitives for React Native stub | React Native |
| [`apps/web-app`](./apps/web-app) | `0.1.0` | Production Vite + React demo application | Browser |

---

## 🔒 Strict Architecture & Dependency Boundaries

```text
App (web-app) ───> @headless-media/react ───> @headless-media/core
  │
  └──────────────> @headless-media/ui-react (No SDK imports, No API calls, No CSS)
```

- **`media-core`**: Pure TS. No DOM, no React, no React Native.
- **`media-ui-react`**: Pure Headless. No SDK imports, no API calls, no styles. Behavior & ARIA attributes only.
- **`web-app`**: The ONLY place that wires `media-react` (data) and `media-ui-react` (display) together.

---

## 🚀 Quick Start

### 1. Installation

```bash
pnpm install
```

### 2. Build Monorepo

```bash
pnpm build
```

### 3. Run Unit Tests

```bash
pnpm test
```

### 4. Run Demo App

```bash
pnpm dev
```

---

## 💡 Usage Example

```tsx
import { MediaProvider, createApiKey, useSearch } from '@headless-media/react';
import { useGrid, useLightbox } from '@headless-media/ui-react';

const config = { apiKey: createApiKey('YOUR_PEXELS_API_KEY') };

function App() {
  return (
    <MediaProvider config={config}>
      <Gallery />
    </MediaProvider>
  );
}

function Gallery() {
  const { data: photos } = useSearch('nature');
  const lightbox = useLightbox({ items: photos.map(p => ({ src: p.src.large })) });
  const { gridItems, getGridProps, getItemProps } = useGrid({
    items: photos,
    getItemKey: (p) => p.id,
    onItemClick: (_, idx) => lightbox.open(idx),
  });

  return (
    <div {...getGridProps()}>
      {gridItems.map((gi) => (
        <div {...getItemProps(gi)} key={gi.key}>
          <img src={gi.item.src.medium} alt={gi.item.alt} />
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 Documentation

- [Architecture Specification](./docs/Architecture.md)
- [Public API Reference](./docs/API.md)
- [Folder Structure Map](./docs/FolderStructure.md)
- [Architectural Decision Log (ADRs)](./docs/DecisionLog.md)
- [AI Agent Skill: Data Wiring](./docs/skills/media-react-wiring.md)
- [AI Agent Skill: Headless UI Components](./docs/skills/media-ui-react-components.md)
- [Contributing Guide](./docs/Contributing.md)
- [Changelog](./docs/Changelog.md)
