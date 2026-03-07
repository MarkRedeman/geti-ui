# geti-ui/

## Responsibility

Root of the `geti-ui` monorepo. Owns the workspace configuration, shared tooling, and houses the single publishable package (`packages/ui`). It is **not** itself published — it is the development harness.

Key responsibilities:
- **Monorepo management** — `pnpm-workspace.yaml` declares `packages/*` as workspaces; all top-level `pnpm` scripts delegate to `@geti/ui` via `--filter`.
- **Code quality gates** — ESLint config (`eslint.config.js`), Prettier config (`.prettierrc.json`), and Commitlint (`commitlint.config.js`) run at the workspace root and enforce standards across all packages.
- **Git hooks** — Husky (`.husky/`) installs pre-commit and commit-msg hooks.
- **Release management** — Changesets (`.changeset/`) tracks version bumps and changelogs; `cliff.toml` configures git-cliff for automated changelog generation.
- **Reference material** — `plans/` contains implementation plans, backlog, and reviewed component specs; `docs/` holds operational documentation (e.g. package versioning, security).
- **Agent tooling** — `.agents/skills/` contains AgentSkill definitions for AI coding assistants (react-aria, Storybook/rsbuild, Tailwind, Playwright, etc.).

## Design

- **Single-package monorepo**: `packages/` contains exactly one workspace package (`ui`). The monorepo scaffolding exists to allow future packages (e.g. a separate tokens package, config package) without restructuring.
- **pnpm workspaces** with `pnpm@9` as the locked package manager. Node `>=20.19.0` is required.
- **Conventional Commits** enforced via Commitlint + Husky. All commit messages must follow `type(scope): description` format.
- **Tooling separation**: linting/formatting config lives at the root so it can eventually be shared across packages. The `packages/ui` package inherits root-level ESLint config (`../../eslint.config.js`).
- **Changesets workflow**: contributors run `pnpm changeset` to document a change; CI/CD consumes changesets to bump versions and publish.

## Flow

```
Developer commits code
  → Husky pre-commit hook: lint + format:check
  → Husky commit-msg hook: commitlint validates message format
  → pnpm changeset (manual): records version intent
  → CI: test → build → publish (GitHub Actions in .github/workflows/)
```

Root-level scripts proxy into `packages/ui`:
```
pnpm build        → pnpm --filter @geti/ui build        (rslib build)
pnpm storybook    → pnpm --filter @geti/ui storybook     (Storybook dev server)
pnpm test         → pnpm --filter @geti/ui test          (rstest run)
pnpm lint         → pnpm --filter @geti/ui lint          (eslint)
```

## Integration

- **Consumers** install `@geti/ui` from npm (or a private registry). They never interact with this monorepo root.
- **CI/CD** (`.github/workflows/`) checks out this repo, installs with `pnpm install`, runs tests and builds, then publishes on tagged releases.
- **AI agents** read `.agents/skills/` for context on how to build with this library, and read `plans/` for the backlog and architectural decisions.
- **Reference packages** (`reference-packages/`) — read-only snapshots from the upstream `open-edge-platform/geti` repo used as implementation reference; they are not workspaces and have no `node_modules`.
