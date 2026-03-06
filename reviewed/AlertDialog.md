# AlertDialog — Peer Review

## Summary

`AlertDialog` is the best-tested component in this group: it correctly uses `alertdialog` role, covers all action callbacks with proper mocks, and provides story coverage for all five variants. The main gaps are a missing `error` variant story, no Escape/keyboard dismiss tests, and the usual empty-interface-extends and direct-Adobe-import issues shared across the group.

## Scores

| Dimension                         | Score | Notes                                                                            |
| --------------------------------- | ----- | -------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 4/5   | Clean; empty interface extends; `SpectrumAlertDialogProps` is well-typed         |
| Accessibility                     | 3/5   | Correct `alertdialog` role; no Escape test; `autoFocusButton` not tested         |
| Documentation (JSDoc + Storybook) | 4/5   | All five variants storied; `error` story missing; `autoFocusButton` undocumented |
| Test Coverage                     | 4/5   | All callbacks tested; correct role used; no keyboard dismiss test                |

## Issues

### P1 — Critical

1. **Missing `error` variant story.** The `argTypes.variant.options` array lists `'error'` but no story demonstrates it. The `error` variant has distinct visual treatment (red icon, typically no cancel button) and different semantics from `'destructive'`. Add an `Error` story:

    ```tsx
    export const Error: Story = {
        render: (args) => (
            <DialogTrigger>
                <Button variant="negative">Show error</Button>
                <AlertDialog
                    {...args}
                    variant="error"
                    title="Operation failed"
                    primaryActionLabel="Retry"
                    onPrimaryAction={() => console.log('retry')}
                >
                    The operation could not be completed. Please try again.
                </AlertDialog>
            </DialogTrigger>
        ),
    };
    ```

2. **No Escape key / keyboard dismiss test.** Modal alert dialogs must support Escape to dismiss when `isDismissable` is set. There is no test for this keyboard interaction, which is required by WCAG 2.1 SC 2.1.2 and the APG alert dialog pattern.

### P2 — Moderate

3. **Empty interface extends.** `AlertDialogProps extends SpectrumAlertDialogProps {}` adds nothing. Add a comment marking it as an intentional extension point or switch to a `type` alias.

4. **Stories import `Button` from `@adobe/react-spectrum`.** The trigger `Button` in all stories comes from `@adobe/react-spectrum` rather than `@geti/ui`. Use the Geti `Button` for consistency. Similarly `DialogTrigger` is imported from `../Dialog/DialogTrigger` — this internal relative path should come via `@geti/ui` in stories (stories represent consumer-facing usage).

5. **`autoFocusButton` not demonstrated or tested.** The `autoFocusButton` prop controls which button receives focus when the dialog opens (`'primary'`, `'secondary'`, `'cancel'`). This is an accessibility-relevant prop that is not storied or tested.

6. **No `isDismissable` test.** `AlertDialog`s are not dismissable by default (unlike `Dialog`), which is intentional for destructive confirmations. A test should explicitly verify that clicking outside the dialog does NOT close it.

### P3 — Minor

7. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

8. **Mock placement inconsistency.** `renderAlertDialog` accepts `onPrimaryAction` and `onCancel` as parameters (defaulting to `rstest.fn()`), but tests also create fresh mocks locally inside each test case and pass them in. This works correctly but is slightly inconsistent — standardise to always define mocks inside the test body for clarity.

9. **`console.log` in story `onAction` handlers.** Minor — `console.log` is preferable to `alert()` (used in Menu/ActionMenu stories) and is acceptable for stories. No change needed.

## What's Good

- Correctly uses `alertdialog` ARIA role in tests — a common mistake is to use `dialog` instead.
- All three action callbacks (`onPrimaryAction`, `onCancel`, `onSecondaryAction`) are individually tested.
- `rstest.fn()` mock usage is correct and idiomatic for the test framework.
- Story coverage is broad: all five variant types are represented (minus `error`).
- `parameters.a11y` present on all stories.
- `WithSecondaryAction` story demonstrates the three-button pattern.
- JSDoc on component is clear and accurate.

## Recommended Fixes

1. **[P1]** Add an `Error` story demonstrating the error variant.
2. **[P1]** Add an Escape key dismiss test (for `isDismissable` variant).
3. **[P2]** Add a test verifying that without `isDismissable`, clicking outside does NOT close the alert dialog.
4. **[P2]** Add an `autoFocusButton` story and test.
5. **[P2]** Replace `@adobe/react-spectrum` `Button` import in stories with `@geti/ui` `Button`.
6. **[P3]** Remove `import React from 'react'` from tests.
7. **[P3]** Standardise mock placement — define all `rstest.fn()` inside test bodies rather than in `renderAlertDialog` parameters.
