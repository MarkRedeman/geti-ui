---
name: geti-ui
description: Build and document components in the @geti-ai/ui design system with repository conventions, theming requirements, and docs-first validation workflow.
---

# Geti UI Skill

Use this skill when implementing or updating components, docs pages, examples, or assets in this repository.

## Core rules

1. **Docs-first validation**
   - Primary validation surface is the docs site (`documentation/`), not Storybook.
   - Run `pnpm docs:dev:with-ui` for local development.

2. **Consumer-like imports in docs**
   - Import from `@geti-ai/ui` and subpaths (e.g. `@geti-ai/ui/icons`), not internal source file paths.

3. **Theming requirements**
   - Ensure examples/pages render under `ThemeProvider`.
   - Ensure stylesheet import is present where needed: `@geti-ai/ui/styles.css`.

4. **Component conventions**
   - Keep wrappers thin and pass through upstream props via `...rest`.
   - Prefer `type` for component props.
   - No `any`.

5. **Testing and quality checks**
   - Use semantic queries in tests.
   - Before finalizing changes, run:
     - `pnpm --filter @geti-ai/ui build`
     - `pnpm docs:build`

## Authoring docs pages

- Place component docs in `documentation/docs/components/**`.
- Do not import Storybook stories into docs pages.
- When using form controls in docs examples, use controls from `@geti-ai/ui`.

## Assets and icons

- Icons: `@geti-ai/ui/icons`
- Assets: `@geti-ai/ui/assets/*`
- Keep exports tree-shakeable (named exports, no giant default objects).

## Quick checklist

- [ ] Uses `@geti-ai/ui` public imports
- [ ] Works under docs runtime with `ThemeProvider`
- [ ] `pnpm --filter @geti-ai/ui build` passes
- [ ] `pnpm docs:build` passes
- [ ] No docs-to-stories imports introduced
