# Contributing to Geti UI

This guide explains how to develop `@geti/ui` components and validate changes in the documentation site with live reload.

## Prerequisites

- Node.js `>=20.19.0`
- pnpm `>=9`

Use the versions declared in the root `package.json` `engines` field.

## Repository layout

- `packages/ui` — component library source (`@geti/ui`)
- `documentation` — docs site (Rspress)

## Install

From repository root:

```bash
pnpm install
```

## Recommended local development workflow

For component work, run this from repo root:

```bash
pnpm docs:dev:with-ui
```

This runs `@geti/ui` in watch mode and the docs dev server together.

Then open the local docs URL shown in terminal (typically `http://localhost:3000`).

### Alternative (two terminals)

If you prefer separate terminals, run:

### 1) Build library in watch mode

```bash
pnpm --filter @geti/ui build:watch
```

### 2) Run docs dev server (live reload)

```bash
pnpm docs:dev
```

Then open the local docs URL shown in terminal (typically `http://localhost:3000`).

This setup lets you edit components in `packages/ui/src/**` and verify behavior immediately in docs pages/examples.

## Where to validate UI changes

- Component docs: `/components/...`
- Composed examples: `/examples/...`
- Kitchensinks: `/examples/kitchensink-*`

Docs are the primary verification surface. Storybook can still be used as an optional sandbox.

## Quality checks before opening a PR

Run from repo root:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm docs:check:no-stories-imports
pnpm docs:check:coverage
pnpm docs:build
pnpm docs:test:e2e
```

`pnpm docs:build` automatically builds `@geti/ui` first via documentation's `prebuild` hook.

## Documentation authoring rules

- Author component docs in `documentation/docs/components/**`.
- Do **not** import `*.stories.tsx` inside `documentation/**`.
- Prefer explicit examples using `@geti/ui` components.

## Commit format

Use Conventional Commits, for example:

- `feat(button): add loading icon placement option`
- `fix(tableview): preserve selection on sort`
- `docs(contributing): add docs live reload workflow`
