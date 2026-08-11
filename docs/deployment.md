# Deployment Guide & Host Setup

This guide explains how to build and deploy the **Headless Media SDK** showcase app, the **VitePress Documentation Site**, and the **Storybook Component Explorer** to production hosting platforms like Vercel.

---

## 1. Web Application Deployment (Vercel)

The reference web application is configured with `apps/web-app/vercel.json` and `vercel.json` at the root.

### Vercel Project Settings

- **Framework Preset**: Vite
- **Root Directory**: `apps/web-app` (or leave blank if using monorepo root)
- **Build Command**: `pnpm --filter @headless-media/web-app build`
- **Output Directory**: `dist` (or `apps/web-app/dist`)
- **Install Command**: `pnpm install`

### Environment Variables

Add the following environment variable in the Vercel Dashboard:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

---

## 2. VitePress Documentation Site Deployment

To deploy the VitePress documentation site to Vercel or Cloudflare Pages:

### Vercel Settings for VitePress

- **Build Command**: `pnpm docs:build`
- **Output Directory**: `docs/.vitepress/dist`

### Local Documentation Server

::: code-group
```bash [Development Server]
pnpm docs:dev
```

```bash [Production Build]
pnpm docs:build
```

```bash [Preview Local Production Build]
pnpm docs:preview
```
:::

---

## 3. Storybook Deployment

To build and host the Storybook UI component library:

### Storybook Commands

::: code-group
```bash [Development Server]
pnpm storybook
```

```bash [Static Bundle Build]
pnpm build-storybook
```
:::

- **Output Directory**: `storybook-static`
- **Hosting**: Can be deployed directly to Chromatic, GitHub Pages, or Vercel static output.

---

## 4. Summary of Package Scripts

| Script | Action |
| :--- | :--- |
| `pnpm dev` | Run web application local Vite dev server. |
| `pnpm build` | Compile all monorepo packages and apps via Turborepo. |
| `pnpm type-check` | Execute TypeScript type verification across all 5 SDK packages. |
| `pnpm docs:dev` | Start VitePress live documentation dev server. |
| `pnpm docs:build` | Build static production HTML bundle for VitePress documentation site. |
| `pnpm storybook` | Launch local Storybook component development environment on port 6006. |
| `pnpm build-storybook` | Generate static production build of Storybook stories (`storybook-static`). |
