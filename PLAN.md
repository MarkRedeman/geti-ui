# Geti UI Design System — Implementation Plan

This document is the master plan for building the Geti UI design system from the ground up. It is intentionally long-horizon: correctness and quality take priority over speed.

---

## Overview

We are building a **React + TypeScript component library** for Intel Geti products. The library:

- Is based on **Adobe React Spectrum** (v3/S2) and will progressively migrate to **react-aria-components + Tailwind CSS**
- Follows a dark-mode-first visual theme matching https://docs.geti.intel.com/
- Is built with the **Rstack** toolchain (rslib, rstest, rsbuild)
- Ships first-party Storybook integration
- Provides AI-native tooling: AgentSkills, MCP, and llms.txt

Reference material lives in `reference-packages/` (cloned from the existing `@geti/ui` package). These are for inspiration and API reference only — we build from scratch.

---

## Phase 1 — Project Scaffold

### 1.1 Repository structure

```
geti-ui/
├── packages/
│   └── ui/                    # Main component library (rslib)
│       ├── src/
│       │   └── components/
│       ├── .storybook/
│       ├── package.json
│       ├── rslib.config.ts
│       └── tsconfig.json
├── reference-packages/        # Read-only reference (do not modify)
│   ├── ui/
│   └── config/
├── .github/
│   └── workflows/
├── renovate.json
├── AGENTS.md
├── PLAN.md
└── components-todo-list.md
```

### 1.2 Rslib + Storybook setup

**Toolchain rationale:** We use **rslib** (not rsbuild) for the component library because rslib is the build tool purpose-built for library output formats (ESM + CJS dual output, declaration files, tree-shaking). Storybook is wired directly to the rslib project using `storybook-react-rsbuild`.

Steps:

1. **Init rslib project** inside `packages/ui/`
   - Follow https://rslib.rs/guide/solution/react
   - Output: ESM + CJS, TypeScript declarations
   - Peer deps: `react`, `react-dom`, `@adobe/react-spectrum`, `react-aria-components`

2. **Add Storybook**
   - Follow https://storybook.rsbuild.rs/guide/integrations/rslib
   - Framework: `storybook-react-rsbuild`
   - Stories co-located with components: `src/components/**/*.stories.tsx`
   - Configure Storybook dark theme to match Geti visual identity

3. **TypeScript config**
   - Strict mode
   - No path aliases — use relative imports throughout
   - Separate `tsconfig.json` (source), `tsconfig.build.json` (build)

4. **Linting & formatting**
   - **Rslint** (`@rslint/core`) — the Rstack-native TypeScript-first linter built on typescript-go
     - Config: `rslint.jsonc` at package root, pointing at `tsconfig.json`
     - Enables `@typescript-eslint` rules by default (typed linting out of the box)
     - Reference: https://rslint.rs/guide/
   - **Prettier** for formatting (`.prettierrc.json`, `.prettierignore`)
   - Rslint handles correctness; Prettier handles style — they do not overlap

### 1.3 Testing setup

**Unit & integration tests — rstest + Testing Library**

- Install `rstest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- Configure `rstest.config.ts` with jsdom environment
- Test files co-located: `src/components/**/*.test.tsx`
- Reference: https://rstest.rs/guide/start/quick-start

**End-to-end tests — Playwright**

- Install `@playwright/test`
- Config: `playwright.config.ts` at `packages/ui/` root
- Tests in `e2e/` directory
- Enable visual comparison snapshots (`expect(page).toHaveScreenshot()`)
- Enable accessibility testing (`@axe-core/playwright` via `checkA11y`)
- Storybook must be running for Playwright tests (use `webServer` config option)
- Reference: https://playwright.dev/docs/test-snapshots, https://playwright.dev/docs/accessibility-testing

---

## Phase 2 — CI & CD

### 2.1 GitHub Actions workflows

#### `ci.yml` — Pull Request checks

Triggered on: `pull_request` to `main`

Steps:

1. Install dependencies
2. Type-check (`tsc --noEmit`)
3. Lint (`rslint`) and format check (`prettier --check`)
4. Unit tests (`rstest run`)
5. Build library (`rslib build`)
6. Build Storybook (`storybook build`)
7. **Affected component detection** — diff against base branch, identify changed component directories
8. Start Storybook preview server
9. Run Playwright tests for affected components (visual snapshots + a11y)
10. Post screenshot diff comment to PR via GitHub API

#### `deploy-preview.yml` — Storybook PR preview

Triggered on: `pull_request`

- Build Storybook
- Deploy to GitHub Pages preview URL (using `peaceiris/actions-gh-pages` or GitHub's built-in Pages deployment with unique PR path)

#### `deploy-main.yml` — Production Storybook

Triggered on: `push` to `main`

- Build Storybook
- Deploy to GitHub Pages main URL

#### `renovate.yml` / `renovate.json` — Dependency updates

- RenovateBot configuration
- Group updates by category (react-spectrum, testing, build tools)
- Auto-merge patch/minor for dev dependencies
- Require review for major updates and peer dependency changes
- Reference: https://docs.renovatebot.com/

### 2.2 GitHub Pages deployment

- Use `gh-pages` branch for production
- PR previews deployed to `gh-pages/pr-{number}/` paths
- Main branch replaces root

### 2.3 PR screenshot automation

When a PR is opened/updated:

1. Detect which component stories changed (via `git diff --name-only`)
2. For each changed component, use Playwright to screenshot all story variants
3. Compare against baseline snapshots (stored in repo or artifacts)
4. Post a GitHub comment with before/after screenshots as a visual diff report

---

## Phase 3 — AI Agent Infrastructure

### 3.1 AGENTS.md

Starting file providing:

- Repository overview for AI agents
- Component patterns and conventions
- Where to find things
- Coding guidelines

See `AGENTS.md` in this repository.

### 3.2 AgentSkills

- Host skill definitions under `.agents/skills/`
- Start with a `geti-ui` skill describing component patterns
- Reference: https://github.com/rstackjs/agent-skills

### 3.3 llms.txt

- Create `llms.txt` at repository root per https://llmstxt.org/ spec
- Summarize the library, component list, usage patterns
- Link to Storybook for examples
- Reference Adobe Spectrum's implementation: https://react-spectrum.adobe.com/ai

### 3.4 MCP Server

- Investigate and implement an MCP server exposing component metadata
- Reference: https://react-spectrum.adobe.com/ai (Adobe's approach), https://modelcontextprotocol.io/docs/getting-started/intro
- The server should expose: component list, prop types, usage examples, Storybook URLs

**TODO list for AI infrastructure** (tracked separately in `AGENTS.md`):

- [ ] Define `llms.txt` structure and write initial version
- [ ] Implement MCP server (read-only: component metadata, stories, docs)
- [ ] Write `geti-ui` AgentSkill
- [ ] Add Playwright MCP integration for visual testing by AI agents
- [ ] Document AI conventions in `AGENTS.md`

---

## Phase 4 — Theme & Design Tokens

Before building components, establish the visual foundation:

1. **Design tokens** — Define CSS custom properties matching the Geti dark theme
   - Colors (background, foreground, accent, error, warning, success, info)
   - Typography (font families, sizes, weights, line heights)
   - Spacing scale
   - Border radii
   - Shadows / elevation
   - Animation durations

2. **Theme integration**
   - For Phase 1 (React Spectrum): Provide a `ThemeProvider` wrapping `@adobe/react-spectrum`'s `Provider` with the Geti CSS theme (dark-mode-first)
   - For Phase 2 (react-aria-components): Provide Tailwind CSS theme extension (`tailwind.config.ts`)

3. **Storybook theme decorator** — apply `ThemeProvider` globally in `.storybook/preview.tsx`

Reference implementation in `reference-packages/ui/theme/geti/` for the CSS variable structure.

---

## Phase 5 — Component Implementation

See `components-todo-list.md` for the full prioritized list.

**General approach for each component:**

1. Check if React Spectrum S2 already provides the component → use it as a thin wrapper
2. If custom behavior needed → extend with `UNSAFE_className` / CSS override pattern (Phase 1) or build as react-aria-component with Tailwind (Phase 2)
3. Write TypeScript-first API:
   - Props extend from Spectrum/aria base types
   - Re-export relevant upstream types
   - No `any`, strict prop typing
4. Write stories (`.stories.tsx`) covering: default, all variants, interactive states, edge cases
5. Write unit tests (`.test.tsx`) covering: rendering, interactions, accessibility
6. Document with JSDoc on the component and each non-obvious prop

**Migration path: React Spectrum v3 → S2 → react-aria-components**

- Phase 1: Wrap `@adobe/react-spectrum` (v3) — matches existing `reference-packages/ui` pattern
- Phase 2: Migrate to `@react-spectrum/s2` as S2 gains component coverage
- Phase 3: Where full control is needed, re-implement as `react-aria-components` + Tailwind CSS

---

## Open Questions

1. **Documentation site**: Use Storybook as primary site, or add rspress/Docusaurus? The Geti main website already uses Docusaurus. Storybook alone is sufficient for the initial phase.

2. **Monorepo tooling**: Use pnpm workspaces for `packages/ui` + future packages (e.g., icons, tokens)?

3. **Icon strategy**: The reference package ships 130+ custom SVG icons in `icons/`. These should become a separate `@geti/icons` package with tree-shakeable ESM exports.

4. **Versioning**: Decide on semantic versioning strategy and release automation (changesets? semantic-release?).
