# Review: NumberField

**File:** `packages/ui/src/components/NumberField/NumberField.tsx`
**Reviewed:** 2026-03-06

---

## Summary

Correct thin wrapper. The main issues are insufficient test coverage (no `onChange` / `onBlur` interaction test, no min/max clamping test) and a test that queries by role `'group'` rather than by the input itself — fragile if Spectrum changes its DOM structure.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                              |
| --- | -------- | -------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Same empty `interface` extension anti-pattern as TextField/TextArea. |
| 1.2 | 🟢 Good  | No custom styling needed; Spectrum handles numeric stepper UI.       |
| 1.3 | 🟢 Good  | Brief JSDoc present.                                                 |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                    |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | 🟢 Good  | Spectrum exposes `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, increment/decrement buttons with ARIA labels. All delegated correctly. |
| 2.2 | 🟡 Low   | No `aria-label` fallback story for label-less usage (e.g., inside a table cell). Should at least be documented.                            |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                                       |
| --- | -------- | ------------------------------------------------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No `WithError` / `validationState` story.                                                                     |
| 3.2 | 🟡 Low   | No story for `formatOptions` (currency, percentage) — a key differentiator of NumberField vs plain TextField. |
| 3.3 | 🟢 Good  | `WithMinMax` and `WithStep` stories cover the numeric-specific surface area well.                             |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                                                                                                        |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No `onChange` interaction test.                                                                                                                                                                                                                |
| 4.2 | 🔴 Missing | No test verifying min/max clamping — i.e., typing a value below `minValue` should clamp and fire `onChange` with the min.                                                                                                                      |
| 4.3 | 🟡 Low     | `renders without crash` queries `getByRole('group')` — this is the outer wrapper role and could match other groups on the page. Prefer `getByLabelText('Quantity')` which is already used in the subsequent test.                              |
| 4.4 | 🟡 Low     | `displays defaultValue` asserts `toHaveValue('42')` — correct for jsdom, but note that `NumberField` formats numbers via `Intl.NumberFormat` and the display value may differ in real environments (e.g., `'42'` vs `'42.00'`). Add a comment. |
| 4.5 | 🟢 Good    | Disabled and label tests present.                                                                                                                                                                                                              |

---

## Fixes Needed

1. **Add `onChange` interaction test** (type a number, verify callback receives a `number` not a string). _(High — core logic)_
2. **Add min/max boundary test.** _(Medium — correctness)_
3. **Fix `renders without crash` to use `getByLabelText`.** _(Low — fragility)_
4. **Add `formatOptions` story** (currency/percentage). _(Low — docs)_
5. **Add `WithError` story.** _(Low — parity)_
