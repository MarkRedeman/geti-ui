# Tooltip — Peer Review

## Summary

Tooltip and TooltipTrigger are clean, correct thin wrappers around Spectrum's primitives with proper JSDoc and good story placement coverage. The critical weakness is the test suite: no test ever triggers hover or focus to actually show the tooltip, making the interaction coverage illusory. Story coverage for the `variant` prop is also absent.

## Scores

| Dimension                         | Score | Notes                                                                                  |
| --------------------------------- | ----- | -------------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 4/5   | Clean wrappers; empty `interface extends` is a minor semantic issue                    |
| Accessibility                     | 3/5   | Relies on Spectrum's a11y; no keyboard-show test; no icon-only trigger story           |
| Documentation (JSDoc + Storybook) | 3/5   | Good placement stories; missing `variant` and `delay/trigger` mode stories             |
| Test Coverage                     | 2/5   | No test ever reveals the tooltip; interaction tests are assertions on the trigger only |

## Issues

### P1 — Critical

1. **Tests never show the tooltip.** Tests for `variant`, `placement`, and `isDisabled` all only assert that the trigger `<button>` is in the document — none invoke `userEvent.hover()` or `userEvent.tab()` to bring up the tooltip and then call `await screen.findByRole('tooltip')`. The "does not show tooltip content initially" test is the only overlay-state assertion, which is not enough.

2. **No interaction test for tooltip appearance.** There is no test that proves the tooltip renders when the trigger is hovered or focused. This is the component's primary purpose. A minimal test is:
    ```tsx
    await userEvent.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    ```

### P2 — Moderate

3. **No `variant` argType or story.** `Tooltip` supports `variant: 'neutral' | 'positive' | 'negative' | 'info'`, each with distinct visual treatment. Stories cover all four placements and `isDisabled`, but none demonstrate variant states. Add an argType control and a `Variants` story.

4. **`TooltipTrigger` interaction props not exercised.** The trigger's `delay`, `closeDelay`, and `trigger` (focus | hover) props are not demonstrated in any story or test. These are important DX props.

5. **Empty interface extends.** `TooltipProps extends SpectrumTooltipProps {}` adds nothing. Prefer `type TooltipProps = SpectrumTooltipProps` for semantic clarity, or add a JSDoc comment explaining the `interface` is kept for downstream extension:
    ```tsx
    // interface kept as extension point for future Geti-specific props
    export interface TooltipProps extends SpectrumTooltipProps {}
    ```

### P3 — Minor

6. **`import React from 'react'` in test file.** Unnecessary with the modern JSX transform (React 17+). Remove the unused import.

7. **No icon-only trigger story.** Icon-only buttons as tooltip triggers are the most common real-world usage in Geti. Add a story with an icon-only `ActionButton` and a meaningful `aria-label` on it.

8. **`TooltipTrigger` has no standalone stories.** Since `TooltipTrigger` is a first-class export, its `delay`, `closeDelay`, and `trigger` props deserve Storybook controls. These can be added to the existing stories as `argTypes` on the wrapping `TooltipTrigger`.

## What's Good

- Both components are correctly typed and all upstream props flow through without breakage.
- JSDoc is present and informative on both components.
- CSF3 format with `parameters.a11y` present.
- Placement stories (top, bottom, start, end) thoroughly cover the positioning API.
- Disabled trigger story is present and correctly uses `isDisabled` on the trigger.
- Story renders correctly embed the full `TooltipTrigger + Tooltip` compound pattern.

## Recommended Fixes

1. **[P1]** Add a `userEvent.hover()` test that asserts `findByRole('tooltip')` resolves. Add a `userEvent.tab()` keyboard-focus test as well.
2. **[P1]** Replace the three inert tests (variant, placement, disabled) with tests that actually validate tooltip-show behaviour for those configurations.
3. **[P2]** Add `variant` argType in Storybook and a `Variants` story showing all four visual states.
4. **[P2]** Add a comment (or switch to `type` alias) on the empty interface extends pattern.
5. **[P3]** Remove `import React from 'react'` from the test file.
6. **[P3]** Add an icon-only trigger story with explicit `aria-label`.
