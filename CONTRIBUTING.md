# Contributing to Geti UI

This guide explains how to develop `@geti-ai/ui` components and validate changes in the documentation site with live reload.

## Prerequisites

- Node.js `>=24.0.0`
- npm `>=11`

Use the versions declared in the root `package.json` `engines` field.

## Repository layout

- `packages/ui` — component library source (`@geti-ai/ui`)
- `documentation` — docs site (Rspress)

## Install

From repository root:

```bash
npm install
```

## Recommended local development workflow

For component work, run this from repo root:

```bash
npm run docs:dev:with-ui
```

This runs `@geti-ai/ui` in watch mode and the docs dev server together.

Then open the local docs URL shown in terminal (typically `http://localhost:3000`).

### Alternative (two terminals)

If you prefer separate terminals, run:

### 1) Build library in watch mode

```bash
npm run build:watch --workspace=@geti-ai/ui
```

### 2) Run docs dev server (live reload)

```bash
npm run docs:dev
```

Then open the local docs URL shown in terminal (typically `http://localhost:3000`).

This setup lets you edit components in `packages/ui/src/**` and verify behavior immediately in docs pages/examples.

## Where to validate UI changes

- Component docs: `/components/...`
- Composed examples: `/examples/...`
- Kitchensinks: `/examples/kitchensink-*`

Docs are the primary verification surface.

## Quality checks before opening a PR

Run from repo root:

```bash
npm run lint
npm run type-check
npm run test
npm run docs:check:coverage
npm run docs:check:sidebar
npm run docs:check:links
npm run docs:build
npm run docs:test:e2e
```

`npm run docs:build` automatically builds `@geti-ai/ui` first via documentation's `prebuild` hook.

## Documentation authoring rules

- Author component docs in `documentation/docs/components/**`.
- Prefer explicit examples using `@geti-ai/ui` components.

## Commit format

Use Conventional Commits, for example:

- `feat(button): add loading icon placement option`
- `fix(tableview): preserve selection on sort`
- `docs(contributing): add docs live reload workflow`
