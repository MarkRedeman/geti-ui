# CSS Theming Issue Report (Docs vs Storybook)

## Summary

We observed visual mismatch between Storybook and docs for the same component (`Button`):

- Storybook (`http://localhost:6006/?path=/docs/ui-button--docs`) showed expected Geti-themed colors.
- Docs (`http://localhost:3000/components/ui/Button.html`) showed default/fallback Spectrum-like styling.

## Impact

- Developers can draw incorrect conclusions from docs previews.
- UI verification confidence drops because Storybook and docs disagree.
- Theme regressions become harder to detect.

## Root cause

Two issues were interacting:

1. **Docs alias resolution conflict**
   - Docs aliased `@geti/ui` to source (`packages/ui/src/index.ts`) for parity.
   - That alias also captured `@geti/ui/styles.css`, causing intermittent module resolution/HMR failures for the stylesheet import.

2. **Dark token specificity/order conflict**
   - Geti dark token block used `.spectrum--dark`.
   - Base Spectrum styles include `.spectrum` token assignments (same specificity).
   - In docs bundling order, `.spectrum` could win, producing default-ish values like `--spectrum-global-color-gray-100: #1d1d1d` instead of Geti `#313236`.

Important detail:

- `ThemeProvider` applies classes/context.
- Final token values still depend on CSS resolution order and selector specificity.

## Evidence observed

- In Storybook, button styles resolved to Geti token values (e.g. `--energy-blue` family).
- In docs before fix, computed values on component page reflected non-Geti defaults.
- Importing the library CSS into docs theme runtime resolved the mismatch.

## Immediate mitigation applied

Docs runtime imports `@geti/ui/styles.css` from `documentation/theme/index.tsx`.

This ensures the package stylesheet is always present in docs runtime.

## Preventive fixes (recommended)

### 1) Publish a stable stylesheet entrypoint from `@geti/ui` (implemented)

Expose `@geti/ui/styles.css` via package exports and `style` field so consumers/docs can import styles without repository-relative `dist` paths.

Benefits:

- Avoids fragile monorepo-relative imports.
- Ensures consumers can reliably include required theme tokens.
- Aligns package contract with how UI libraries are typically consumed.

### 2) Use package stylesheet import in docs runtime (implemented)

Switch docs to:

```ts
import '@geti/ui/styles.css';
```

Benefits:

- Docs behavior mirrors real consumer integration.
- Removes coupling to workspace build output folder structure.

### 3) Make docs alias stylesheet-aware (implemented)

When `@geti/ui` is aliased to source in docs config, add explicit alias for stylesheet path:

```ts
'@geti/ui/styles.css': path.resolve(__dirname, '../packages/ui/dist/esm/index.css')
```

Benefits:

- Prevents `Cannot find module '@geti/ui/styles.css'` in dev/HMR.
- Keeps source alias behavior while preserving CSS import stability.

### 4) Increase dark token selector specificity (implemented)

Change dark token scope in `geti-dark.module.css`:

```css
.spectrum--dark { ... }
```

to:

```css
.spectrum.spectrum--dark { ... }
```

Benefits:

- Makes Geti dark token overrides win over base `.spectrum` assignments regardless of bundling order.
- Restores deterministic docs/storybook parity for dark tokens.

### 5) Document required stylesheet import in installation guide (implemented)

Add explicit install usage:

```ts
import '@geti/ui/styles.css';
```

alongside `ThemeProvider` setup.

Benefits:

- Prevents consumers from missing required styles.
- Reduces support/debug time for "theme not applied" issues.

### 6) Add CI/theming guard (recommended follow-up)

Add a lightweight Playwright assertion on docs that checks a known token value in computed style for a representative component.

Example assertions:

- `--energy-blue` exists and is non-empty under provider scope.
- Accent button background is not default Spectrum fallback.

Benefits:

- Detects stylesheet regression early.
- Prevents recurrence when tooling/config changes.

## Implementation status

- [x] Issue documented
- [x] Package stylesheet entrypoint exposed
- [x] Docs import switched to package stylesheet
- [x] Docs alias updated to resolve `@geti/ui/styles.css` alongside source alias
- [x] Dark token selector specificity hardened (`.spectrum.spectrum--dark`)
- [x] Installation docs updated with stylesheet import requirement
- [ ] CI token-level guard test (optional next hardening step)

## Minimal fix set (validated)

The smallest reliable fix we validated for parity is:

1. `documentation/rspress.config.ts`
   - Add alias for `@geti/ui/styles.css` while keeping `@geti/ui` source alias.
2. `packages/ui/src/theme/geti-dark.module.css`
   - Use `.spectrum.spectrum--dark` for dark token block.

With these in place, docs and Storybook match for key computed tokens:

- `--spectrum-global-color-blue-500: #378ef0`
- `--spectrum-global-color-gray-100: #313236`
- `--spectrum-global-color-gray-75: #2e2f32`
- `--energy-blue: #00c7fd`
