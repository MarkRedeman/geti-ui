# Review: RadioGroup & Radio

**Files:**

- `packages/ui/src/components/RadioGroup/RadioGroup.tsx`
- `packages/ui/src/components/RadioGroup/Radio.tsx`
  **Reviewed:** 2026-03-06

---

## Summary

RadioGroup and Radio are clean, paired wrappers. Tests are the best in the form-control group — they cover selection, `onChange` payload, and disabled state. Main gap is missing keyboard navigation test (arrow keys within radio group).

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                         |
| --- | -------- | --------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Both have empty `interface` extensions — same pattern as throughout.                                            |
| 1.2 | 🟢 Good  | `Radio` JSDoc correctly states it is "intended to be used inside RadioGroup" — critical guidance for consumers. |
| 1.3 | 🟢 Good  | Both are co-located in `RadioGroup/` which is appropriate since `Radio` has no standalone meaning.              |
| 1.4 | 🟢 Good  | Both exported from `index.ts` with their types.                                                                 |

---

## 2. Accessibility

| #   | Severity   | Finding                                                                                                                                                                        |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | 🟢 Good    | Spectrum renders `role="radiogroup"` on the group and `role="radio"` on each item. Arrow key navigation, `aria-checked`, and `aria-labelledby` are all handled.                |
| 2.2 | 🔴 Missing | **No keyboard navigation test.** The primary keyboard interaction for radio groups is arrow keys to move selection — this is the defining a11y behaviour and should be tested. |
| 2.3 | 🟡 Low     | No test or story for `validationState` / group-level error message.                                                                                                            |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                       |
| --- | -------- | --------------------------------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No `WithError` story (group validation).                                                      |
| 3.2 | 🟡 Low   | No controlled-value story (`value` + `onChange`).                                             |
| 3.3 | 🟢 Good  | `Default`, `DefaultSelected`, `Horizontal`, `Disabled` — same solid pattern as CheckboxGroup. |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                  |
| --- | ---------- | -------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | **No arrow-key navigation test** — pressing ArrowDown should move focus to the next radio and select it. |
| 4.2 | 🔴 Missing | No test that only one radio is selected at a time (clicking a second deselects the first).               |
| 4.3 | 🟢 Good    | `onChange` called with correct string value (`'dogs'`) — the best `onChange` test in the entire group.   |
| 4.4 | 🟢 Good    | `disables all radios when isDisabled` correctly iterates over all.                                       |

---

## Fixes Needed

1. **Add arrow-key navigation test** (`ArrowDown`/`ArrowUp` moves selection). _(High — keyboard a11y)_
2. **Add mutual-exclusion test** — selecting radio B deselects radio A. _(Medium — correctness)_
3. **Add `WithError` story** for group validation. _(Low)_
4. **Add controlled-value story.** _(Low)_
