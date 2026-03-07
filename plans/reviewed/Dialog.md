# Dialog — Peer Review

## Summary

`Dialog` and `DialogTrigger` are correctly implemented thin wrappers with good JSDoc and a solid open/close test cycle. The critical gap is accessibility testing: there are no tests for Escape-key dismissal, focus trap, or focus restoration — the three pillars of accessible modal dialog behaviour. `DialogContainer` (co-located in the same folder) has **no test file at all**, which is the most severe gap in this group.

## Scores

| Dimension                         | Score | Notes                                                                        |
| --------------------------------- | ----- | ---------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 4/5   | Clean; empty interface extends; `size: 'XL'` missing from argTypes           |
| Accessibility                     | 2/5   | No Escape test; no focus-trap test; no focus-return test                     |
| Documentation (JSDoc + Storybook) | 3/5   | Good size/dismissable stories; no fullscreen story; missing controlled state |
| Test Coverage                     | 3/5   | Good open/close; critical keyboard/focus assertions absent                   |

## Issues

### P1 — Critical

1. **No Escape key dismiss test.** The modal dialog pattern (WCAG 2.1 / APG) requires that pressing Escape closes the dialog. There is no test for this:

    ```tsx
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    ```

2. **No focus trap test.** WCAG 2.1 SC 2.1.2 requires that keyboard focus does not escape a modal dialog while it is open. No test verifies that Tab / Shift+Tab keeps focus within the dialog.

3. **No focus restoration test.** After the dialog closes, focus must return to the element that triggered it (the trigger button). This is critical for keyboard and AT users:

    ```tsx
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(trigger).toHaveFocus());
    ```

4. **`DialogContainer` has no test file.** `DialogContainer` (in the same folder) has zero tests. It manages critical programmatic open/close state and `onDismiss` is a required callback. Tests for initial closed state, open on `isOpen` change, close via `onDismiss`, and Escape key are all absent.

### P2 — Moderate

5. **Stories import from `@adobe/react-spectrum` directly.** `Button`, `ButtonGroup`, `Content`, `Divider`, `Footer`, `Heading` are imported from Adobe Spectrum. `Dialog` and `DialogTrigger` from `@geti/ui` are used, but the surrounding supporting components are not. Use `@geti/ui` exports where they exist for consistency.

6. **`size: 'XL'` missing from argTypes.** Spectrum `Dialog` supports `size: 'S' | 'M' | 'L' | 'XL'`. The argTypes `options` array is `['S', 'M', 'L']`, omitting `'XL'`.

7. **No `isDismissable` test.** Dismissable dialogs behave differently (close on Escape or outside click without a close button). The `Dismissable` story exists but no test covers this variant.

8. **Empty interface extends.** Both `DialogProps extends SpectrumDialogProps {}` and `DialogTriggerProps extends SpectrumDialogTriggerProps {}` add nothing. Add a comment explaining they are kept as extension points, or switch to `type` aliases.

### P3 — Minor

9. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

10. **No `fullscreen` / `fullscreenTakeover` story.** Geti product uses fullscreen flows. Adding at least one story for this type would demonstrate the full API range.

11. **No controlled open state story.** `DialogTrigger` supports `isOpen` / `onOpenChange`. This pattern is not demonstrated.

## What's Good

- Clean, minimal wrappers — both components are easy to understand and maintain.
- JSDoc is informative, especially the note about "render prop" usage on `DialogTrigger`.
- CSF3 format, `parameters.a11y` present on all stories.
- Tests correctly use semantic roles (`dialog`, `button`) rather than class selectors.
- `waitFor` is used correctly for async dialog close assertion.
- Size variants (Small, Large, Default) are well-covered in stories.
- Render prop pattern (`{(close) => <Dialog>...</Dialog>}`) correctly demonstrated in stories.

## Recommended Fixes

1. **[P1]** Add Escape key dismiss test.
2. **[P1]** Add focus trap test (Tab inside open dialog stays inside).
3. **[P1]** Add focus restoration test (focus returns to trigger after close).
4. **[P1]** Create `DialogContainer.test.tsx` with tests for open/close cycle and `onDismiss` required callback.
5. **[P2]** Replace direct `@adobe/react-spectrum` imports in stories with `@geti/ui` equivalents.
6. **[P2]** Add `'XL'` to the `size` argType options.
7. **[P3]** Remove `import React from 'react'` from tests.
8. **[P3]** Add `isDismissable` test and a fullscreen type story.
