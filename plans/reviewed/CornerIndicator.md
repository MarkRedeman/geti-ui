# CornerIndicator — Peer Review

> **Location:** `packages/ui/src/components/CornerIndicator/CornerIndicator.tsx`

---

## Summary

A simple, well-scoped decorative component. The implementation is clean but the indicator dot is purely visual with no accessible equivalent — screen reader users have no way to know the indicator is active. Tests cover only rendering, not the active/inactive state difference.

---

## 1. Code Quality & Type Safety

### ✅ Positive

- Clean, minimal interface with well-named props.
- Correct use of Spectrum `View` for layout and `isHidden` for conditional visibility.
- No `any` usage.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                             | Location                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| W1  | **`backgroundColor="blue-700"` is hardcoded.** The indicator colour cannot be customised by consumers. A `color` prop (accepting a Spectrum `BackgroundColorValue`) would make this reusable across different notification severities (e.g., warning amber, error red).                                                                                                           | `CornerIndicator.tsx:25`    |
| W2  | **Position of the dot (`top="size-50" right="size-50"`) will overlap the child.** For the default `size-50` (4px) dot this is intentional, but larger children with content near their top-right corner may have the indicator completely hidden behind the content z-index. No `zIndex` is set. ✅ **Partially fixed:** `zIndex: 1` added to the indicator `div`'s inline style. | `CornerIndicator.tsx:19-22` |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Location                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| A1  | **Indicator is invisible to assistive technologies.** The blue dot is `aria-hidden` by default (as a visual-only `View`). When `isActive={true}`, there is no screen-reader-accessible notification that a badge or status indicator is present. The component should accept a `label` prop and render an `aria-live` region or visually-hidden text when `isActive` is true. ✅ **Fixed:** indicator `div` now has `role="status"` and `aria-label="Pending change"` when `isActive={true}`. Label is hardcoded; not yet a configurable prop. | `CornerIndicator.tsx:18-27` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                       | Location                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| A2  | **`isHidden={!isActive}` hides the element from the DOM** (Spectrum's `View isHidden` sets `display: none`), which is correct — hidden elements are properly removed from the accessibility tree. This is a positive implementation detail. | `CornerIndicator.tsx:26` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                    | Location                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| D1  | **JSDoc says "decorative indicator"** but doesn't describe the accessibility gap. The docs should note that consumers must provide contextual information through other means (e.g., tooltip, label on the child) when using this for meaningful status. | `CornerIndicator.tsx:12-14`       |
| D2  | **No `argTypes` in stories.** The meta object has no `argTypes`, so Storybook controls for `isActive` will be auto-detected but not labelled or described.                                                                                               | `CornerIndicator.stories.tsx:5-8` |
| D3  | **No story showing `CornerIndicator` on a realistic child** (e.g., an `ActionButton` or avatar). The current stories use a plain `View` rectangle which doesn't communicate intended usage.                                                              | `CornerIndicator.stories.tsx`     |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                               | Location                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| T1  | **Single render test only.** The test asserts children render but does not test: the indicator's presence/absence based on `isActive`, or the visual (CSS `display`) state difference. ⏳ _Still open — only `isActive={true}` render test exists._ | `CornerIndicator.test.tsx` |
| T2  | **No test for `isActive={false}`** — the component's only conditional behaviour (hiding the indicator) is not verified. ⏳ _Still open._                                                                                                            | `CornerIndicator.test.tsx` |

---

## Specific Fixes Required

1. **Add accessible `label` prop** — when `isActive` is true, render a `<span>` with `className="spectrum-VisuallyHidden"` (or equivalent) announcing the status (e.g., `"Notification pending"`). ✅ **Partially fixed:** indicator has `role="status"` + `aria-label="Pending change"` hardcoded. A configurable `label` prop has not been added yet.
2. **Add `color` prop** (`BackgroundColorValue`) to allow customising the dot colour. ⏳ _Still open — colour is hardcoded to `var(--spectrum-global-color-blue-700)`._
3. **Add `isActive={false}` test** asserting the indicator element is not in the document. ⏳ _Still open._
4. **Add `argTypes`** to stories for `isActive` and the new `color` prop. ⏳ _Still open._
5. **Replace placeholder child** in stories with a realistic element (ActionButton, PhotoPlaceholder, etc.). ⏳ _Still open._
