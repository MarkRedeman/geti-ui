# Review: ComboBox

**File:** `packages/ui/src/components/ComboBox/ComboBox.tsx`
**Reviewed:** 2026-03-06

---

## Summary

ComboBox is structurally identical to Picker — generic type, `Item` re-export. The tests are weaker than Picker's because they rely on a jsdom-specific rendering quirk (ComboBox renders as `role="button"` in jsdom) and the only two test cases are essentially the same assertion.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                     |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟢 Good  | Generic `ComboBox<T extends object>` correctly propagates to `SpectrumComboBoxProps<T>`.                                                                                                    |
| 1.2 | 🟢 Good  | `Item` re-exported from same file — correct. `ComboBoxItem` alias in `index.ts` is good.                                                                                                    |
| 1.3 | 🟡 Low   | Same missing `Section` re-export as Picker.                                                                                                                                                 |
| 1.4 | 🟡 Low   | ComboBox has a distinct UX from Picker (type-to-filter, free-form input). The JSDoc is accurate but could mention the free-text-entry distinction to help consumers choose between the two. |

---

## 2. Accessibility

| #   | Severity   | Finding                                                                                                                                                                                                                                                                      |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good    | Spectrum renders `role="combobox"` with `aria-expanded`, `aria-autocomplete`, `aria-controls` pointing to the listbox. Full keyboard support.                                                                                                                                |
| 2.2 | 🔴 Missing | No test for `role="combobox"` — both "renders without crash" and "has a trigger button" assert `role="button"` with a comment explaining this is the jsdom rendering. This assertion may silently pass even if the real component regresses. At minimum note this fragility. |
| 2.3 | 🔴 Missing | No keyboard interaction test (type to filter, arrow to navigate, Enter to select).                                                                                                                                                                                           |
| 2.4 | 🟡 Low     | No test that `onInputChange` fires as the user types.                                                                                                                                                                                                                        |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                                                                            |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No story for `onInputChange` (free-text filtering is the key differentiator).                                                                      |
| 3.2 | 🟡 Low   | No story for `allowsCustomValue` — lets users enter a value not in the list.                                                                       |
| 3.3 | 🟡 Low   | `DefaultInputValue` story duplicates `DefaultSelected` in purpose without explaining the distinction (pre-typed filter text vs pre-selected item). |
| 3.4 | 🟢 Good  | `Default`, `DefaultSelected`, `DefaultInputValue`, `Disabled` — reasonable base set.                                                               |

---

## 4. Tests

| #   | Severity     | Finding                                                                                                                                                                    |
| --- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Duplicate | `renders without crash` and `has a trigger button` are identical assertions — the second adds nothing. Remove the duplicate.                                               |
| 4.2 | 🔴 Missing   | No `onInputChange` test.                                                                                                                                                   |
| 4.3 | 🔴 Missing   | No keyboard test.                                                                                                                                                          |
| 4.4 | 🟡 Low       | `is disabled` asserts `aria-disabled="true"` — this is correct for the jsdom mobile variant, but the comment should note this diverges from `isDisabled` on native inputs. |

---

## Fixes Needed

1. **Remove duplicate test** (`renders without crash` and `has a trigger button` are identical). _(Low — hygiene)_
2. **Add `onInputChange` test** (type characters, verify callback). _(High — core ComboBox behaviour)_
3. **Add keyboard test** (type to filter, arrow to navigate, Enter to select). _(High — a11y)_
4. **Add `allowsCustomValue` and `onInputChange` stories** to differentiate ComboBox from Picker. _(Medium — docs)_
5. **Re-export `Section` as `ComboBoxSection`** from `ComboBox.tsx` and `index.ts`. _(Low)_
