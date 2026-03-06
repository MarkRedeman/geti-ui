# VirtualizedListLayout — Peer Review

> **Location:** `packages/ui/src/components/VirtualizedListLayout/VirtualizedListLayout.tsx`

---

## Summary

`VirtualizedListLayout` is the most architecturally sophisticated component in this group. It correctly uses `react-aria-components`' `Virtualizer`+`ListBox` pattern with `useLoadMore` for infinite scroll. Quality is high but there are several noteworthy issues: a `@ts-ignore` suppression, a hardcoded `selectionMode="single"` that may not match all use cases, the loader item appearing as an accessible list item, and no tests at all.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                              | Location                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| C1  | **`// @ts-ignore` comment.** Line 59 suppresses a TypeScript error on `useLoadMore`. This is a code smell that should be replaced with either a proper type cast, a type override, or a comment explaining the specific incompatibility and linking to the upstream issue. Blanket `@ts-ignore` hides regressions. | `VirtualizedListLayout.tsx:59` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                    | Location                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| W1  | **`selectionMode="single"` is hardcoded.** The `selected` prop accepts a `Selection` object which supports multi-selection, but the `ListBox` is locked to `"single"`. A consumer wanting multi-select (e.g., for a media gallery with batch operations) cannot use this component. Add `selectionMode` to `VirtualizedListLayoutProps`. | `VirtualizedListLayout.tsx:68` |
| W2  | **Loader item has `id="loader"` and `textValue="loading"`.** If multiple instances of `VirtualizedListLayout` are on the same page, the non-unique `id="loader"` creates duplicate DOM IDs. Use a more unique ID (e.g., `__loader__` or a symbol-based key).                                                                             | `VirtualizedListLayout.tsx:83` |
| W3  | **`containerHeight` defaults to `undefined`** — if not provided, `View` has no height and the virtualizer has no space to render items. This should have a sensible default or a required prop. The JSDoc should note that `containerHeight` must be set.                                                                                | `VirtualizedListLayout.tsx:52` |

---

## 2. Accessibility

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                      | Location                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| A1  | **Loader `ListBoxItem` with `textValue="loading"` is announced to screen readers as a selectable list item.** A user navigating through the list will hear "loading" as if it's a selectable option. The loader should be rendered outside the list, or given `role="none"` (which ListBoxItem may not support). Consider using `renderLoading` outside the `AriaComponentsListBox` scope. | `VirtualizedListLayout.tsx:82-86`    |
| A2  | **`ariaLabel` prop is a string** — the JSDoc correctly labels it as an accessibility label, but the prop is named `ariaLabel` rather than `aria-label`. Using the standard HTML attribute name `aria-label` would be more conventional and match how RAC components consume the prop.                                                                                                      | `VirtualizedListLayout.tsx:24,70`    |
| A3  | **`outline: none` in CSS** removes the focus ring on the list container. This is a common accessibility regression — the `:focus-visible` ring must be preserved for keyboard users.                                                                                                                                                                                                       | `VirtualizedListLayout.module.css:9` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                           | Location                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| D1  | **`layoutOptions` is required** but `ListLayoutOptions` from `react-aria-components` has no per-component documentation in the stories. The `Default` story hardcodes `rowHeight: 60` without explaining what other options are available. Add a JSDoc `@example` or an `argTypes` description. | `VirtualizedListLayout.stories.tsx:33` |
| D2  | **`onLoadMore` not demonstrated in stories.** The infinite-scroll use case is the main value proposition of this component but no story shows it in action.                                                                                                                                     | `VirtualizedListLayout.stories.tsx`    |
| D3  | **No `EmptyState` story.** What happens when `items` is empty? An empty `ListBox` with no visual indication is a common oversight.                                                                                                                                                              | `VirtualizedListLayout.stories.tsx`    |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                  | Location                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| T1  | **No test file.** `VirtualizedListLayout` has no `.test.tsx`. This is a complex component with multiple behaviours (virtualization, infinite scroll, selection, loading state) and zero test coverage. | `VirtualizedListLayout/` directory |

---

## Specific Fixes Required

1. **Replace `@ts-ignore`** with a proper type assertion and a `// TODO` comment referencing the upstream issue.
2. **Add `selectionMode` prop** to allow single/multiple/none selection modes.
3. **Fix duplicate `id="loader"`** — use a generated unique ID or a reserved symbol string.
4. **Move loader outside `ListBox`** to prevent it appearing as a selectable list item to screen readers.
5. **Rename `ariaLabel` to `aria-label`** for convention consistency.
6. **Restore focus ring**: replace `outline: none` with `outline: none; :focus-visible { outline: auto; }` in the CSS module.
7. **Create `VirtualizedListLayout.test.tsx`** covering: items render, loading state, empty state, `onLoadMore` trigger, and selection callback.
8. **Add `InfiniteScroll` and `EmptyState` stories**.
