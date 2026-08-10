# Workspace Directory Map — Headless Media SDK Ecosystem

```
c:\Headless Media SDK\
├── .commitlintrc.json
├── .gitignore
├── .prettierrc
├── package.json                    # Workspace root scripts & devDependencies
├── pnpm-workspace.yaml             # pnpm monorepo package globbing
├── README.md                       # Open-source main documentation
├── turbo.json                      # TurboRepo pipeline configuration
├── tsconfig.json                   # Monorepo root project references
│
├── apps/
│   └── web-app/                    # Vite + React 18 production demo application
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── main.tsx            # Entry point
│           ├── app.tsx             # Root component with MediaProvider wiring
│           ├── components/
│           │   ├── ApiKeyModal.tsx
│           │   ├── EventLogDrawer.tsx
│           │   ├── Header.tsx
│           │   ├── PhotoGrid.tsx
│           │   ├── PhotoLightboxModal.tsx
│           │   ├── SearchBar.tsx
│           │   └── VideoReels.tsx
│           ├── hooks/
│           │   └── use-infinite-scroll.ts
│           ├── styles/
│           │   ├── app.css
│           │   └── index.css
│           └── utils/
│               └── media-adapters.ts
│
├── packages/
│   ├── media-core/                 # Package 1: Framework-agnostic SDK Core
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts            # Public barrel export
│   │   │   ├── api/                # Query builders & normalizers
│   │   │   ├── cache/              # MemoryCache & Deduplicator
│   │   │   ├── client/             # MediaClient facade & HttpClient
│   │   │   ├── errors/             # MediaError hierarchy (6 classes)
│   │   │   ├── events/             # MediaEventEmitter & defaultLogger
│   │   │   ├── retry/              # Exponential backoff retry
│   │   │   ├── types/              # Branded types & Pexels models
│   │   │   └── utils/              # Linked AbortControllers & cache keys
│   │   └── tests/
│   │       ├── cache.test.ts
│   │       ├── errors.test.ts
│   │       └── events.test.ts
│   │
│   ├── media-react/                # Package 2: React Wrapper & Hooks
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── hooks/              # useMedia, useSearch, useCurated, etc.
│   │       ├── provider/           # MediaProvider & MediaContext
│   │       └── types/              # Hook query state types
│   │
│   ├── media-native/               # Package 3: React Native Wrapper (Stub)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/index.ts
│   │
│   ├── media-ui-react/             # Package 4: Headless UI Primitives for Web
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── grid/               # useGrid
│   │   │   ├── lightbox/           # useLightbox & useFocusTrap
│   │   │   ├── reel-swiper/        # useReelSwiper
│   │   │   ├── shared/             # callAll, composeRefs, useStableId
│   │   │   └── types/              # ElementProps & PropGetter types
│   │   └── tests/
│   │       └── ui.test.tsx
│   │
│   ├── media-ui-native/            # Package 5: Headless UI Primitives for Native (Stub)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/index.ts
│   │
│   ├── eslint-config/              # Shared ESLint configurations
│   └── typescript-config/          # Shared TypeScript configurations
│
└── docs/                           # Monorepo architecture & API docs
    ├── API.md
    ├── Architecture.md
    ├── Changelog.md
    ├── Contributing.md
    ├── DecisionLog.md
    ├── FolderStructure.md
    └── skills/                     # AI Agent Skill documents
        ├── media-react-wiring.md
        └── media-ui-react-components.md
```
