# Geti UI Design System

`geti-ui` is the repository for the `@geti/ui` component design system used by Intel Geti products.

It is a React + TypeScript library built primarily on Adobe React Spectrum and react-aria-components, with a dark-mode-first Geti theme.

## Monorepo layout

- `packages/ui` — main publishable package (`@geti/ui`)
- `documentation` — Rspress docs site (primary validation surface)
- `.github/workflows` — CI/CD and deployment workflows
- `.agents/skills` — AI agent skills and references
- `reference-packages` — read-only upstream snapshots used as implementation reference

## Key capabilities

- 80+ accessible UI components across form, data, feedback, overlays, navigation, and layout categories
- Geti theming via `ThemeProvider` + `@geti/ui/styles.css`
- Tree-shakeable icons and assets via:
  - `@geti/ui/icons`
  - `@geti/ui/assets/images`
  - `@geti/ui/assets/domains`
  - `@geti/ui/assets/primary-tools`

## Requirements

- Node.js `>=24.0.0`
- pnpm `>=9`

## Quick start (repository)

```bash
pnpm install
pnpm docs:dev:with-ui
```

This runs `@geti/ui` in watch mode and the docs site together for fast local iteration.

## Useful scripts

From repository root:

```bash
pnpm build
pnpm lint
pnpm type-check
pnpm test

pnpm docs:build
pnpm docs:check:coverage
pnpm docs:check:no-stories-imports
pnpm docs:test:e2e
```

## Conventions

- Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`, etc.)
- Components should be thin wrappers with strong prop pass-through behavior
- Form controls used in docs examples should come from `@geti/ui`

## Further documentation

- Contributor guide: `CONTRIBUTING.md`
- Agent guidance: `AGENTS.md`
- Docs site entry: `documentation/docs/index.mdx`

## License

Internal Intel project.
