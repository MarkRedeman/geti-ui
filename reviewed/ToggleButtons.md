# ToggleButtons — Peer Review

> **Location:** `packages/ui/src/components/ToggleButtons/ToggleButtons.tsx`

---

## Summary

`ToggleButtons` is the best-tested component in Group 10 with four meaningful test cases covering rendering, selection state, interaction, and disabled behaviour. The implementation is clean and generic. Key issues are: missing ARIA group role (the container is not announced as a group/toolbar), missing keyboard navigation between buttons, and a CSS class naming issue in the module.

---

## 1. Code Quality & Type Safety

### ✅ Positive

- Generic `<T extends string | number>` is correctly applied.
- `aria-pressed` is correctly used on individual buttons to reflect selection state.
- `getLabel` render prop is clean and flexible.
- CSS module is used correctly per conventions.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                | Location                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| W1  | **CSS module first-child/last-child selectors are brittle.** The `.toggleButton` CSS uses `:first-child` and `:last-child` but these selectors target the _first child of the parent element_ in the DOM, not the first `ToggleButton` within the group. If Spectrum's `Button` component adds wrapper elements, these selectors will not match correctly. Use a CSS-in-JS approach, or add explicit `isFirst`/`isLast` class names from the parent. | `ToggleButtons.module.css:11-19` |
| W2  | **`border-right-color: transparent !important`** uses `!important`. This is a smell that indicates the specificity battle isn't won cleanly. Consider targeting the Spectrum border token variable directly.                                                                                                                                                                                                                                         | `ToggleButtons.module.css:7-8`   |
| W3  | **Internal `ToggleButtonProps` interface is not exported.** This is fine for an internal component, but it means `ToggleButton` (the internal component) cannot be easily tested in isolation.                                                                                                                                                                                                                                                       | `ToggleButtons.tsx:11-17`        |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                      | Location               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| A1  | **No group role or accessible label.** The wrapping `<Flex>` has no `role="group"` or `role="toolbar"` and no `aria-label`. Screen reader users have no context for what these toggle buttons collectively represent. Add `role="group"` and an `aria-label` prop to `ToggleButtonsProps`. | `ToggleButtons.tsx:66` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                            | Location                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| A2  | **No keyboard navigation between buttons.** Standard toolbar/group keyboard behaviour specifies that Arrow keys should move focus between buttons within the group. Currently each button is individually Tab-focusable, which is verbose. Consider implementing `roving tabIndex` or using `react-aria`'s `useListBox` / `FocusScope` with arrow-key navigation.                | `ToggleButtons.tsx:66-79` |
| A3  | **`aria-pressed` on a Spectrum `Button`** is correct (Spectrum passes through ARIA attributes), but the test on line 31 asserts `toHaveAttribute('aria-pressed', 'true')` — this is a string comparison and works, but `aria-pressed={false}` will be `"false"` as a string. TypeScript and React handle this correctly (`false` → `"false"` attribute). Verified: this is fine. | `ToggleButtons.tsx:28`    |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                               | Location                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| D1  | **Storybook title is `'Components/ToggleButtons'`** — other custom UI components in this group use `'Advanced/...'` or `'Components/...'`. This should be `'Advanced/ToggleButtons'` for consistency with the majority of Group 10. | `ToggleButtons.stories.tsx:9`     |
| D2  | **No `aria-label` demonstrated in stories.** Given the missing group role/label issue, no story shows the correct accessible usage.                                                                                                 | `ToggleButtons.stories.tsx`       |
| D3  | **`Disabled` story uses static args** without `render`. Since `onOptionChange` is not wired up, the disabled story is effectively non-interactive even when enabled — but for disabled this is acceptable.                          | `ToggleButtons.stories.tsx:53-59` |

---

## 4. Tests

### ✅ Positive

- Four tests covering the most important behaviours.
- Correct use of `aria-pressed` attribute assertion.
- Disabled state interaction test is a good pattern.

### 🟡 Warnings

| #   | Issue                                                                                                                                                         | Location                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| T1  | **No keyboard navigation test.** Given the potential for arrow-key implementation, at minimum a test should verify Tab navigates to each button individually. | `ToggleButtons.test.tsx`         |
| T2  | **No test for `getLabel` prop.** The custom label renderer has no coverage.                                                                                   | `ToggleButtons.test.tsx`         |
| T3  | **`rstest.fn()` usage** — same question as Calendar: verify this is the correct mock API for this project.                                                    | `ToggleButtons.test.tsx:5,38,50` |

---

## Specific Fixes Required

1. **Add `aria-label` prop** to `ToggleButtonsProps` and apply `role="group" aria-label={ariaLabel}` to the wrapping `<Flex>`.
2. **Review CSS first-child/last-child selectors** — verify they work with Spectrum's Button DOM output, and remove `!important`.
3. **Fix Storybook title** to `'Advanced/ToggleButtons'`.
4. **Add `getLabel` test** verifying custom labels render correctly.
5. **Add keyboard navigation test** (Tab between buttons reaches each one).
