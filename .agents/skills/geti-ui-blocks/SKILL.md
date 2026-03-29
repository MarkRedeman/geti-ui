---
name: geti-ui-blocks
description: Build and document reusable application-level blocks from @geti-ui/blocks with repository conventions and docs-first validation.
---

# Geti UI Blocks Skill

Use this skill when implementing or updating blocks in `packages/blocks`, or when authoring blocks docs in `documentation/docs/blocks/**`.

## Core rules

1. **Composition-first APIs**

    - Blocks are higher-level compositions built from `@geti-ui/ui` primitives.
    - Prefer explicit, typed composition contracts over highly generic abstractions.

2. **Consumer-like imports in docs**

    - Import from `@geti-ui/blocks` and `@geti-ui/ui`, never internal `src/**` paths.

3. **Theming and styles are required**

    - Render examples under `ThemeProvider` from `@geti-ui/ui`.
    - Ensure both stylesheets are present where needed:
        - `@geti-ui/ui/styles.css`
        - `@geti-ui/blocks/styles.css`

4. **Testing and behavior**

    - Test observable behavior with semantic queries.
    - Avoid class/test-id assertions unless no semantic selector is possible.

5. **Validation workflow**
    - Before finalizing changes, run:
        - `npm run build --workspace=@geti-ui/blocks`
        - `npm run test --workspace=@geti-ui/blocks`
        - `npm run docs:build`

## Authoring docs pages

-   Place pages under `documentation/docs/blocks/**`.
-   Keep sidebar entries in `documentation/sidebars.json` aligned with actual docs.
-   Prefer integrated examples that demonstrate realistic block composition.

## Quick checklist

-   [ ] Uses public `@geti-ui/blocks` / `@geti-ui/ui` imports only
-   [ ] Works under docs runtime with `ThemeProvider`
-   [ ] Includes `@geti-ui/blocks/styles.css` when needed
-   [ ] `npm run build --workspace=@geti-ui/blocks` passes
-   [ ] `npm run test --workspace=@geti-ui/blocks` passes
-   [ ] `npm run docs:build` passes
