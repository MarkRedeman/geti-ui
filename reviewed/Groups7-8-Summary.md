# Groups 7 & 8 Peer Review — Summary

**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Components reviewed:** Flex, Grid, View, Divider, Disclosure, Accordion, Well, Card, CardView, ColorSwatch, ColorSwatchPicker, ColorSlider, ColorArea, ColorWheel, ColorField, ColorThumb, ColorPickerDialog (17 total)

---

## Overall Status by Component

| Component             | Status                    | Highest Severity |
| --------------------- | ------------------------- | ---------------- |
| Flex                  | ✅ Approved (minor notes) | Low              |
| Grid                  | ✅ Approved (minor notes) | Low              |
| View                  | 🟡 Minor fixes            | Medium           |
| Divider               | ✅ Approved (minor notes) | Low              |
| Disclosure            | ✅ Approved               | Medium           |
| **Accordion**         | 🟠 Needs fixes            | **High**         |
| Well                  | ✅ Approved               | Low              |
| **Card**              | 🔴 Significant fixes      | **Critical**     |
| **CardView**          | 🟠 Needs fixes            | High             |
| **ColorSwatch**       | 🟠 Needs fixes            | High             |
| **ColorSwatchPicker** | 🟠 Needs fixes            | High             |
| **ColorSlider**       | 🟠 Needs fixes            | High             |
| **ColorArea**         | 🟠 Needs fixes            | High             |
| **ColorWheel**        | 🟠 Needs fixes            | High             |
| **ColorField**        | 🟠 Needs fixes            | High             |
| **ColorThumb**        | 🟠 Needs fixes            | High             |
| **ColorPickerDialog** | 🔴 Significant fixes      | **Critical**     |

---

## Cross-Cutting Issues (affect multiple components)

These are systemic problems that should be resolved in a single sweep across all affected files.

### 🔴 CRIT-1 — Missing copyright headers on all Group 8 components

**Affects:** ColorArea, ColorField, ColorSlider, ColorWheel, ColorThumb, ColorSwatch (and its folder), ColorSwatchPicker, ColorPickerDialog — all implementation, stories, and test files.  
**Fix:** Add `// Copyright (C) 2022-2025 Intel Corporation\n// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE` to the top of every affected file.

### 🔴 CRIT-2 — Unused `React` import across all Group 8 test files

**Affects:** `ColorArea.test.tsx`, `ColorField.test.tsx`, `ColorSlider.test.tsx`, `ColorWheel.test.tsx`, `ColorThumb.test.tsx`, `ColorSwatch.test.tsx`, `ColorSwatchPicker.test.tsx`, `ColorPickerDialog.test.tsx`  
**Fix:** Remove `import React from 'react'` from all Group 8 test files (JSX transform makes it unnecessary).

### 🟠 CRIT-3 — Missing `parameters.a11y: {}` in all Group 8 stories

**Affects:** Every Color component story file.  
**Fix:** Add `parameters: { a11y: {} }` to every story meta in Group 8. Group 7 components all have this; Group 8 uniformly omits it.

### 🟠 CRIT-4 — Inconsistent test provider strategy

**Affects:** Group 7 uses `<Provider theme={defaultTheme}>` from Spectrum; Group 8 uses `<ThemeProvider>` from the library. This inconsistency is not a bug (both work), but it means Group 7 tests aren't exercising the Geti theme token overrides. **Recommendation:** Standardise on `<ThemeProvider>` across the entire test suite so Geti theme tokens are always active during tests.

### 🟠 CRIT-5 — `color-swatch/` folder naming inconsistency

**Affects:** `ColorSwatch` and `ColorSwatchPicker` share a `color-swatch/` kebab-case folder while every other component uses `PascalCase/` folders.  
**Fix:** Rename to `ColorSwatch/` with separate sub-files, or create `ColorSwatch/` and `ColorSwatchPicker/` individually. Update all import paths in `index.ts` and any consuming files.

---

## Top Issues by Severity

### 🔴 Critical

1. **Card — No focus indicator** (`Card.tsx`)  
   `style={{ all: 'unset' }}` on the interactive button removes browser focus rings entirely. WCAG SC 2.4.7 violation. The interactive Card is keyboard-inaccessible to sighted keyboard users and screen magnification users.

2. **ColorPickerDialog — State sync bug** (`ColorPickerDialog.tsx`)  
   `colorProp` changes after initial render are silently ignored. The dialog will always display the colour from first mount regardless of prop updates. This is a controlled-input anti-pattern.

3. **ColorPickerDialog — Near-zero test coverage** (`ColorPickerDialog.test.tsx`)  
   1 test covers the trigger button. Opening the dialog, selecting a colour, confirming, cancelling — none of these are tested. This is the most complex component in the batch with the least coverage.

### 🔴 High

4. **Accordion stories and tests bypass local Disclosure wrapper** (`Accordion.stories.tsx`, `Accordion.test.tsx`)  
   Both files import `Disclosure`, `DisclosurePanel`, `DisclosureTitle` from `@adobe/react-spectrum` instead of from `../Disclosure/Disclosure`. Any Geti-specific wrapper behaviour would be invisible in tests and Storybook.

5. **ColorPickerDialog bypasses all local wrappers** (`ColorPickerDialog.tsx`)  
   14+ components are imported directly from `@adobe/react-spectrum` rather than the library's wrappers. When migrating to Spectrum 2, or if wrappers add Geti overrides, `ColorPickerDialog` will silently diverge.

6. **CardView uses `key={index}`** (`CardView.tsx`)  
   Unstable keys cause incorrect reconciliation when the items array is modified. Every major React best-practice guide flags this. Requires a `getItemKey` prop or a constrained generic.

7. **Card uses `onClick` instead of Spectrum `onPress`** (`Card.tsx`)  
   The Props type implies Spectrum semantics (`onPress`) but the implementation uses native `onClick`. These have different behaviour (pointer cancel handling, press delay). Misleading to consumers.

### 🟠 Medium

8. **ColorSwatchPicker has `@ts-ignore`** (`ColorSwatchPicker.stories.tsx`)  
   `aria-label` is not typed in `ColorSwatchPickerProps`. The fix is a 1-line type extension, not a suppression.

9. **ColorField uses deprecated `validationState` API**  
   `validationState="invalid"` was deprecated; `isInvalid` is the current API. Blocks the Spectrum 2 migration path.

10. **ColorThumb uses `UNSAFE_style` for all styling** (`ColorThumb.tsx`)  
    Violates AGENTS.md convention. Should use `UNSAFE_className` + CSS module (or document the exception).

11. **ColorThumb has no `aria-hidden`** (`ColorThumb.tsx`)  
    Purely decorative elements must be explicitly hidden from AT. No `aria-hidden="true"`.

12. **ColorPickerDialog preset swatches lack `aria-label`**  
    8 preset `ColorSwatch` items in `ColorPickerDialog` have no accessible names. Screen readers announce unnamed images.

13. **Card `disabled` + `aria-disabled` dual usage** (`Card.tsx`)  
    Sets both `disabled` (removes from tab order) and `aria-disabled` (redundant). Pick one consistent pattern.

14. **CardView `aria-pressed` vs `aria-selected` mismatch** (`CardView.tsx`/`Card.tsx`)  
    List selection contexts should use `aria-selected` on `role="option"` items, not `aria-pressed` (toggle-button semantics).

---

## Recommended Priority Order for Fixes

```
Priority 1 (Critical — before any release)
  - Card: restore focus visibility (CRIT)
  - ColorPickerDialog: fix colorProp state sync (CRIT)
  - ColorPickerDialog: add dialog open/confirm/cancel tests (CRIT)

Priority 2 (High — blocking good library quality)
  - All Group 8: add copyright headers (sweep)
  - All Group 8: remove unused React imports (sweep)
  - All Group 8: add parameters.a11y (sweep)
  - Accordion: fix stories + tests to import from local Disclosure wrapper
  - ColorPickerDialog: import from library wrappers not @adobe/react-spectrum
  - CardView: replace key={index} with getItemKey

Priority 3 (Medium — quality improvements)
  - Card: use onPress/usePress instead of onClick
  - Card: fix disabled + aria-disabled duality
  - ColorSwatchPicker: fix @ts-ignore with type extension
  - ColorField: replace validationState with isInvalid
  - ColorThumb: UNSAFE_style → UNSAFE_className + CSS module
  - ColorThumb: add aria-hidden="true"
  - color-swatch/ → ColorSwatch/ folder rename
  - Standardise all tests on <ThemeProvider>

Priority 4 (Low — polish)
  - All: replace empty interface extends with type aliases
  - View: reorder Props declaration above component
  - ColorThumb: add title to story meta
  - Disclosure: add onExpandedChange story
  - Well: document aria-label requirement for role=region
  - ColorPickerDialog: add aria-hidden to trigger swatch
  - ColorPickerDialog: add aria-label to preset swatches
```

---

## Reports

Individual component reports:

- [Flex.md](./Flex.md)
- [Grid.md](./Grid.md)
- [View.md](./View.md)
- [Divider.md](./Divider.md)
- [Disclosure.md](./Disclosure.md)
- [Accordion.md](./Accordion.md)
- [Well.md](./Well.md)
- [Card.md](./Card.md)
- [CardView.md](./CardView.md)
- [ColorSwatch.md](./ColorSwatch.md)
- [ColorSwatchPicker.md](./ColorSwatchPicker.md)
- [ColorSlider.md](./ColorSlider.md)
- [ColorArea.md](./ColorArea.md)
- [ColorWheel.md](./ColorWheel.md)
- [ColorField.md](./ColorField.md)
- [ColorThumb.md](./ColorThumb.md)
- [ColorPickerDialog.md](./ColorPickerDialog.md)
