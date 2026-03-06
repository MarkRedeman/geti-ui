# Review: CheckboxGroup

**File:** `packages/ui/src/components/CheckboxGroup/CheckboxGroup.tsx`
**Reviewed:** 2026-03-06

---

## Summary

CheckboxGroup is correctly implemented. One notable concern: the stories import `Checkbox` directly from `@adobe/react-spectrum` rather than from the Geti `Checkbox` component — this inconsistency means the Geti Checkbox wrapper is bypassed in documentation. Tests are good and correctly import from the library's own Spectrum direct import.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                                        |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Empty `interface` extension — same pattern.                                                                                                                                                                                                                                                                                                                    |
| 1.2 | 🔴 Issue | **Stories import `Checkbox` from `@adobe/react-spectrum`** (line 5 of stories file), not from `../Checkbox/Checkbox`. If the Geti `Checkbox` ever gains custom behaviour (e.g., a style override), stories won't reflect it. Consistent: tests use the same `@adobe/react-spectrum` import. Both should use `import { Checkbox } from '../Checkbox/Checkbox'`. |
| 1.3 | 🟢 Good  | No custom styling needed at group level.                                                                                                                                                                                                                                                                                                                       |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                   |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good  | Spectrum renders `role="group"` with `aria-labelledby` pointing to the group label. Individual checkboxes have `role="checkbox"`.                         |
| 2.2 | 🟡 Low   | No test or story for `isRequired` on the group (required group is a valid ARIA pattern).                                                                  |
| 2.3 | 🟡 Low   | No test for `orientation` impact — horizontal layout should not affect ARIA, but it's worth asserting the group still has the correct label in that mode. |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                |
| --- | -------- | ---------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No `WithError` story (group-level validation).                         |
| 3.2 | 🟡 Low   | No `IsRequired` story.                                                 |
| 3.3 | 🟢 Good  | `Default`, `DefaultSelected`, `Horizontal`, `Disabled` — good variety. |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                                         |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🟡 Low   | No test for `defaultValue` — checking that pre-selected values render as checked.                                                               |
| 4.2 | 🟡 Low   | No test for `onChange` returning the correct updated array when a second checkbox is added (current test only checks single selection `['a']`). |
| 4.3 | 🟢 Good  | `disables all checkboxes when isDisabled` is tested. `renders all checkbox options` count-assertion is good.                                    |

---

## Fixes Needed

1. **Change story import** from `@adobe/react-spectrum` to `../Checkbox/Checkbox`. _(High — library consistency)_
2. **Add `defaultValue` test** verifying pre-selected items are checked. _(Medium)_
3. **Add multi-selection `onChange` test** (toggle two items, verify array). _(Medium)_
4. **Add `WithError` story.** _(Low)_
