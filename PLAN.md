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

## Phase 1 — Project Scaffold [COMPLETE]

### 1.1 Repository structure [COMPLETE]

### 1.2 Rslib + Storybook setup [COMPLETE]

### 1.3 Testing setup [COMPLETE]

### 1.4 Linting & Formatting [COMPLETE]

- Replaced placeholder `rslint` with production-ready **ESLint v10** configuration.

---

## Phase 2 — CI & CD [IN PROGRESS]

### 2.1 GitHub Actions workflows [PENDING]

### 2.2 GitHub Pages deployment [PENDING]

### 2.3 PR screenshot automation [PENDING]

---

## Phase 3 — AI Agent Infrastructure [IN PROGRESS]

### 3.1 AGENTS.md [COMPLETE]

### 3.2 AgentSkills [COMPLETE]

### 3.3 llms.txt [PENDING]

### 3.4 MCP Server [PENDING]

---

## Phase 4 — Theme & Design Tokens [COMPLETE]

---

## Phase 5 — Component Implementation [COMPLETE]

See `components-todo-list.md` for the full list. **All core components (Groups 1-10) are now implemented.**

---

## Phase 6 — Audit & Verification [NEW]

### 6.1 Unified Example Page

- Build a "Component Kitchen Sink" page that renders every exported component to verify visual consistency and runtime stability.
- See `example-application-page-plan.md`.

### 6.2 Peer Review

- **Review every single UI component**: Systematic check of API, accessibility, and documentation.
- Tracked in `components-todo-list.md` under "Phase 6".
- For every reviewd component create a new `./reviewed/{component_name}.md` file and include a summary of the review. This document should also include a potential TODO list of improvements to be made to the component as well as a section on its documentation.
- After all reviews are done we should summarize the findings and make a new `reviews/todo.md` list where we go through every proposed improvement.

---

## Open Questions

1. **Documentation site**: Use Storybook as primary site? [YES]
2. **Monorepo tooling**: pnpm workspaces verified.
3. **Icon strategy**: Custom icons migrated to `@spectrum-icons/workflow` or custom components where needed.
4. **Versioning**: Changesets recommended for future automation.
