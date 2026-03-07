# MediaViewModes — Peer Review

> **Location:** `packages/ui/src/components/MediaViewModes/MediaViewModes.tsx`
> **Utils:** `packages/ui/src/components/MediaViewModes/utils.ts`

---

## Summary

`MediaViewModes` is a well-structured component with good prop design. The main issues are: three icon imports all resolving to the same `ViewGrid` component (meaning grid/medium/small modes are visually identical), a `string` key comparison that defeats the purpose of an enum, and no tests or stories for the component at all.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Location                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| C1  | **All three grid modes use the same icon.** `GridSmall`, `GridMedium`, and `Grid` all import from `@spectrum-icons/workflow/ViewGrid`. The three modes (`SMALL`, `MEDIUM`, `LARGE`) are visually indistinguishable in the toolbar. The `SMALL` mode should likely use `ViewSingle` or a smaller grid icon, and `LARGE` should use something distinct. ✅ **Fixed:** `SMALL` → `ViewGrid`, `MEDIUM` → `ModernGridView`, `LARGE` → `ClassicGridView`, `DETAILS` → `ViewList`. `ICON_PER_MODE` map used. | `MediaViewModes.tsx:4-6` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Location                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| W2  | **Key comparison uses `.toLocaleLowerCase()` on enum values.** `ViewModes` enum values are full display strings (`'Large thumbnails'`, `'Details'`, etc.). The `.toLocaleLowerCase()` transformation converts them to `'large thumbnails'`, `'details'`, etc. for key matching. This is fragile: if enum values contain locale-sensitive characters, `toLocaleLowerCase()` may behave differently across locales. Use the enum value directly as the key: `<Item key={item}>`. ⏳ _Still open — `.toLocaleLowerCase()` still used throughout `MediaViewModes.tsx`._ | `MediaViewModes.tsx:36,51,53`          |
| W3  | **`setViewMode` prop type** includes `Dispatch<SetStateAction<ViewModes>>` — this is an implementation detail of `useState` leaking into the public API. The simpler `(viewMode: ViewModes) => void` signature is sufficient and more general. ⏳ _Still open — type is a union of `Dispatch<SetStateAction<ViewModes>>` and `(viewMode: ViewModes) => void` (union allows either, but still exposes `Dispatch`)._                                                                                                                                                  | `MediaViewModes.tsx:26`                |
| W4  | **`VIEW_MODE_LABEL` constant** (`'View mode'`) is used as the tooltip text but is exported from `utils.ts` only to be used in one place. This indirection adds no value.                                                                                                                                                                                                                                                                                                                                                                                            | `MediaViewModes.tsx:49`, `utils.ts:12` |

---

## 2. Accessibility

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                  | Location                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| A1  | **`MenuTrigger` wraps `TooltipTrigger` which wraps `ActionButton`.** This nesting — `MenuTrigger > TooltipTrigger > ActionButton` — may cause issues because `TooltipTrigger` must be a direct child of a trigger context. Spectrum's `MenuTrigger` expects its first child to be a pressable trigger. Wrapping with `TooltipTrigger` may interfere with the menu trigger propagation. | `MediaViewModes.tsx:44-51` |
| A2  | **`Menu` has `selectionMode="single"` but `selectedKeys` uses lowercased values** while `Item` keys are also lowercased. This should work, but a `defaultSelectedKeys` is not set, meaning if `viewMode` changes externally the menu may not reflect the selection correctly.                                                                                                          | `MediaViewModes.tsx:51-56` |
| A3  | **No `aria-label` on the `Menu` itself.** Spectrum `Menu` without an `aria-label` relies on the trigger's label for context. This is acceptable here (trigger has `aria-label="View mode"`), but should be documented.                                                                                                                                                                 | `MediaViewModes.tsx:51`    |

---

## 3. Documentation

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                    | Location                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| D1  | **No stories file.** `MediaViewModes` has no `.stories.tsx` file. It is one of only two components in the reviewed groups without any Storybook story. ⏳ _Still open — no `.stories.tsx` file created._ | `MediaViewModes/` directory |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                            | Location      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| D2  | **`VIEW_MODE_KEY` is exported from `utils.ts`** but is not used within the component. Its intended use (persisting view mode to `localStorage` or URL params) is not documented. | `utils.ts:13` |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                      | Location                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| T1  | **No test file.** `MediaViewModes` has no `.test.tsx` file. There is zero test coverage for: rendering, menu opening, selecting a mode, `isDisabled` behaviour, or the `items` subset prop. ⏳ _Still open — no `.test.tsx` file created._ | `MediaViewModes/` directory |

---

## Specific Fixes Required

1. **Fix icon imports**: assign distinct icons for `SMALL`, `MEDIUM`, `LARGE` modes (e.g., `ViewSingle`, `ViewColumn`, `ViewGrid`). ✅ **Fixed:** `ViewGrid` (SMALL), `ModernGridView` (MEDIUM), `ClassicGridView` (LARGE), `ViewList` (DETAILS).
2. **Use enum values directly as Item keys**: remove all `.toLocaleLowerCase()` transformations from key generation and comparison. ⏳ _Still open._
3. **Simplify `setViewMode` prop type** to `(viewMode: ViewModes) => void`. ⏳ _Still open — currently a union type._
4. **Create `MediaViewModes.stories.tsx`** with `Default`, `Disabled`, and `SubsetOfModes` stories, showing `useState` wiring. ⏳ _Still open._
5. **Create `MediaViewModes.test.tsx`** covering: render, menu opens on click, selecting a mode calls `setViewMode`, `isDisabled` prevents menu opening. ⏳ _Still open._
6. **Verify `MenuTrigger > TooltipTrigger > ActionButton` nesting** works correctly in Spectrum and document any limitations. ⏳ _Still open._
