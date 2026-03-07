# DialogContainer — Peer Review

## Summary

`DialogContainer` is the only component in Groups 3 & 4 with **no test file**. This is the most critical gap in the entire review batch. The component manages imperative open/close state where `onDismiss` is required to prevent undismissable dialogs — a subtle consumer footgun that is unmitigated by documentation or tests. The stories themselves are well-structured and demonstrate the programmatic pattern correctly, but the absence of tests is a blocking issue.

## Scores

| Dimension                         | Score | Notes                                                                            |
| --------------------------------- | ----- | -------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 4/5   | Clean wrapper; empty interface extends; JSDoc is accurate                        |
| Accessibility                     | 3/5   | Relies on Spectrum a11y; `onDismiss` footgun undocumented; no Escape test        |
| Documentation (JSDoc + Storybook) | 3/5   | Good programmatic stories; `onDismiss` required nature not warned; mixed imports |
| Test Coverage                     | 0/5   | **No test file exists**                                                          |

## Issues

### P1 — Critical

1. **No test file.** `DialogContainer` is the only component in this review group without a `DialogContainer.test.tsx`. Create it with at minimum:
    - Dialog is not shown when `children` is `null`/`undefined` (closed state).
    - Dialog is shown when a child `Dialog` is rendered (`isOpen = true` state).
    - `onDismiss` is called when Escape is pressed.
    - `onDismiss` is called when clicking outside the dialog (with `isDismissable`).

    ```tsx
    describe('DialogContainer', () => {
        it('does not show dialog when no child is rendered', () => { ... });
        it('shows dialog when a Dialog child is rendered', () => { ... });
        it('calls onDismiss when Escape is pressed', async () => { ... });
        it('calls onDismiss on outside click when isDismissable', async () => { ... });
    });
    ```

2. **`onDismiss` footgun not documented.** `SpectrumDialogContainerProps.onDismiss` is required. If the consumer omits it (or it does not call `setIsOpen(false)`), the dialog becomes permanently open and cannot be dismissed. The JSDoc should warn:
    ```tsx
    /**
     * ...
     * @important `onDismiss` MUST update the state that controls `children`.
     * If children remain non-null after `onDismiss` fires, the dialog cannot be closed.
     */
    ```

### P2 — Moderate

3. **Empty interface extends.** `DialogContainerProps extends SpectrumDialogContainerProps {}` adds nothing. Add a JSDoc comment or switch to a `type` alias.

4. **Mixed import sources in stories.** `Dialog` is imported from `@geti/ui` (`../Dialog/Dialog`) but `Heading`, `Content`, `Divider`, `ButtonGroup`, `Button` come from `@adobe/react-spectrum`. Stories should be consistent — import all from `@geti/ui` or all from `@adobe/react-spectrum`.

5. **Story args are unused.** Both stories use `render: () => <ProgrammaticExample />` with no `args` parameter, so Storybook controls are completely disconnected. `isDismissable` and `type` are not surfaced as interactive props. Consider passing `args` through or using Storybook `decorators` to make props interactive.

6. **`type` prop not demonstrated.** `DialogContainer` supports `type: 'modal' | 'fullscreen' | 'fullscreenTakeover'`. No story demonstrates this range.

### P3 — Minor

7. **`ProgrammaticExample` internal component name.** A brief comment explaining _why_ `DialogContainer` is preferred over `DialogTrigger` (i.e., when the trigger unmounts while the dialog is open) would help consumers understand the intended use case.

8. **No story for `type: 'fullscreen'`.** The fullscreen takeover variant is relevant to the Geti product but not demonstrated.

## What's Good

- `DialogContainer` implementation is correct and delegates fully to Spectrum.
- JSDoc accurately describes the "no persistent trigger" use case.
- Stories demonstrate the most important pattern: programmatic `useState` controlling the child `Dialog`.
- `isDismissable` story is present and correctly shows `onDismiss` handler.
- `parameters.a11y` present in both stories.
- Uses `@geti/ui`'s own `Dialog` in stories (correct import for Dialog specifically).

## Recommended Fixes

1. **[P1 — Blocking]** Create `DialogContainer.test.tsx` with the four tests listed above.
2. **[P1]** Add a `@important` JSDoc warning to the `onDismiss` prop about the required state-close pattern.
3. **[P2]** Standardise import sources in stories to use `@geti/ui` consistently.
4. **[P2]** Thread `args` through story renders or add interactive `isDismissable` control.
5. **[P3]** Add a code comment explaining when `DialogContainer` is preferred over `DialogTrigger`.
