# Geti UI Design System

`geti-ui` is the monorepo for Intel Geti frontend libraries and documentation.

It contains multiple React + TypeScript packages built primarily on Adobe React Spectrum and react-aria-components, with a dark-mode-first Geti theme.

## Monorepo layout

-   `packages/ui` — core component library (`@geti-ai/ui`)
-   `packages/blocks` — composable application-level blocks (`@geti-ai/blocks`)
-   `packages/charts` — chart primitives/compositions (`@geti-ai/charts`)
-   `packages/smart-tools` — browser CV annotation tools (`@geti-ai/smart-tools`)
-   `packages/mcp` — MCP server exposing docs tools for agents (`@geti-ai/mcp`)
-   `documentation` — Rspress docs site (primary validation surface)
-   `.github/workflows` — CI/CD and deployment workflows
-   `.agents/skills` — AI agent skills and references
-   `reference-packages` — read-only upstream snapshots used as implementation reference

## Key capabilities

-   80+ accessible UI components across form, data, feedback, overlays, navigation, and layout categories
-   Reusable app-level building blocks for logs, media, tabs, and project/model surfaces
-   Charting and smart-tool packages for ML/data workflows
-   Geti theming via `ThemeProvider` + `@geti-ai/ui/styles.css`
-   Tree-shakeable icons and assets via:
    -   `@geti-ai/ui/icons`
    -   `@geti-ai/ui/assets/images`
    -   `@geti-ai/ui/assets/domains`
    -   `@geti-ai/ui/assets/primary-tools`
-   AI integration via docs-generated skills endpoint and MCP server

## Requirements

-   Node.js `>=24.0.0`
-   npm `>=11`

## Quick start (repository)

```bash
npm install
npm run docs:dev:with-ui
```

This runs `@geti-ai/ui` in watch mode and the docs site together for fast local iteration.

## Useful scripts

From repository root:

```bash
npm run build
npm run lint
npm run type-check
npm run test

npm run docs:build
npm run docs:check:coverage
npm run docs:check:sidebar
npm run docs:check:links
npm run docs:test:e2e
```

## Conventions

-   Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`, etc.)
-   `@geti-ai/ui` components should be thin wrappers with strong prop pass-through behavior
-   `@geti-ai/blocks` components should prefer composition and application-oriented APIs
-   Form controls used in docs examples should come from `@geti-ai/ui`

## Further documentation

-   Contributor guide: `CONTRIBUTING.md`
-   Agent guidance: `AGENTS.md`
-   Docs site entry: `documentation/docs/index.mdx`

## License

Internal Intel project.
