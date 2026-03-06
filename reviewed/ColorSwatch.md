# ColorSwatch — Peer Review

**File:** `packages/ui/src/components/color-swatch/ColorSwatch.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🟠 Needs fixes

---

## Summary

A correct thin wrapper around Spectrum's `ColorSwatch`. The implementation is minimal and sound. Key issues are: missing copyright header, inconsistent folder naming (`color-swatch` vs `PascalCase` used by every other component), and missing `aria-label` requirement in JSDoc. Tests use `ThemeProvider` (correct for this group), but coverage is thin.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                               |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🔴 High   | **Missing copyright header**. Every other component in the library opens with `// Copyright (C) 2022-2025 Intel Corporation / LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE`. All Group 8 color component files are missing this.                                                                                                                                        |
| 1.2 | 🟠 Medium | **Folder naming inconsistency**: the folder is named `color-swatch` (kebab-case) while every other component in the library uses `PascalCase` folder names (`ColorArea/`, `ColorField/`, etc.). This breaks discoverability and creates an irregular import path: `'../color-swatch/ColorSwatch'` vs `'../ColorArea/ColorArea'`. Should be renamed to `ColorSwatch/`. |
| 1.3 | ✅        | `ColorSwatchProps extends SpectrumColorSwatchProps {}` — empty interface, consistent.                                                                                                                                                                                                                                                                                 |
| 1.4 | ✅        | Props fully spread.                                                                                                                                                                                                                                                                                                                                                   |
| 1.5 | ✅        | No `any` types.                                                                                                                                                                                                                                                                                                                                                       |

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                        |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟠 Medium | `ColorSwatch` renders as `role="img"`. Per WCAG SC 1.1.1, every non-decorative image must have an accessible name. Spectrum requires `aria-label` to be passed explicitly — there is no automatic label generation. The JSDoc does **not** document this requirement. Consumers who omit `aria-label` will produce an accessibility violation. |
| 2.2 | ✅        | The `Sizes` and `Rounding` stories correctly pass `aria-label` per swatch.                                                                                                                                                                                                                                                                     |
| 2.3 | ✅        | Test correctly queries `role="img"` and checks `aria-label`.                                                                                                                                                                                                                                                                                   |

**Suggested JSDoc addition:**

```ts
/**
 * A ColorSwatch displays a preview of a selected color.
 * @note `aria-label` is required for accessibility (the swatch renders as role="img").
 *       Example: `<ColorSwatch color="#ff0000" aria-label="Red" />`
 */
```

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                                                                                     |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | JSDoc present but brief — no `@param` or `@note` for the required `aria-label`.                                                             |
| 3.2 | ✅       | Three stories: Default, Sizes, Rounding — covers all props.                                                                                 |
| 3.3 | 🟡 Low   | The `Default` story omits `aria-label` — this will produce an axe violation in `parameters.a11y` checks. Add `aria-label="Default swatch"`. |
| 3.4 | 🟡 Low   | `parameters.a11y: {}` is **absent** from the stories file — all Group 7 components include it.                                              |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅         | Renders `role="img"` with `aria-label`.                                                                                                |
| 4.2 | ✅         | Size rendering smoke test.                                                                                                             |
| 4.3 | 🔴 Missing | No test for `rounding` prop.                                                                                                           |
| 4.4 | 🔴 Missing | No test verifying that `color` prop is reflected (background color). The test checks the `aria-label` but not the visual color output. |
| 4.5 | 🟡 Low     | `React` is imported but not needed (JSX transform handles this). Remove the unused import.                                             |

---

## Action Items

- [ ] **Fix High**: Add copyright header to `ColorSwatch.tsx` (`High`).
- [ ] **Fix Medium**: Rename `color-swatch/` folder to `ColorSwatch/` for consistency, updating all imports (`Medium`).
- [ ] Add `aria-label` requirement to JSDoc (`Medium`).
- [ ] Add `aria-label` to `Default` story and add `parameters.a11y: {}` (`Medium`).
- [ ] Add `rounding` prop test (`Low`).
- [ ] Remove unused `React` import from test (`Low`).
