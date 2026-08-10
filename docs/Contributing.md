# Contributing Guide

Thank you for contributing to the Headless Media SDK ecosystem!

## Development Setup

1. **Prerequisites**: Node.js >= 18.0.0, pnpm >= 9.0.0
2. **Clone & Install**:
   ```bash
   pnpm install
   ```
3. **Build All Packages**:
   ```bash
   pnpm build
   ```
4. **Run Unit Tests**:
   ```bash
   pnpm test
   ```
5. **Run Demo Web App**:
   ```bash
   pnpm dev
   ```

## Commit Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org/) via Commitlint and Husky.
Commit messages must follow the format:

```text
<type>(<scope>): <short summary>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Example: `feat(media-core): add in-flight request deduplication`

## Package Boundary Rules

- Never import React in `@headless-media/core`.
- Never import `@headless-media/core` inside `@headless-media/ui-react`.
- Never import UI components inside `@headless-media/react`.
