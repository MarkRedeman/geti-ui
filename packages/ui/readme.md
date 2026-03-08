# packages/ui/

## Responsibility

`packages/ui/` is the `@geti/ui` library package — the single publishable artifact of the monorepo. It contains the React + TypeScript component library, its Storybook configuration, Playwright e2e tests, and all build tooling configuration.

Responsibilities:
- **Library source** (`src/`) — all components, the theme system, utilities, and the public `index.ts` barrel export.
- **Build** — `rslib` (Rspack-based library bundler) produces dual ESM + CJS outputs plus TypeScript declaration files under `dist/`.
- **Storybook** (`.storybook/`) — interactive component catalogue and development environment, served on port 6006.
- **Unit tests** — `rstest` (Vitest-compatible, Rspack-powered) runs `*.test.tsx` files co-located with components.
- **E2E tests** (`e2e/`) — Playwright tests run against the live Storybook instance.
- **Linting** (`rslint.jsonc`) — package-local lint configuration for TypeScript/React source files.

## Design

- **Package name**: `@geti/ui` — consumers import from this single entry point.
- **Dual-format output**: rslib emits both ESM (`dist/esm/`) and CJS (`dist/cjs/`) with `bundle: false` (file-per-module, tree-shakeable). Type declarations go to `dist/types/`.
- **Peer dependencies**: `react` and `react-dom` ≥18 are peers; the library does not bundle them.
- **Runtime dependencies**: `@adobe/react-spectrum`, `react-aria-components`, `@spectrum-icons/workflow`, `clsx`, and a few `@react-aria`/`@react-stately` internals. These are bundled into the output.
- **Storybook stack**: `storybook-react-rsbuild` + `storybook-addon-rslib` — uses Rsbuild/Rspack instead of Webpack for fast Storybook builds consistent with the library build.
- **Test stack**: `@rstest/core` with `jsdom` environment, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.

## Flow

**Development:**
```
npm run storybook      → starts Storybook dev server (Rsbuild, port 6006)
npm run test:watch     → rstest in watch mode, re-runs on file save
```

**Build:**
```
src/index.ts
  → rslib (Rspack + pluginReact)
  → dist/esm/   (ESM, file-per-module)
  → dist/cjs/   (CJS, file-per-module)
  → dist/types/ (TypeScript declarations)
```

**Test:**
```
*.test.tsx  → rstest (jsdom) → @testing-library assertions
e2e/*.spec.ts → Playwright → running Storybook instance
```

## Integration

- **Consumers** add `@geti/ui` as a dependency and import components from `'@geti/ui'`. They must wrap their app in `<ThemeProvider>`.
- **Repo root scripts** delegate to this package via npm workspace scripts.
- **Storybook** imports directly from `src/` (not `dist/`) via the rslib Storybook integration — no build step needed during development.
- **CI** runs `npm run build`, `npm run test`, `npm run type-check`, and `npm run lint` against this package before publishing.
