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

`ThemeProvider` was present, but docs runtime did not guarantee loading the full `@geti/ui` stylesheet that defines key CSS custom properties/tokens.

Important detail:

- `ThemeProvider` applies theme classes and context.
- Actual token values (e.g., `--energy-blue`, semantic CTA tokens) are defined in CSS.
- Without loading the library CSS, class-based token overrides are incomplete, so Spectrum defaults can win.

## Evidence observed

- In Storybook, button styles resolved to Geti token values (e.g. `--energy-blue` family).
- In docs before fix, computed values on component page reflected non-Geti defaults.
- Importing the library CSS into docs theme runtime resolved the mismatch.

## Immediate mitigation applied

Temporary/global docs-side import added:

- `documentation/theme/index.tsx` imports `../../packages/ui/dist/esm/index.css`

This restored docs visual parity with Storybook in local verification.

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

### 3) Document required stylesheet import in installation guide (implemented)

Add explicit install usage:

```ts
import '@geti/ui/styles.css';
```

alongside `ThemeProvider` setup.

Benefits:

- Prevents consumers from missing required styles.
- Reduces support/debug time for "theme not applied" issues.

### 4) Add CI/theming guard (recommended follow-up)

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
- [x] Installation docs updated with stylesheet import requirement
- [ ] CI token-level guard test (optional next hardening step)
