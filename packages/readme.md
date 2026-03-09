# packages/

## Responsibility

The `packages/` directory is the workspace root for all publishable packages in the `geti-ui` monorepo. Currently it contains exactly one package: `ui/` (published as `@geti-ai/ui`).

Its role is purely structural — it provides the conventional monorepo boundary between workspace tooling (at the repo root) and the deliverable packages that consumers install.

## Design

- **One package today**: `packages/ui/` is the entire library. The directory is named `packages/` (plural) to make room for future additions such as a standalone tokens package, an icons wrapper, or a config package, without requiring a restructure.
- **npm workspace resolution**: root `package.json` declares `workspaces`, so any directory added here can be included in the workspace.
- **No shared config package yet**: Rslint, TypeScript, and Prettier configs live in package/root files and are referenced by relative path where needed. If a second package is added, a shared config package in `packages/config/` would be the natural next step.

## Flow

There is no build or runtime flow at this level. `packages/` is a directory grouping only. All build, test, and publish operations are defined inside `packages/ui/` and delegated to from the repo root via npm workspace scripts.

## Integration

- **Repo root** (`../`) declares `packages/*` as workspaces and delegates all scripts here.
- **`packages/ui/`** is the sole current workspace package; its `package.json` names it `@geti-ai/ui`.
- **Future packages** (e.g. `packages/tokens/`, `packages/icons/`) would be added here and declared as workspace dependencies of `packages/ui/` if needed.
