# PressableElement — Peer Review

> **Location:** `packages/ui/src/components/PressableElement/PressableElement.tsx`

---

## Summary

`PressableElement` is a non-trivial custom component that bridges `react-aria-components`' `Pressable` with Adobe Spectrum's style props. It contains several serious concerns: use of `any`, a manual prop-filtering loop that is fragile, a hardcoded `role="button"` on the inner `div` that creates a duplicate interactive role, and no tests at all.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                                | Location                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| C1  | **`any` cast on `pressableProps`.** Lines 31–36 build a `pressableProps: any` object with explicit `(props as any)[key]` casts. This is a complete type-safety escape hatch in a component that could instead use a proper `Pick` or `Omit` utility type.                                                                                            | `PressableElement.tsx:31-36` |
| C2  | **Duplicate interactive role.** The inner `<div>` has `role="button"` hardcoded while being wrapped in `<Pressable>`. React Aria's `Pressable` already renders an element with press semantics. Adding a second `role="button"` inside it creates a nested interactive element, which violates ARIA rules (interactive controls must not be nested). | `PressableElement.tsx:47`    |
| C3  | **`tabIndex={0}` on inner `div`** creates a second focusable element inside `Pressable`. The outer `Pressable` element is already focusable. This results in two tab stops for a single logical control.                                                                                                                                             | `PressableElement.tsx:48`    |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                 | Location                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| W1  | **Manual prop-filtering with `stylePropKeys` is fragile.** This custom loop (`propsToOmit`) duplicates what a clean `Omit<PressableElementProps, keyof StyleProps>` type pattern could achieve. If `@react-spectrum/utils`' `viewStyleProps` keys change, the filter silently breaks. | `PressableElement.tsx:20-36` |
| W2  | **`onDoubleClick` is a React synthetic event handler**, not a react-aria press handler. Using `onDoubleClick` alongside `Pressable` may not work correctly in all environments (e.g., touch devices). Consider using `react-aria`'s `useLongPress` or documenting the limitation.     | `PressableElement.tsx:9,46`  |
| W3  | **`UNSAFE_className` and `UNSAFE_style` are in `propsToOmit`** but they are part of `StyleProps` and already handled by `useStyleProps`. The explicit addition to the omit list is redundant and confusing.                                                                           | `PressableElement.tsx:21`    |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                    | Location                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| A1  | **Nested interactive roles.** `<Pressable>` renders a focusable element with implicit button semantics; `<div role="button" tabIndex={0}>` inside it is a second interactive element. Screen readers will announce both. Remove `role="button"` and `tabIndex={0}` from the inner `div`. | `PressableElement.tsx:41-49` |
| A2  | **No `aria-label` prop or documentation.** Since the component wraps arbitrary children, a consumer passing only icon children (no text) will produce an unlabelled button. The interface should include an optional `aria-label` forwarded to `Pressable`.                              | `PressableElement.tsx:6-11`  |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                           | Location                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| D1  | **No usage guidance in JSDoc.** The JSDoc mentions "combines react-aria-components' Pressable with Spectrum's style props" but doesn't explain _when_ to use this vs. a plain `ActionButton`, or what the `isTruncated` prop actually does visually.                                                                            | `PressableElement.tsx:23-26`         |
| D2  | **`Truncated` story will visually truncate** the _outer_ container (width `size-1200`) but the inner `View`/`Text` will still overflow — the CSS truncation applies to the outer `div` wrapping the children. The story should demonstrate text directly in `PressableElement` without a nested `View`, or explain the pattern. | `PressableElement.stories.tsx:24-33` |
| D3  | **No `WithAriaLabel` story** demonstrating icon-only usage with an accessible label.                                                                                                                                                                                                                                            | `PressableElement.stories.tsx`       |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                          | Location                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| T1  | **No test file.** `PressableElement` has no `PressableElement.test.tsx`. A component with custom prop-filtering logic, CSS truncation behaviour, and press/double-click semantics absolutely needs unit tests. | `PressableElement/` directory |

---

## Specific Fixes Required

1. **Remove `role="button"` and `tabIndex={0}` from the inner `div`.** Let `Pressable` own the interactive semantics.
2. **Add `aria-label` to `PressableElementProps`** and forward it to `<Pressable>`.
3. **Replace `any` prop-filtering loop** with a typed Omit/Pick approach or use a utility like `splitProps` from Spectrum utils.
4. **Create `PressableElement.test.tsx`** with: render test, `onPress` callback test, `onDoubleClick` callback test, `isTruncated` CSS application test, and keyboard (`Enter`/`Space`) press test.
5. **Document `onDoubleClick` limitation** for touch environments.
