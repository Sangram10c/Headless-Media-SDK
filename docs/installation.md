# Installation Guide

The **Headless Media SDK** ecosystem is published as a set of lightweight, modular packages on npm. You can install all packages or only the specific packages required for your project.

---

## Monorepo Topology Overview

```
packages/
├── media-core       → Pure TypeScript engine (zero dependencies)
├── media-react      → React Hooks & Provider wrapper
├── media-ui-react   → Headless UI accessibility & layout prop getters (Web)
├── media-native     → React Native Hooks & Provider wrapper
└── media-ui-native  → Headless UI accessibility & layout prop getters (Mobile)
```

---

## Web Applications (React / Next.js / Vite)

To use the SDK in a React web application:

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

### Peer Dependencies
- `react`: `^18.0.0` or `^19.0.0`
- `react-dom`: `^18.0.0` or `^19.0.0`

---

## Mobile Applications (React Native / Expo)

To use the SDK in a React Native or Expo mobile application:

::: code-group
```bash [pnpm]
pnpm add @headless-media/core @headless-media/native @headless-media/ui-native
```

```bash [npm]
npm install @headless-media/core @headless-media/native @headless-media/ui-native
```

```bash [yarn]
yarn add @headless-media/core @headless-media/native @headless-media/ui-native
```
:::

---

## Pure Node.js / Server-Side Execution

If you only need the HTTP client, caching, and retry logic without React UI context (e.g. CLI tools, Node.js backend proxies, or script workers):

::: code-group
```bash [pnpm]
pnpm add @headless-media/core
```

```bash [npm]
npm install @headless-media/core
```
:::

```ts
import { createMediaClient, createApiKey } from '@headless-media/core';

const client = createMediaClient({
  apiKey: createApiKey(process.env.PEXELS_API_KEY!),
});

const result = await client.searchPhotos({ query: 'nature', per_page: 10 });
console.log(`Fetched ${result.data.length} photos.`);
```

---

## TypeScript Setup

The SDK is compiled with `strict: true` and targets `ES2022`. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "strict": true
  }
}
```
