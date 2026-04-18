# Release Guide (PR-first with release-please)

This repository uses `release-please` via `.github/workflows/release.yml`.

## Current release model

- Release trigger: push to `main`
- Versioning: Conventional Commits analysed by `release-please`
- Tag format: `vX.Y.Z`
- Packages published together with one shared version:
  - `@geti-ui/ui`
  - `@geti-ui/blocks`
  - `@geti-ui/smart-tools`
  - `@geti-ui/charts`
  - `@geti-ui/mcp`

## Flow

1. Push to `main` triggers `release.yml`.
2. `release-please` creates or updates a release PR with:
   - `CHANGELOG.md`
   - all package versions
3. Merge the release PR through normal branch protections.
4. On that merge, `release-please` creates the release tag and GitHub Release.
5. The workflow then builds/tests and publishes all packages to npm with provenance.

## Trusted publishing

This repository is configured for npm trusted publishing (GitHub OIDC):

- no long-lived npm token required for publishing
- short-lived credentials issued at publish time
- npm provenance generated at publish time

### Requirements

1. Configure npm trusted publisher for this repository + workflow (`release.yml`).
2. Keep `id-token: write` on the publish job in `.github/workflows/release.yml`.
3. Do not provide `NODE_AUTH_TOKEN` for the publish step.
4. Keep publishing with provenance (`npm publish --provenance --access public`).

### GitHub Actions permissions for release-please

`release-please` must be able to create and update pull requests.

In GitHub repository settings, enable:

- `Settings` -> `Actions` -> `General`
- Workflow permissions: `Read and write permissions`
- `Allow GitHub Actions to create and approve pull requests`

If this repository belongs to an organization, ensure the same policy is allowed at org level (org settings can override repo settings).

If this is not enabled, the release workflow fails with an error like:

`GitHub Actions is not permitted to create or approve pull requests.`

## Quick preflight checklist

- [ ] Working tree is clean; only intended files are committed.
- [ ] Publishing rights confirmed for npm scope `@geti-ui`.
- [ ] npm trusted publisher configured for `.github/workflows/release.yml` on `main`.
- [ ] `main` branch protection and CI gates are active.
- [ ] Release workflow permissions are correct.
