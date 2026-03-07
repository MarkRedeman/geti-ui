# DropZone — Peer Review

> **Location:** `packages/ui/src/components/DropZone/DropZone.tsx`

---

## Summary

An extremely thin Spectrum passthrough with one meaningful gap: the lack of any drag-and-drop interaction test. The DropZone component's value to consumers is entirely in its drag interaction behaviour, which is not tested at all.

---

## 1. Code Quality & Type Safety

### ✅ Positive

- Correct use of `SpectrumDropZoneProps` without the `<any>` anti-pattern (not a generic component).
- Clean single-responsibility implementation.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                 | Location    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| W1  | **No `index.ts` barrel.** Unlike some other components, there is no `index.ts` re-export in the `DropZone/` directory. This is consistent with most components in the repo, so minor. | `DropZone/` |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                    | Location                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| A1  | **No `aria-label` or `isFilled` accessibility story/test.** Spectrum's `DropZone` exposes `isFilled` state which changes the visual and accessible state of the element. Consumers need to know to provide an accessible label (via `IllustratedMessage` children or `aria-label` on a trigger). None of this is demonstrated or tested. | `DropZone.stories.tsx`, `DropZone.test.tsx` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                 | Location                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| A2  | **Only text content in the Default story.** `DropZone` is intended to contain an `IllustratedMessage` with a visual call-to-action. The story using plain text `'Drop files here'` is misleading about correct usage. | `DropZone.stories.tsx:16-18` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                       | Location               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| D1  | **No `FilledState` story.** The `isFilled` prop (which shows a "filled" visual state) is listed in `argTypes` but there is no dedicated story demonstrating it.                                                             | `DropZone.stories.tsx` |
| D2  | **No `WithFileTrigger` story.** The canonical usage pattern for `DropZone` in Spectrum pairs it with a `FileTrigger` for click-to-browse. No story demonstrates this.                                                       | `DropZone.stories.tsx` |
| D3  | **No `onDrop` handling shown.** The stories have no `onDrop` callback, so Storybook shows a non-functional component. A story demonstrating `onDrop` with a console action would significantly improve documentation value. | `DropZone.stories.tsx` |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                  | Location            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| T1  | **Only smoke test.** The test renders and checks text is present — it doesn't test: `onDrop` callback firing, `isFilled` visual state change, `isDisabled` blocking drops, or keyboard accessibility (Tab to focus, Space to trigger). | `DropZone.test.tsx` |
| T2  | **`@testing-library/user-event` is not used.** The import is missing entirely — drag simulation requires either `userEvent.dragOver`/`userEvent.drop` or `fireEvent.drop`.                                                             | `DropZone.test.tsx` |

---

## Specific Fixes Required

1. **Add `isFilled` story** demonstrating the filled state.
2. **Add `WithFileTrigger` story** showing the canonical paired usage pattern.
3. **Add `onDrop` to Default story** so Storybook demonstrates real interaction.
4. **Add drag interaction tests**: `fireEvent.dragOver` to change visual state, `fireEvent.drop` to trigger `onDrop` callback.
5. **Test `isDisabled`** — drop events should be rejected when disabled.
