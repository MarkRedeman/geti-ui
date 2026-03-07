# Review: SearchField

**File:** `packages/ui/src/components/SearchField/SearchField.tsx`
**Reviewed:** 2026-03-06

---

## Summary

SearchField is the strongest of the text-input group — it uses `forwardRef` correctly, has a `displayName`, and tests cover the `onSubmit` flow and the clear button. Minor gaps in stories and edge-case tests.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                                                                                      |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.1 | 🟢 Good  | `forwardRef<TextFieldRef, SearchFieldProps>` is typed correctly. Importing `TextFieldRef` from `@react-types/textfield` rather than `@adobe/react-spectrum` avoids re-exporting internal types.                                                              |
| 1.2 | 🟡 Low   | `Omit<SpectrumSearchFieldProps, 'ref'>` — `ref` is not normally in Spectrum's props interface; this Omit is defensive but harmless. Consider removing it and just using `SpectrumSearchFieldProps` directly since `forwardRef` handles the `ref` separation. |
| 1.3 | 🟢 Good  | `SearchField.displayName = 'SearchField'` — correct for `forwardRef` components.                                                                                                                                                                             |
| 1.4 | 🟡 Low   | No CSS module needed, but consider noting in JSDoc that the `ref` is a `TextFieldRef` (not a DOM ref) — this is a non-obvious type for consumers.                                                                                                            |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                              |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | 🟢 Good  | Spectrum renders `<input type="search">` → `role="searchbox"`, which is correct. Clear button has an accessible label from Spectrum. |
| 2.2 | 🟡 Low   | `onClear` callback is not tested — clearing the field is a meaningful user action that assistive tech announces.                     |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                                                              |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1 | 🟡 Low   | `WithSubmitHandler` story uses `alert()` — prefer an `action()` import from `@storybook/addon-actions` for cleaner Storybook output. |
| 3.2 | 🟡 Low   | No story for `onClear` callback.                                                                                                     |
| 3.3 | 🟡 Low   | No story for `isLoading` (Spectrum supports it).                                                                                     |
| 3.4 | 🟢 Good  | `ref` forwarding is not directly demonstrable in Storybook, but a comment or `parameters.docs` note would help.                      |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                 |
| --- | ---------- | ------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No test for `onClear` callback after clicking the clear button.                                         |
| 4.2 | 🟡 Low     | `shows clear button when there is a value` — should also verify the button disappears after clearing.   |
| 4.3 | 🟢 Good    | `onSubmit` with Enter is tested correctly. `getByRole('searchbox')` is semantically correct.            |
| 4.4 | 🟢 Good    | `forwardRef` is not explicitly tested but is an implementation detail Spectrum covers in its own tests. |

---

## Fixes Needed

1. **Add `onClear` test** — click clear button, verify callback fires and input value becomes empty. _(Medium — behavior coverage)_
2. **Remove redundant `Omit<..., 'ref'>`** from `SearchFieldProps`. _(Low — code hygiene)_
3. **Replace `alert()` in story** with `action()`. _(Low — Storybook best practice)_
4. **Add `onClear` story.** _(Low)_
