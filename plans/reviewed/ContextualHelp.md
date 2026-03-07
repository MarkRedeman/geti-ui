# ContextualHelp — Peer Review

## Summary

`ContextualHelp` is a clean wrapper with good story coverage for `help`/`info` variants and placement. The test file has a correctness issue — redundant `act()` wrappers that can mask timing problems — and its variant tests assert nothing meaningful (they only check that a button exists, which is true for both variants). The component is straightforward and accessible by delegation to Spectrum, but the variant-differentiation tests need to be strengthened.

## Scores

| Dimension                         | Score | Notes                                                                                     |
| --------------------------------- | ----- | ----------------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 4/5   | Clean; empty interface extends; no additions                                              |
| Accessibility                     | 3/5   | Spectrum handles a11y; variant tests don't verify ARIA difference; no `onOpenChange` test |
| Documentation (JSDoc + Storybook) | 3/5   | Good variant stories; only one placement shown; missing `onOpenChange` demo               |
| Test Coverage                     | 3/5   | Open/close tested; variant tests are vacuous; `act()` misuse                              |

## Issues

### P1 — Critical

1. **`act()` misuse in tests.** `@testing-library/user-event` v14+ already wraps all interactions in `act()` internally. The pattern used:
    ```tsx
    await act(async () => {
        await userEvent.click(button);
    });
    ```
    is redundant and can suppress real async errors (React warns when state updates happen outside `act`, but double-wrapping hides those warnings from the test output). Remove all outer `act()` wrappers:
    ```tsx
    await userEvent.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    ```

### P2 — Moderate

2. **Variant tests assert nothing meaningful.** The `help` and `info` variant tests both only verify `getByRole('button')` is in the document — which is true regardless of variant. They do not verify any ARIA or visual difference between variants. Spectrum renders a `?` icon for `help` and an `ℹ️` icon for `info`, resulting in different accessible button names. Assert the difference:

    ```tsx
    it('renders help variant with correct accessible name', () => {
        renderContextualHelp('help');
        // Spectrum uses "Help" as the aria-label for the help icon button
        expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument();
    });
    it('renders info variant with correct accessible name', () => {
        renderContextualHelp('info');
        expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
    });
    ```

    _(Verify exact accessible names against Spectrum's implementation.)_

3. **Missing placement stories.** Only `PlacementTop` is shown. `PlacementBottom`, `PlacementStart`, and `PlacementEnd` are listed in `argTypes` but not individually demonstrated. Since each placement requires a layout offset to be visible, a `Placements` story showing all four in a grid would be useful.

4. **Empty interface extends.** `ContextualHelpProps extends SpectrumContextualHelpProps {}` adds nothing. Add a comment or switch to a `type` alias.

5. **Stories import from `@adobe/react-spectrum` directly.** `Content`, `Flex`, `Heading`, `Text` are imported from Adobe Spectrum. Where Geti wrappers exist, use them.

### P3 — Minor

6. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

7. **`import { act }` no longer needed.** Once the redundant `act()` wrappers are removed, the `act` import becomes unused.

8. **No `onOpenChange` test or story.** `ContextualHelp` passes `onOpenChange` through to Spectrum. Not tested or storied.

9. **`WithLabel` story uses Flex.** The `WithLabel` story uses `<Flex>` from `@adobe/react-spectrum` directly. If `@geti/ui` exports `Flex`, use that instead.

## What's Good

- Thin, correct wrapper with proper JSDoc.
- Tests for both open (click to show popover) and close (click outside to dismiss) are present and use `queryByRole('dialog')` correctly.
- `argTypes` includes both `variant` and `placement` controls for interactive Storybook exploration.
- `Help`, `Info`, `WithLabel`, and `PlacementTop` stories cover the main usage scenarios.
- `parameters.a11y` present.
- The `WithLabel` story is particularly good — it demonstrates the common real-world pattern of pairing `ContextualHelp` with a form label.

## Recommended Fixes

1. **[P1]** Remove all `act(async () => { await userEvent... })` wrappers — use `await userEvent.click()` directly.
2. **[P2]** Replace vacuous variant tests with assertions on the button's accessible name or `aria-label` to verify the help/info distinction.
3. **[P2]** Add `PlacementBottom`, `PlacementStart`, `PlacementEnd` stories (or a combined `Placements` story).
4. **[P3]** Remove `import React from 'react'` and the now-unused `import { act }` from tests.
5. **[P3]** Add an `onOpenChange` test that verifies the callback fires on open and close.
