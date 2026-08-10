# Architecture Specification — Headless Media SDK

## Executive Summary

The Headless Media SDK ecosystem is designed as an open-source, multi-package monorepo managed with **TurboRepo** and **pnpm**. It provides a framework-agnostic core (`@headless-media/core`), React bindings (`@headless-media/react`), React Native bindings (`@headless-media/native`), and headless UI primitive component libraries (`@headless-media/ui-react`, `@headless-media/ui-native`).

---

## Dependency Topology & Boundaries

```mermaid
graph TD
    App["apps/web-app"] --> MR["@headless-media/react"]
    App --> UIR["@headless-media/ui-react"]
    MR --> MC["@headless-media/core"]
    MN["@headless-media/native"] --> MC
    UIN["@headless-media/ui-native"] -.-> |"same contract"| UIR

    style MC fill:#1a1a2e,stroke:#e94560,color:#fff
    style MR fill:#1a1a2e,stroke:#0f3460,color:#fff
    style UIR fill:#1a1a2e,stroke:#16213e,color:#fff
    style App fill:#0f3460,stroke:#e94560,color:#fff
    style MN fill:#1a1a2e,stroke:#0f3460,color:#fff
    style UIN fill:#1a1a2e,stroke:#16213e,color:#fff
```

### Strict Architectural Boundaries

- **`@headless-media/core`**: 100% Pure TypeScript. NO DOM, NO React, NO React Native imports.
- **`@headless-media/ui-react`**: Pure Headless UI. NO API calls, NO SDK imports (`@headless-media/core`), NO CSS/Tailwind. Behavior & accessibility only.
- **`apps/web-app`**: The application is the ONLY place that imports both `@headless-media/react` (for data/events) and `@headless-media/ui-react` (for presentation) and composes them together.

---

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant App as Web App
    participant UIR as @headless-media/ui-react
    participant MR as @headless-media/react
    participant MC as @headless-media/core
    participant API as Pexels API

    App->>MR: useSearch("nature")
    MR->>MC: client.searchPhotos({ query: "nature" })
    MC->>MC: Check MemoryCache (TTL)
    alt Cache Hit
        MC-->>MR: Return cached PaginatedResponse
        MC-->>MC: Emit "cache-hit" event
    else Cache Miss
        MC-->>MC: Check Deduplicator (in-flight)
        alt In-flight request exists
            MC-->>MR: Attach to existing Promise
        else Make Request
            MC->>API: GET /v1/search?query=nature
            API-->>MC: Pexels JSON
            MC->>MC: Normalize & store in MemoryCache
            MC-->>MC: Emit "cache-miss" event
            MC-->>MR: Return normalized response
        end
    end
    MR-->>App: { data, status: "success", fetchNextPage }
    App->>UIR: useGrid({ items: data })
    UIR-->>App: { gridItems, getGridProps, getItemProps }
```

---

## Core Design Patterns

1. **Observer Pattern**: `MediaEventEmitter` allows subscribers to listen to SDK activity (`search`, `view`, `download`, `cache-hit`, `cache-miss`, `error`).
2. **Prop-Getters Pattern**: Headless UI packages expose functions (`getGridProps`, `getItemProps`, `getBackdropProps`) that return merged DOM props and ARIA attributes without imposing visual styles.
3. **Linked AbortController**: Per-request cancellation linked to global SDK cleanup signal for memory-leak prevention.
4. **Branded Types**: Nominal type system (`ApiKey`, `PhotoId`, `VideoId`) preventing structural interchange errors.
