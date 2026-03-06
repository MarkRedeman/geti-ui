# ActionBar — Peer Review

> **Location:** `packages/ui/src/components/ActionBar/ActionBar.tsx`

---

## Summary

`ActionBar` and `ActionBarContainer` are correct, minimal Spectrum passthroughs with proper generic typing. The main concern is the complete absence of tests and the single story using `console.log` for callbacks. The `Key` import in stories comes from `react-aria-components` rather than the more specific `react-stately` type, which is a minor inconsistency.

---

## 1. Code Quality & Type Safety

### ✅ Positive

- Generic `<T extends object>` correctly applied to `ActionBar`.
- Both components and both types are exported cleanly.
- No `any` usage.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                      | Location                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| W1  | **`Key` imported from `react-aria-components`** in stories. For `ActionBar.onAction`, the `Key` type comes from `@react-types/shared` or `react-stately`. While `react-aria-components` re-exports `Key`, it's semantically cleaner to import it from the same package that `SpectrumActionBarProps` uses. | `ActionBar.stories.tsx:7`  |
| W2  | **`ActionBarContainer` accepts `SpectrumActionBarContainerProps`** which has a `height` constraint. This is a common gotcha — if no `height` is set on the container, the `ActionBar` may not display correctly. The JSDoc and stories should document this requirement.                                   | `ActionBar.stories.tsx:18` |

---

## 2. Accessibility

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                          | Location                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| A1  | **No test for `aria-label` on `ActionBar`.** The Spectrum `ActionBar` requires an accessible label (or the count indicator provides context). Tests should verify screen reader users understand "2 items selected" and the available actions. | —                          |
| A2  | **`selectedItemCount` in stories is hardcoded to `2`** without showing the dynamic pattern. The ActionBar's key a11y feature — announcing how many items are selected — is not demonstrated dynamically.                                       | `ActionBar.stories.tsx:25` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                            | Location                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| D1  | **Stories use `console.log`** for `onAction` and `onClearSelection`. Per good Storybook practice, these should use `fn()` from `@storybook/test` so actions are captured in the Actions panel.                   | `ActionBar.stories.tsx:26-27` |
| D2  | **No `argTypes`** in stories meta. `selectedItemCount`, `isEmphasized`, and `onAction` are important props that should have controls.                                                                            | `ActionBar.stories.tsx:9-13`  |
| D3  | **Only one story.** Missing: `WithAllSelected`, `Emphasized`, `SingleItem`, `IsOpen/IsClosed` controlled states.                                                                                                 | `ActionBar.stories.tsx`       |
| D4  | **`ActionBarContainer` JSDoc** mentions "wraps a component that supports selection" — could clarify that it specifically works with `ListView` and `TableView` and that the height must be set on the container. | `ActionBar.tsx:15-16`         |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                             | Location               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| T1  | **No test file.** `ActionBar` has no `.test.tsx`. Given that this component's primary purpose is bulk-action UX, tests should verify: ActionBar appears when items are selected, `onAction` fires with the correct key, `onClearSelection` fires, and `selectedItemCount` is correctly displayed. | `ActionBar/` directory |

---

## Specific Fixes Required

1. **Create `ActionBar.test.tsx`** with: ActionBar renders with selected count, `onAction` callback with key, `onClearSelection` callback, and keyboard activation of an action.
2. **Replace `console.log`** in stories with `fn()` from `@storybook/test`.
3. **Add `argTypes`** for `selectedItemCount`, `isEmphasized`, `onAction`.
4. **Add `Emphasized`, `SingleItem`, and dynamic-selection stories.**
5. **Document `ActionBarContainer` height requirement** in JSDoc.
