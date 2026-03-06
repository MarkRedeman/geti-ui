# Popover — Peer Review

## Summary

`Popover` is conceptually confused: it wraps `SpectrumDialogTrigger` (the combined trigger+overlay manager) under the name "Popover" (which implies just the overlay surface), and re-exposes the full `type` prop range including `modal` and `fullscreen`. This naming mismatch creates API confusion alongside the separately-named `CustomPopover`. Tests cover basic open/close but miss Escape dismiss and keyboard navigation. Stories import directly from `@adobe/react-spectrum` rather than the Geti library.

## Scores

| Dimension                         | Score | Notes                                                                                             |
| --------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 3/5   | Correct implementation but misleading abstraction; `type` prop undermines the component's purpose |
| Accessibility                     | 3/5   | Relies on Spectrum's a11y; no Escape key test; no keyboard open test                              |
| Documentation (JSDoc + Storybook) | 3/5   | JSDoc present; stories lack `placement` control; no controlled-state story                        |
| Test Coverage                     | 3/5   | Good open/close cycle; missing Escape, keyboard nav, focus restoration                            |

## Issues

### P1 — Critical

1. **Naming and API confusion.** `Popover` wraps `SpectrumDialogTrigger`, so its children must be a trigger element + a `Dialog`. This is counter-intuitive — consumers expect `Popover` to be the overlay surface, not a combined trigger+overlay manager. The contrast with `CustomPopover` (which genuinely is just the overlay) makes this worse. Options:
    - Rename to `PopoverTrigger` to match the pattern of `MenuTrigger` / `DialogTrigger`.
    - Or hard-code `type="popover"` and remove the `type` prop entirely, accepting this is a narrow convenience wrapper.

2. **`type` prop re-exposes full overlay range.** By allowing `type: 'modal' | 'tray' | 'fullscreen' | 'fullscreenTakeover'`, `Popover` can be made into a full-screen modal, defeating its purpose. Either remove `type` from the props interface (hard-code `'popover'`), or rename the component to `OverlayTrigger` and document that it's a generic overlay trigger.

### P2 — Moderate

3. **Stories import from `@adobe/react-spectrum` directly.** `ActionButton`, `Dialog`, `Heading`, and `Content` are imported straight from Adobe Spectrum. These should use `@geti/ui` equivalents (`Dialog` is available at `@geti/ui`; `ActionButton` should be checked). This inconsistency means the Storybook does not reflect the actual consumer experience.

4. **No Escape key dismiss test.** WCAG 2.1 SC 1.4.13 requires dismissable popovers to close on Escape. Add:

    ```tsx
    await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    ```

5. **Missing `placement` argType.** There is no Storybook control for `placement`, so the prop is not interactively discoverable. Add it to `argTypes`.

6. **No controlled open/close story.** The `isOpen` / `onOpenChange` pattern (controlled mode) is not demonstrated.

### P3 — Minor

7. **`import React from 'react'` in test file.** Unnecessary with the modern JSX transform.

8. **`PlacementStart` story lacks RTL note.** `start`/`end` placement is locale-relative. A brief comment or story description would help consumers understand this.

## What's Good

- `type` default of `'popover'` is correctly set with the destructuring default.
- Props interface correctly uses `Omit<SpectrumDialogTriggerProps, 'type'>` so the re-declared `type` prop doesn't conflict.
- JSDoc is present and descriptive on both the props and the component.
- Tests use `waitFor` correctly for the async close assertion.
- `parameters.a11y` is present in stories.
- Four placement stories give good visual coverage.

## Recommended Fixes

1. **[P1]** Rename `Popover` to `PopoverTrigger` OR remove `type` from the props and hard-code `'popover'`. Update the `index.ts` export accordingly.
2. **[P1]** Add a deprecation notice or rename discussion in the JSDoc so consumers understand the relationship with `CustomPopover`.
3. **[P2]** Replace `@adobe/react-spectrum` imports in stories with `@geti/ui` equivalents.
4. **[P2]** Add an Escape-key dismiss test.
5. **[P2]** Add `placement` argType to Storybook meta.
6. **[P3]** Remove `import React from 'react'` from tests.
