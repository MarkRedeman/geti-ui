# Releasing Geti packages

This document describes the automated packaging and release strategy for the packages in this monorepo.

## Architecture Design

Our release pipeline uses **release-please** for PR-first versioning/changelog management and a publish job for npm trusted publishing.

| Tool | Responsibility |
| :--- | :--- |
| **release-please** | Analyses conventional commits, opens/updates a release PR, updates changelog + versions, and creates tags/GitHub Releases when the release PR is merged. |
| **publish-all.sh** | Publishes all workspaces to npm in dependency order with provenance enabled. |
| **Husky + Commitlint** | Enforces Conventional Commits and automates local Git configuration. |
| **Commit Template** | Provides interactive guidance and examples directly in the Git editor during `git commit`. |
| **GitHub Actions** | Orchestrates CI (lint/test/build), OpenCV artifact build, release PR/tag/release creation, and npm publishing. |

### Shared version

All five packages share a single version number:

- `@geti-ui/ui`
- `@geti-ui/blocks`
- `@geti-ui/smart-tools`
- `@geti-ui/charts`
- `@geti-ui/mcp`

The release PR updates all package versions together, and the publish job releases all packages together.

---

## Manual Setup Required (One-time)

The following steps must be performed manually to activate the automated pipeline:

1.  **NPM Trusted Publishing**:
    *   Configure npm trusted publisher for this repository and workflow (`.github/workflows/release.yml`).
2.  **GitHub Action Permissions**:
    *   Go to `Settings > Actions > General` in your GitHub repo.
    *   Keep default workflow permissions at the minimum required by your repository policy.
    *   This repo grants write scopes at the **job level** only where release automation requires them.
    *   Set workflow permissions to **Read and write permissions**.
    *   Enable **Allow GitHub Actions to create and approve pull requests** (required by `release-please` to open/update the release PR).
    *   If this repository belongs to an organization, ensure org-level Actions policy also allows this (org policy can override repo settings).
3.  **Local Hooks**:
    *   Run `npm install` locally to activate the Husky hooks.
    *   Husky will automatically configure `git config --local commit.template .gitmessage` on post-install.

---

## Release Workflow

### 1. Development

Write code using [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat(button): add loading state
fix(table): resolve overflow in narrow containers
```

Release-please analyses these commit messages automatically to determine the next version bump.

### 2. PR Process

*   **Conventional Commits**: Ensure your commit messages follow the `type(scope): description` format.
    *   **Guidance**: When running `git commit`, an automated template will appear in your editor with examples and type definitions.
    *   **Validation**: Commit messages are validated locally via Husky; if a message is invalid, it will be rejected with an error message explaining the requirements.
*   **CI Verification**: GitHub Actions will run `lint`, `type-check`, `rstest` (unit tests), and `playwright` visual regression tests.
*   **Visual Comments**: An automated bot will comment on your PR with a list of changed component categories and a link to visual diffs.

### 3. Merging & Automated Publishing

When a PR is merged into `main`, the unified `release.yml` workflow runs automatically:

1.  **Release Please** - opens/updates a release PR with computed version bumps and `CHANGELOG.md`.
2.  **Merge release PR** - this creates a signed merge commit through normal branch protection.
3.  **Release Please on merge** - creates git tag (`v{version}`) and GitHub Release.
4.  **Check smart-tools changes** - detects whether `packages/smart-tools/` changed between previous release tag and the new release tag.
5.  **Build OpenCV** (conditional) - only runs if smart-tools has changes. Uses the `opencv-build.yml` reusable workflow.
6.  **Publish** - builds all packages/docs, runs quality gates (lint, type-check, tests), then publishes all five packages to npm (sequentially, in dependency order).

### Common failure and fix

If release fails with:

`GitHub Actions is not permitted to create or approve pull requests.`

then the GitHub Actions repository/org settings above are not fully enabled for PR creation.

### Tag format

All packages share a single tag: `v{version}` (e.g., `v1.2.3`).

---

## Conventional Commit Reference

| Type | SemVer equivalent | Category in Release Notes |
| :--- | :--- | :--- |
| `feat` | Minor | Features |
| `fix` | Patch | Bug Fixes |
| `perf` | Patch | Performance Improvements |
| `refactor` | Patch | (not included by default) |
| `chore/ci/docs` | N/A | (not included by default) |

*Add a `!` after the type (e.g., `feat!: ...`) or include `BREAKING CHANGE:` in the commit footer to indicate a **Breaking Change** (Major bump).*

---

## Configuration

- **`release-please-config.json`**: release-please strategy + versioned files (repo root)
- **`.release-please-manifest.json`**: tracked current release version in manifest mode
- **`scripts/publish-all.sh`**: sequential npm publish script for all 5 workspaces
- **`.github/workflows/release.yml`**: unified release workflow (release PR/release + publish)
