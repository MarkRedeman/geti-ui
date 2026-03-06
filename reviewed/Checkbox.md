# Review: Checkbox

**File:** `packages/ui/src/components/Checkbox/Checkbox.tsx`
**Reviewed:** 2026-03-06

---

## Summary

Checkbox is a clean, correct minimal wrapper. Tests are the strongest in the entire form-controls group — they cover the indeterminate edge case implicitly via stories, and disabled+onChange interaction is explicitly tested. The main gap is the missing indeterminate state test.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                   |
| --- | -------- | ----------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Empty `interface` extension — same pattern as other thin wrappers.                        |
| 1.2 | 🟢 Good  | `children` is the label mechanism (correct Spectrum pattern). No need for a `label` prop. |
| 1.3 | 🟢 Good  | No CSS module needed; Spectrum handles all visual states.                                 |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | 🟢 Good  | Spectrum manages `aria-checked` (including the `"mixed"` value for `isIndeterminate`), role, keyboard activation, and focus management. All delegated. |
| 2.2 | 🟡 Low   | No test verifying `aria-checked="mixed"` when `isIndeterminate: true`. The story exists but the test does not.                                         |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                                                                                                                                   |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | 🟢 Good  | `Default`, `DefaultSelected`, `Indeterminate`, `Disabled`, `DisabledSelected` — comprehensive coverage.                                                                                                   |
| 3.2 | 🟡 Low   | No story for controlled usage (`isSelected` + `onChange`). This matters for consumers who need controlled state.                                                                                          |
| 3.3 | 🟡 Low   | `argTypes.children` uses `control: 'text'` but `children` should be a React node — Storybook's text control will render a string correctly, but a note clarifying that children are the label would help. |

---

## 4. Tests

| #   | Severity   | Finding                                                                                       |
| --- | ---------- | --------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No `isIndeterminate` test — specifically, no verification that `aria-checked="mixed"` is set. |
| 4.2 | 🔴 Missing | No keyboard test — pressing Space should toggle the checkbox.                                 |
| 4.3 | 🟢 Good    | `onChange` fired once on click, not fired when disabled — both verified.                      |
| 4.4 | 🟢 Good    | `defaultSelected` checked state verified correctly.                                           |

---

## Fixes Needed

1. **Add `isIndeterminate` test** asserting `aria-checked="mixed"`. _(High — a11y coverage)_
2. **Add Space keypress test** for keyboard activation. _(Medium — keyboard nav)_
3. **Add controlled-usage story** (`isSelected` + `onChange`). _(Low — docs)_
