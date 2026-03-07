# FullscreenAction — Peer Review

> **Location:** `packages/ui/src/components/FullscreenAction/FullscreenAction.tsx`

---

## Summary

`FullscreenAction` is the most feature-rich non-trivial component in this group. It composites a `DialogTrigger`, `TooltipTrigger`, `ActionButton`, `Dialog`, `ButtonGroup`, and a ref-forwarding pattern for the content container. The implementation is solid and the test coverage is good relative to the group. Key issues are: a potential ref-timing bug in the `actionButton` function pattern, the hard-coded `id` construction, and a subtle Storybook title inconsistency.

---

## 1. Code Quality & Type Safety

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Location                                                                                                                                                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| W1  | **`containerRef.current` is always `null` when `actionButton` is first called.** The `actionButton` function prop receives `containerRef.current` — but at render time when the dialog opens, `containerRef.current` is `null` until `Content` mounts and populates it. The `FunctionalActionButton` story demonstrates this correctly (`ref ? 'Ref available' : 'Ref null'`), but the JSDoc/API surface does not warn that the first render call will always receive `null`. A better pattern would be to pass the `ref` object itself (not `.current`) so the actionButton can use it reactively. | `FullscreenAction.tsx:55`                                                                                                                                                                                                                                                   |
| W2  | **`id` prop is used only for the trigger button** (`${id}-open-fullscreen`). If `id` is `undefined`, the button's `id` becomes `"undefined-open-fullscreen"` — a real HTML id that could clash if multiple `FullscreenAction` instances exist without IDs. Add a guard: only set `id` if `id` is defined.                                                                                                                                                                                                                                                                                           | `FullscreenAction.tsx:40`                                                                                                                                                                                                                                                   |
| W3  | \*\*`title` typed as `string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | ReactNode`** but `aria-label`is conditionally set only for`string`titles. When`title`is a ReactNode, the dialog falls back to`'Fullscreen content'`and the trigger button to`'Open in fullscreen'`. This is correct behaviour but should be explicitly documented in JSDoc. | `FullscreenAction.tsx:41,49` |

---

## 2. Accessibility

### ✅ Positive

- Trigger button has a meaningful `aria-label` that includes the title.
- Close button has `aria-label="Close fullscreen"`.
- Dialog has `aria-label` set correctly.
- All interactive elements are keyboard accessible via Spectrum components.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                      | Location                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| A1  | **No `aria-describedby` or `aria-details`** for the dialog content. Complex fullscreen dialogs benefit from a description connecting the heading to the content, especially for non-modal takeover dialogs.                | `FullscreenAction.tsx:49`         |
| A2  | **Focus management on close is handled by Spectrum's `DialogTrigger`** but is not tested. The test clicks the close button and waits for the dialog to disappear, but does not verify focus returns to the trigger button. | `FullscreenAction.test.tsx:41-59` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                    | Location                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| D1  | **Storybook title is `'Components/FullscreenAction'`** while other components in this group use `'Advanced/FullscreenAction'`. Inconsistent grouping will cause the component to appear in a separate Storybook section. | `FullscreenAction.stories.tsx:6` |
| D2  | **`actionButton` function signature** (receiving a `ref`) is a non-obvious API. The JSDoc on `FullscreenActionProps.actionButton` should explain the ref-null-on-first-render limitation.                                | `FullscreenAction.tsx:23`        |
| D3  | **No `WithReactNodeTitle` story** demonstrating the ReactNode title path and its fallback `aria-label` behaviour.                                                                                                        | `FullscreenAction.stories.tsx`   |

---

## 4. Tests

### ✅ Positive

- Test coverage is the best in this group: renders trigger, opens dialog, closes dialog, renders custom action button.
- Correct use of `waitFor` for async close animation.
- Tests use ARIA-appropriate queries.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                         | Location                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| T1  | **`await userEvent.click(screen.getByRole('button'))` on line 49** is ambiguous — it clicks the first button found, which works here but would break if a second button were added before the trigger. Use the named selector: `screen.getByRole('button', { name: /Open in fullscreen/i })`. | `FullscreenAction.test.tsx:49` |
| T2  | **No test for `id` prop undefined behaviour** (produces `"undefined-open-fullscreen"` id).                                                                                                                                                                                                    | `FullscreenAction.test.tsx`    |
| T3  | **No test for ReactNode `title`** path (fallback aria-label).                                                                                                                                                                                                                                 | `FullscreenAction.test.tsx`    |

---

## Specific Fixes Required

1. **Fix `id` prop guard**: `id={id ? `${id}-open-fullscreen` : undefined}`.
2. **Change `actionButton` to receive `RefObject<DOMRefValue<HTMLElement>>` instead of `.current`** so the ref can be accessed reactively after mount.
3. **Fix Storybook title** to `'Advanced/FullscreenAction'` for consistency.
4. **Strengthen test on line 49** to use the named button selector.
5. **Add test for `id={undefined}` case** — trigger button should not have a malformed id.
6. **Add focus-return-to-trigger test** after dialog close.
