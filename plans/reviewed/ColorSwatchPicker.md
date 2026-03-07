# ColorSwatchPicker — Peer Review

**File:** `packages/ui/src/components/color-swatch/ColorSwatchPicker.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🟠 Needs fixes

---

## Summary

A sound wrapper around Spectrum's `ColorSwatchPicker` that also exports a `ColorSwatchPickerItem` convenience component. Main concerns are: the `@ts-ignore` in stories (indicating a missing type in the Props interface), three stories that are functionally identical, the same folder naming inconsistency as `ColorSwatch`, and missing copyright headers.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                     |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🔴 High   | **Missing copyright header** on all three files (`ColorSwatchPicker.tsx`, `.stories.tsx`, `.test.tsx`).                                                                                                                                                                                                                                                                     |
| 1.2 | 🟠 Medium | `@ts-ignore` on `'aria-label'` in `ColorSwatchPicker.stories.tsx` — this suppresses a type error. The likely cause is that `SpectrumColorSwatchPickerProps` does not extend standard ARIA props. The correct fix is to explicitly add `'aria-label'?: string` to `ColorSwatchPickerProps` (or extend `AriaLabelingProps`), not suppress the error.                          |
| 1.3 | 🟠 Medium | **Folder naming inconsistency** — same issue as `ColorSwatch`: folder is `color-swatch/` instead of a dedicated `ColorSwatchPicker/`. Both `ColorSwatch` and `ColorSwatchPicker` share a single folder, but the exports and concerns are separate components. Each should have its own PascalCase folder, or at minimum the shared folder should be renamed `ColorSwatch/`. |
| 1.4 | ✅        | `ColorSwatchPickerItem` correctly re-exports `SpectrumColorSwatch` under a semantically correct name for use inside a picker.                                                                                                                                                                                                                                               |
| 1.5 | ✅        | `ColorSwatchPickerProps` and `ColorSwatchPickerItemProps` both exported with correct names.                                                                                                                                                                                                                                                                                 |
| 1.6 | ✅        | Props fully spread.                                                                                                                                                                                                                                                                                                                                                         |

**Fix (1.2):**

```ts
import type { AriaLabelingProps } from '@react-types/shared';

export interface ColorSwatchPickerProps extends SpectrumColorSwatchPickerProps, AriaLabelingProps {}
// Then remove the @ts-ignore in stories.
```

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                          |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | ✅        | Spectrum's `ColorSwatchPicker` renders as `role="listbox"` — confirmed by the test's `getAllByRole('option')` query.                                                                             |
| 2.2 | 🟠 Medium | Because `aria-label` is not typed in `ColorSwatchPickerProps`, consumers cannot easily discover it's required. The `@ts-ignore` in stories is evidence of this friction. Fix the type (see 1.2). |
| 2.3 | ✅        | Test confirms `role="option"` for each swatch and `onChange` fires on click.                                                                                                                     |

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity   | Finding                                                                                                                                                                                                                                                                                              |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | ✅         | JSDoc present on both exported components.                                                                                                                                                                                                                                                           |
| 3.2 | 🔴 **Bug** | The `Grid` and `Stack` stories both reference `...Default.args` — they are **identical** to `Default`. The intended stories presumably demonstrate different `density` layouts (`compact`/`spacious`). The `density` argType is defined but never demonstrated. Fix or remove the duplicate stories. |
| 3.3 | 🟡 Low     | `parameters.a11y: {}` is **absent** from stories.                                                                                                                                                                                                                                                    |
| 3.4 | 🟡 Low     | No story for `Controlled` state (with `value` + `onChange`).                                                                                                                                                                                                                                         |

**Fix (3.2) — example Stack/Grid stories:**

```ts
export const Grid: Story = {
    args: { ...Default.args, density: 'compact' },
    name: 'Compact density',
};
export const Stack: Story = {
    args: { ...Default.args, density: 'spacious' },
    name: 'Spacious density',
};
```

---

## 4. Tests

| #   | Severity   | Finding                                                                |
| --- | ---------- | ---------------------------------------------------------------------- |
| 4.1 | ✅         | Renders `role="option"` swatches.                                      |
| 4.2 | ✅         | `onChange` fires on click with `rstest.fn()`.                          |
| 4.3 | 🔴 Missing | No test for `value` (controlled selection) — which swatch is selected? |
| 4.4 | 🔴 Missing | No keyboard navigation test (arrow keys through options).              |
| 4.5 | 🟡 Low     | Unused `React` import in test file.                                    |

---

## Action Items

- [ ] **Fix High**: Add copyright headers to all three files (`High`).
- [ ] **Fix Medium**: Fix `@ts-ignore` by extending `ColorSwatchPickerProps` with `AriaLabelingProps` (`Medium`).
- [ ] **Fix**: Replace duplicate `Grid`/`Stack` stories with meaningful `density` variants (`Medium`).
- [ ] Add `parameters.a11y: {}` to stories (`Medium`).
- [ ] Add controlled selection and keyboard navigation tests (`Medium`).
- [ ] Rename folder from `color-swatch/` to `ColorSwatch/` (or individual folders) (`Medium` — coordinate with `ColorSwatch` rename).
- [ ] Remove unused `React` import in test (`Low`).
