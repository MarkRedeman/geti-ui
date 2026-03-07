# Review: Picker

**File:** `packages/ui/src/components/Picker/Picker.tsx`
**Reviewed:** 2026-03-06

---

## Summary

Picker is well-structured. The generic type parameter `T extends object` is correctly threaded through. `Item` is re-exported from the same file which is the right pattern. Tests verify the core open/select flow. Main gaps are in story ergonomics and one test that uses `getAllByText` in a fragile way.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                                  |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟢 Good  | Generic `Picker<T extends object>` correctly propagates to `SpectrumPickerProps<T>`.                                                                                                                     |
| 1.2 | 🟢 Good  | `Item` re-exported from the same file — avoids consumers needing to import from two places. Same pattern in `index.ts` as `PickerItem`.                                                                  |
| 1.3 | 🟡 Low   | No `Section` re-export. Spectrum's Picker supports `Section` for grouped options — consumers would need to import it from `@adobe/react-spectrum` directly. Consider re-exporting it as `PickerSection`. |

---

## 2. Accessibility

| #   | Severity   | Finding                                                                                                                                                                          |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good    | Spectrum renders `role="button"` (trigger) → `role="listbox"` (popup) → `role="option"` (items). Keyboard: Enter/Space opens, arrow keys navigate, Enter selects, Escape closes. |
| 2.2 | 🔴 Missing | No keyboard navigation test — pressing Enter should open the listbox, arrow keys should move focus, Enter should select.                                                         |
| 2.3 | 🟡 Low     | No test that selected option is reflected in the trigger label after selection.                                                                                                  |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                          |
| --- | -------- | ---------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No `WithSections` story demonstrating `Section` grouping.        |
| 3.2 | 🟡 Low   | No `WithDisabledItems` story (Spectrum supports `disabledKeys`). |
| 3.3 | 🟡 Low   | No story for `onSelectionChange` callback with a visible result. |
| 3.4 | 🟢 Good  | `Default`, `DefaultSelected`, `Disabled` are correct.            |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                                                                          |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No keyboard test (Enter to open, arrow to navigate, Enter to select).                                                                                                                                            |
| 4.2 | 🔴 Missing | No test that `onSelectionChange` is called with the correct key after selecting an option.                                                                                                                       |
| 4.3 | 🟡 Low     | `displays label` test uses `getAllByText('Choose')[0]` — fragile. The label should be queryable via `getByRole('button', { name: 'Choose' })` since Spectrum includes the label in the button's accessible name. |
| 4.4 | 🟢 Good    | `opens dropdown on click`, `shows options when open`, `isDisabled` — solid smoke-test coverage.                                                                                                                  |

---

## Fixes Needed

1. **Add keyboard navigation test** (Enter open, ArrowDown, Enter select). _(High — keyboard a11y)_
2. **Add `onSelectionChange` test** asserting the callback key value. _(Medium)_
3. **Fix `displays label` test** to use `getByRole('button', { name: 'Choose' })`. _(Low — fragility)_
4. **Re-export `Section` as `PickerSection`** from `Picker.tsx` and `index.ts`. _(Low — API completeness)_
5. **Add `WithSections` and `WithDisabledItems` stories.** _(Low)_
