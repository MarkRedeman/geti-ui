# Groups 9 & 10 — Peer Review Summary

> **Reviewed:** DateField, TimeField, DatePicker, DateRangePicker, Calendar, RangeCalendar, DropZone, PressableElement, CornerIndicator, PhotoPlaceholder, FullscreenAction, MediaViewModes, ToggleButtons, VirtualizedListLayout, VirtualizedHorizontalGrid, IntelBrandedLoading, TreeView, ActionBar
>
> **Date:** 2026-03-06
> **Individual reports:** `reviewed/{ComponentName}.md`

---

## Overall Assessment

The groups are in a **mixed state**. The Spectrum-passthrough components (DateField, DatePicker, Calendar, TreeView, ActionBar) are structurally clean but suffer from a systemic `<any>`-generic anti-pattern and shallow test suites. The custom components (PressableElement, MediaViewModes, VirtualizedListLayout, VirtualizedHorizontalGrid) have more original bugs and — with the notable exception of FullscreenAction — almost no tests. There are also recurring Storybook title inconsistencies and two components with zero stories (MediaViewModes) or zero tests (5 components).

---

## Severity Breakdown

| Severity    | Count   | Components affected                                  |
| ----------- | ------- | ---------------------------------------------------- |
| 🔴 Critical | 22      | All groups                                           |
| 🟡 Warning  | 58      | All groups                                           |
| ✅ Positive | Several | Calendar, ToggleButtons, FullscreenAction, ActionBar |

---

## Cross-Cutting Issues (affects multiple components)

### 1. `<any>` Generic Anti-Pattern — Group 9 only

**Affected:** DateField, TimeField, DatePicker, DateRangePicker, Calendar, RangeCalendar (6 components)

All Spectrum date/time passthrough components use `SomeSpectrumProps<any>` instead of the correct `<T extends DateValue>` / `<T extends TimeValue>` generic. This defeats TypeScript's ability to type-check `value`, `defaultValue`, `onChange`, `minValue`, and `maxValue` — all critical props for date components. **Fix in a single sweep:** replace `<any>` with the appropriate bound generic across all 6 files.

```ts
// Before (all 6 components)
export const DateField = (props: SpectrumDateFieldProps<any>) => ...

// After
export const DateField = <T extends DateValue>(props: SpectrumDateFieldProps<T>) => ...
```

### 2. No Tests — 5 Components

**Affected:** PressableElement, VirtualizedListLayout, VirtualizedHorizontalGrid, TreeView, ActionBar

Five components have **zero test files**. This is the highest-priority backlog item for Group 10. Priority order by complexity and risk:

1. `VirtualizedListLayout` — custom infinite-scroll logic, `@ts-ignore`
2. `PressableElement` — custom prop-filtering, ARIA bugs
3. `VirtualizedHorizontalGrid` — custom `HorizontalLayout` pure logic
4. `TreeView` — keyboard navigation semantics
5. `ActionBar` — bulk-action interaction contract

### 3. `outline: none` Focus Ring Removal

**Affected:** VirtualizedListLayout, VirtualizedHorizontalGrid

Both CSS modules suppress the browser focus ring without providing a `:focus-visible` alternative. This is an accessibility regression affecting all keyboard users.

```css
/* Both modules — before */
.container {
    outline: none;
}

/* Fix */
.container {
    outline: none;
}
.container:focus-visible {
    outline: 2px solid var(--spectrum-focus-ring-color, Highlight);
    outline-offset: 2px;
}
```

### 4. Missing / Zero Stories

**Affected:** MediaViewModes (no stories file), TimeField (stories in wrong location)

`MediaViewModes` has **no Storybook stories at all** — it is completely invisible in the component library documentation. `TimeField` stories exist in `TimeField/` but the implementation is in `DateField/`, creating a structural disconnect.

### 5. Storybook Title Inconsistencies

**Affected:** FullscreenAction (`'Components/...'`), IntelBrandedLoading (`'Components/...'`), ToggleButtons (`'Components/...'`)

Three Group 10 components use `'Components/ComponentName'` as the Storybook title while the rest of Group 10 uses `'Advanced/ComponentName'`. This splits the Advanced section.

**Fix:** Change all three to `title: 'Advanced/{ComponentName}'`.

### 6. Deprecated `validationState` in Stories

**Affected:** DateField, DatePicker, DateRangePicker

All three use `validationState: 'invalid'` in stories, which is deprecated in Spectrum v3. Replace with `isInvalid={true}` / `errorMessage` pattern.

---

## Component-Level Findings at a Glance

| Component                 | Tests         | Stories       | `any`         | Critical a11y          | Notes                           |
| ------------------------- | ------------- | ------------- | ------------- | ---------------------- | ------------------------------- |
| DateField                 | ⚠️ smoke only | ✅            | 🔴            | —                      | TimeField co-located            |
| TimeField                 | 🔴 none       | ⚠️ mislocated | 🔴            | —                      | Implementation/stories split    |
| DatePicker                | ⚠️ smoke only | ✅            | 🔴            | —                      | Width override bug              |
| DateRangePicker           | ⚠️ smoke only | ✅            | 🔴            | —                      | Same width bug                  |
| Calendar                  | ✅ good       | ✅            | 🔴            | —                      | Best tested date component      |
| RangeCalendar             | ✅ good       | ✅            | 🔴            | —                      | No range-specific story         |
| DropZone                  | ⚠️ smoke only | ⚠️            | —             | —                      | No drag test                    |
| PressableElement          | 🔴 none       | ✅            | 🔴 `any` cast | 🔴 nested roles        | Most bugs                       |
| CornerIndicator           | ⚠️ smoke only | ✅            | —             | 🔴 invisible to AT     | Decorative dot has no label     |
| PhotoPlaceholder          | ✅ logic      | ✅            | —             | 🔴 no role/label       | ViewProps<5> type issue         |
| FullscreenAction          | ✅ solid      | ✅            | —             | ⚠️                     | Best overall component          |
| MediaViewModes            | 🔴 none       | 🔴 none       | —             | ⚠️                     | Duplicate icon imports          |
| ToggleButtons             | ✅ solid      | ✅            | —             | 🔴 no group role       | CSS :first-child fragility      |
| VirtualizedListLayout     | 🔴 none       | ✅            | —             | ⚠️ loader as list item | `@ts-ignore`, focus ring        |
| VirtualizedHorizontalGrid | 🔴 none       | ✅            | —             | 🔴 no aria-label       | Trailing gap bug                |
| IntelBrandedLoading       | ✅            | ✅            | —             | 🔴 role conflict       | `role="progressbar"` on `<img>` |
| TreeView                  | 🔴 none       | ⚠️            | —             | —                      | Misplaced import                |
| ActionBar                 | 🔴 none       | ⚠️            | —             | —                      | `console.log` in stories        |

---

## Prioritised Fix List

### P0 — Must fix before next release (correctness/accessibility regressions)

1. **PressableElement**: Remove `role="button"` + `tabIndex={0}` from inner `div` — creates nested interactive roles that break screen readers.
2. **IntelBrandedLoading**: Fix `role="progressbar"` on `<img>` — semantically incorrect, `alt` and `role` conflict.
3. **VirtualizedHorizontalGrid**: Add `aria-label` prop — `ListBox` without a label is inaccessible.
4. **CornerIndicator**: Add visually-hidden label when `isActive` — indicator is completely invisible to AT.
5. **PhotoPlaceholder**: Add `role="img"` + `aria-label` — avatar has no accessible name.
6. **VirtualizedListLayout / VirtualizedHorizontalGrid**: Restore `:focus-visible` focus ring in CSS modules.

### P1 — High value, low risk (type safety, structural)

7. **All 6 date/time components**: Replace `<any>` with proper `<T extends DateValue>` / `<T extends TimeValue>` generics.
8. **DatePicker / DateRangePicker**: Fix width prop-override order (`{...props} width={props.width ?? 'size-2400'}`).
9. **TimeField**: Create `TimeField/TimeField.tsx` barrel and add test file.
10. **MediaViewModes**: Fix duplicate icon imports (all 3 grid modes use `ViewGrid`).
11. **ToggleButtons**: Add `role="group"` + `aria-label` prop to wrapper `Flex`.
12. **VirtualizedListLayout**: Replace `@ts-ignore` with typed cast + TODO comment.

### P2 — Test coverage (5 missing test files)

13. Create `VirtualizedListLayout.test.tsx`
14. Create `PressableElement.test.tsx`
15. Create `VirtualizedHorizontalGrid.test.tsx` + `HorizontalLayout.test.ts`
16. Create `TreeView.test.tsx`
17. Create `ActionBar.test.tsx`
18. Create `MediaViewModes.test.tsx`

### P3 — Documentation and story polish

19. Fix Storybook titles: FullscreenAction, IntelBrandedLoading, ToggleButtons → `'Advanced/...'`
20. Replace `validationState` with `isInvalid` in DateField/DatePicker/DateRangePicker stories
21. Fix misplaced `import` in `TreeView.stories.tsx` (line 28)
22. Replace `console.log` with `fn()` in `ActionBar.stories.tsx`
23. Create `MediaViewModes.stories.tsx`
24. Add `WithMinMax` stories to Calendar and RangeCalendar
25. Add `InfiniteScroll` story to VirtualizedListLayout
26. Add `HorizontalLayoutOptions` JSDoc

---

## Key Architectural Observations

1. **The `<any>` date generic is a systemic policy failure.** All 6 date/time components have the same error, suggesting the fix was deliberately deferred. A single PR can fix all of them.

2. **PressableElement is the most risky component.** It has custom prop-filtering with `any` casts, broken ARIA semantics, no tests, and a misleading stories example. It needs the most attention.

3. **MediaViewModes has a silent bug** (3 icons resolving to the same import) that would only be discovered visually — a good argument for Storybook screenshot tests.

4. **HorizontalLayout.ts is the highest-quality custom logic** in the group and deserves dedicated unit tests independent of React — the pure functions (`getLayoutInfo`, `getContentSize`, `getVisibleLayoutInfos`) are easily testable.

5. **FullscreenAction is the best-implemented non-trivial component** — solid tests, correct ARIA, a thoughtful ref-forwarding API, and good Storybook coverage. It serves as a reference for what the other components should aspire to.
