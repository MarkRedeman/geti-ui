# Plan: Add assets and icons to Geti package surface

## Goal

Expose reusable icons and static assets from this repository with:

1. **consumer-friendly imports**,
2. **tree-shakeable exports**,
3. **clear documentation** (new Assets section with sub-pages),
4. **minimal migration risk**.

Source material to copy from (read-only):

- `reference-packages/ui/icons/`
- `reference-packages/assets/`

---

## Scope

### In scope

- Copy icon SVGs and image assets into `packages/ui/` (new folders).
- Define stable export entrypoints.
- Add typed/icon-friendly API for React usage.
- Add docs pages:
  - `Assets` overview
  - `Icons` sub page
  - category sub pages for non-icon assets

### Out of scope (phase 1)

- Font/CSS global reset migration from `reference-packages/assets/index.scss` as a global stylesheet.
- Publishing a separate npm package immediately (can be phase 2 if needed).

---

## Packaging options

## Option A — Keep inside `@geti/ui` (recommended for phase 1)

Expose subpath exports like:

- `@geti/ui/icons`
- `@geti/ui/assets/images`
- `@geti/ui/assets/primary-tools`
- `@geti/ui/assets/tests-assets` (optional; may be internal)

Pros:

- Fastest to ship.
- No new release pipeline/package governance.
- Easy adoption for existing `@geti/ui` users.

Cons:

- Larger package surface and potentially larger install size.

## Option B — New `@geti/assets` package

Expose:

- `@geti/assets/icons`
- `@geti/assets/images`
- etc.

Pros:

- Cleaner separation of concerns.
- Independent versioning cadence.

Cons:

- More setup overhead now (workspace/package config, release, docs split).

## Decision

Use **Option A now**, while structuring folders/exports so extraction to `@geti/assets` later is mechanical.

---

## Proposed file layout (phase 1)

Under `packages/ui/src/`:

```txt
assets/
  icons/
    *.svg
    index.ts                # named React icon exports
    manifest.ts             # metadata (name/file/path)
  images/
    *.svg|*.webp|*.png|...
    index.ts                # URL/static imports + optional React SVG exports
  primary-tools/
    *.webp
    index.ts
  tests-assets/             # optional export policy (see below)
    *
    index.ts
```

Notes:

- Copy files from `reference-packages/*` into these new folders.
- Do **not** import from `reference-packages/` at runtime.

---

## Export strategy (tree shaking)

## 1) Subpath exports in `packages/ui/package.json`

Add explicit export entries (examples):

- `"./icons": "./dist/esm/assets/icons/index.js"`
- `"./assets/images": "./dist/esm/assets/images/index.js"`
- `"./assets/primary-tools": "./dist/esm/assets/primary-tools/index.js"`

Keep CJS + types paths aligned.

## 2) Named exports only (no default export object)

Use per-icon named exports so bundlers can remove unused icons.

Avoid patterns like:

```ts
export default { IconA, IconB }
```

Prefer:

```ts
export { IconA } from './icon-a.svg';
export { IconB } from './icon-b.svg';
```

## 3) Side-effects policy

- Keep asset/icon entry modules side-effect free.
- Ensure package `sideEffects` does not force-retain icon modules.

## 4) Optional deep import support

If desired, allow `@geti/ui/icons/<Name>` later; not required in phase 1.

---

## Icon API shape

Mirror legacy naming from `reference-packages/ui/icons/index.ts` for migration ease.

Phase 1 API:

- `import { AddCircle, AlertOutlined, ... } from '@geti/ui/icons'`

Also include a generated manifest for docs search/gallery:

- `iconManifest: Array<{ name: string; fileName: string; tags?: string[] }>`

---

## Asset API shape

For raster/static assets, expose URL imports:

- `import { IntelLoadingWebp } from '@geti/ui/assets/images'`

For SVG images, decide per file:

- URL export (default baseline), and optionally
- React component export if used as inline icon/illustration.

Keep naming predictable and suffix URLs where helpful (e.g. `...Url`).

---

## Documentation plan

Create new docs section rooted at `documentation/docs/assets/`.

Pages:

1. `documentation/docs/assets/index.mdx` (Assets overview)
   - Purpose and import rules
   - Packaging model (`@geti/ui/icons`, `@geti/ui/assets/*`)
   - Tree-shaking guidance

2. `documentation/docs/assets/icons.mdx`
   - Icon usage examples
   - Size/color guidance
   - Searchable icon gallery from `iconManifest`
   - Copy-paste import snippets

3. Category pages for non-icon assets:
   - `documentation/docs/assets/images.mdx`
   - `documentation/docs/assets/primary-tools.mdx`
   - `documentation/docs/assets/tests-assets.mdx` (if exported; otherwise omit/publicly hide)
   - Optional `documentation/docs/assets/fonts.mdx` (documentation-only unless exported)

Sidebar/nav updates:

- Add top-level nav item: `Assets`.
- Add sidebar group entries for icons + each asset category page.

---

## Implementation phases

## Phase 0 — Discovery + naming map

- Build canonical file inventory from source folders.
- Define naming conversion rules (kebab-case file -> PascalCase export).
- Mark collisions and resolve naming exceptions.

Deliverable: mapping table committed in plan or generated manifest.

## Phase 1 — Copy assets into `packages/ui/src/assets`

- Copy icons and asset files from reference packages.
- Add folder-local `index.ts` files.
- Keep source-of-truth snapshots in-repo (not linked to reference paths).

## Phase 2 — Exports + build wiring

- Add subpath exports in `packages/ui/package.json`.
- Ensure rslib outputs include asset files and typings.
- Verify import forms:
  - `@geti/ui/icons`
  - `@geti/ui/assets/images`

## Phase 3 — Documentation

- Add Assets pages and examples.
- Add icon gallery and asset preview blocks.
- Document migration guidance from legacy imports.

## Phase 4 — Verification

- Type-check/build `@geti/ui`.
- Build docs.
- Add small runtime checks/examples for icon rendering.
- Optional: bundle-size smoke check to confirm tree shaking behavior.

---

## Verification checklist

- [ ] `pnpm --filter @geti/ui build` passes.
- [ ] `pnpm docs:build` passes.
- [ ] `import { AddCircle } from '@geti/ui/icons'` works.
- [ ] `import { IntelLoadingWebp } from '@geti/ui/assets/images'` works.
- [ ] Unused icons are not retained in a sample production bundle.
- [ ] Docs show icon gallery + asset category pages.

---

## Risks and mitigations

1. **Large package growth**
   - Mitigate with subpath exports + tree-shakeable named exports.
   - Revisit split to `@geti/assets` if package size becomes problematic.

2. **Naming collisions across icons/assets**
   - Generate manifest + deterministic naming rules + explicit exceptions file.

3. **Mixed SVG handling (URL vs ReactComponent)**
   - Standardize per folder and document clearly.

4. **Accidental exposure of test-only assets**
   - Keep `tests-assets` internal by default unless explicitly approved.

---

## Follow-up (optional phase 2)

If adoption/size warrants, extract to `@geti/assets` with minimal breaking change by preserving same subpath API shape:

- from `@geti/ui/icons` -> `@geti/assets/icons`
- from `@geti/ui/assets/images` -> `@geti/assets/images`

Can be shipped with compatibility re-exports and deprecation notices.
