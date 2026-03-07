# VirtualizedHorizontalGrid — Peer Review

> **Location:** `packages/ui/src/components/VirtualizedHorizontalGrid/VirtualizedHorizontalGrid.tsx`
> **Layout:** `packages/ui/src/components/VirtualizedHorizontalGrid/HorizontalLayout.ts`

---

## Summary

`VirtualizedHorizontalGrid` is a well-implemented custom-layout virtualized component. `HorizontalLayout.ts` is the most sophisticated piece of custom logic in the entire group — well-structured and well-commented. Issues centre on: no test coverage, the `AriaComponentsListBox` missing an `aria-label`, `outline: none` removing the focus ring, and the layout class exposing internal state as `protected` (minor).

---

## 1. Code Quality & Type Safety

### ✅ Positive

- `HorizontalLayout` correctly extends RAC's `Layout` class with all required methods.
- `getVisibleLayoutInfos` correctly handles persisted keys (focused items) outside the visible range — a subtle correctness requirement that is properly addressed.
- Generic `<T,>` with explicit trailing comma (TypeScript JSX disambiguation) is correct.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                     | Location                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| W1  | **`HorizontalLayout` class uses `protected` for `gap`, `size`, `overscan`** — these fields could be `private` since no subclassing is expected. `protected` implies a public inheritance surface that isn't documented.                                                                   | `HorizontalLayout.ts:15-17` |
| W2  | **`DEFAULT_OVERSCAN = 0`** means no items are pre-rendered beyond the visible area. For fast scrolling this will cause flicker as the browser races with the layout engine. A default of `1`–`2` is typical for horizontal carousels.                                                     | `HorizontalLayout.ts:6`     |
| W3  | **`getContentSize` includes item `gap` in the total width** (`numItems * sizeWithGap`), which means the last item has a trailing gap. This is a minor layout precision issue — the content will be slightly wider than needed. Fix: `(numItems * sizeWithGap) - gap` when `numItems > 0`. | `HorizontalLayout.ts:80-82` |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                         | Location                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| A1  | **`AriaComponentsListBox` has no `aria-label`.** The `VirtualizedHorizontalGrid` accepts no `ariaLabel` / `aria-label` prop and passes none to the inner `ListBox`. A list without a label is inaccessible — screen readers will announce "list" with no context. Add an `aria-label` prop to `VirtualizedHorizontalGridProps`. ⏳ _Still open — no `aria-label` prop added._ | `VirtualizedHorizontalGrid.tsx:41`       |
| A2  | **`outline: none` on the container** removes the keyboard focus ring with no replacement. ⏳ _Still open._                                                                                                                                                                                                                                                                    | `VirtualizedHorizontalGrid.module.css:6` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                          | Location                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| A3  | **`orientation="horizontal"` is set on `ListBox`** — this correctly tells screen readers the list is horizontal, which changes keyboard navigation expectations (Left/Right arrows). This is correct and good. | `VirtualizedHorizontalGrid.tsx:41` |
| A4  | **No `selectionMode` exposed.** The `ListBox` has no `selectionMode` set, defaulting to none. If selection is desired (e.g. "currently playing" thumbnail in a carousel), there is no way to express it.       | `VirtualizedHorizontalGrid.tsx:41` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                    | Location                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| D1  | **`listBoxItemStyles` prop is documented** but its interaction with the `HorizontalLayout` item size is not. If `listBoxItemStyles` sets a width different from `layoutOptions.size`, items will be mis-sized. Document this constraint. | `VirtualizedHorizontalGrid.tsx:22`      |
| D2  | **`HorizontalLayoutOptions` has no JSDoc** on its properties. `gap`, `size`, and `overscan` should have descriptions explaining units (pixels) and defaults.                                                                             | `HorizontalLayout.ts:8-12`              |
| D3  | **No `EmptyState` or `Narrow` story** demonstrating edge cases.                                                                                                                                                                          | `VirtualizedHorizontalGrid.stories.tsx` |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                             | Location                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| T1  | **No test file.** `VirtualizedHorizontalGrid` has no `.test.tsx`. ⏳ _Still open._                                                                                                                                | `VirtualizedHorizontalGrid/` directory |
| T2  | **`HorizontalLayout.ts` has no unit tests.** The custom layout class has pure logic (`getLayoutInfo`, `getVisibleLayoutInfos`, `getContentSize`) that can be unit-tested independently of React. ⏳ _Still open._ | `HorizontalLayout.ts`                  |

---

## Specific Fixes Required

1. **Add `aria-label` prop** to `VirtualizedHorizontalGridProps` and pass it to `AriaComponentsListBox`. ⏳ _Still open._
2. **Restore focus ring** in CSS: replace `outline: none` with `outline: none` only for mouse, preserving `:focus-visible`. ⏳ _Still open._
3. **Fix trailing gap** in `getContentSize`: `numItems > 0 ? numItems * sizeWithGap - gap : 0`. ⏳ _Still open._
4. **Increase `DEFAULT_OVERSCAN` to 1 or 2** to reduce scroll flicker. ⏳ _Still open._
5. **Add `aria-label` prop to `HorizontalLayoutOptions`** JSDoc. ⏳ _Still open._
6. **Create `VirtualizedHorizontalGrid.test.tsx`** and a `HorizontalLayout.test.ts` for pure layout logic. ⏳ _Still open._
7. **Add `EmptyState` story**. ⏳ _Still open._
