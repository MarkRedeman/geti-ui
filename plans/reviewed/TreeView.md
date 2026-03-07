# TreeView — Peer Review

> **Location:** `packages/ui/src/components/TreeView/TreeView.tsx`

---

## Summary

`TreeView` is the simplest component in this group — a one-line Spectrum passthrough. It is correctly implemented as a generic. The issues are entirely in the stories file, which contains a structural bug (import at the bottom), uses the deprecated `Item` API, and provides no tests.

---

## 1. Code Quality & Type Safety

### ✅ Positive

- Generic `<T extends object>` is correctly applied, unlike the date/time components.
- Clean, minimal implementation with no `any` usage.
- `TreeViewProps` correctly re-exported.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                      | Location                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| W1  | **Stories file has a misplaced import.** `import { Text } from '@adobe/react-spectrum';` appears on line 28 — _after_ the `export const Default` story and outside any valid module scope position. While JavaScript/TypeScript hoists all `import` declarations, this is a clear accidental placement that will confuse linters and readers. The import should be at the top of the file. | `TreeView.stories.tsx:28`   |
| W2  | **Stories use `Item` from `@adobe/react-spectrum`** but `SpectrumTreeViewProps` uses `TreeViewItem` (not `Item`) as its canonical child component in Spectrum v3. Using `Item` inside `TreeView` may work in some versions but is not the typed-safe API.                                                                                                                                  | `TreeView.stories.tsx:3,17` |

---

## 2. Accessibility

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                   | Location               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| A1  | **No keyboard navigation test.** TreeView navigation involves: arrow keys (expand/collapse/navigate nodes), Enter (activate), and potentially typing to search. None of this is tested. | —                      |
| A2  | **No `isDisabled` or `disabledKeys` story.** Disabled tree nodes require special handling (they must remain focusable but not activatable).                                             | `TreeView.stories.tsx` |

---

## 3. Documentation

### 🔴 Critical

| #   | Issue                                                                                                               | Location                  |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| D1  | **Misplaced `import` in stories file** (line 28) — this is a syntax quality issue that should be immediately fixed. | `TreeView.stories.tsx:28` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                    | Location                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| D2  | **No `argTypes` in meta.** The `SpectrumTreeViewProps` has several useful props (`selectionMode`, `expandedKeys`, `disabledKeys`, `onAction`) that aren't exposed as Storybook controls. | `TreeView.stories.tsx:5-8` |
| D3  | **Only one story (`Default`).** Missing: `MultiSelect`, `ExpandedByDefault`, `WithActions`, `Disabled`.                                                                                  | `TreeView.stories.tsx`     |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                     | Location              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| T1  | **No test file.** `TreeView` has no `.test.tsx`. A hierarchical component with expand/collapse semantics, keyboard navigation, and selection needs tests. | `TreeView/` directory |

---

## Specific Fixes Required

1. **Move the misplaced `import { Text }` to the top of `TreeView.stories.tsx`** (line 28 → line 3).
2. **Replace `Item` with `TreeViewItem`** (or `Item` from the correct namespace for tree views) in stories.
3. **Create `TreeView.test.tsx`** with: render test, expand/collapse interaction, keyboard navigation (ArrowDown, ArrowRight), and `onAction` callback test.
4. **Add `argTypes`** to stories meta for `selectionMode`, `onAction`, `disabledKeys`.
5. **Add `MultiSelect`, `WithActions`, `DisabledKeys` stories.**
