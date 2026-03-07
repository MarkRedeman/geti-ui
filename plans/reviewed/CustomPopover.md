# CustomPopover — Peer Review

## Summary

`CustomPopover` is the only component in this group built on `react-aria-components` (RAC) rather than Spectrum v3, which is the correct forward-compatible choice. However, it has a significant code duplication issue (the entire popover body is copy-pasted for the conditional branch), a missing `aria-hidden` on the arrow SVG, a critically weak test for the uncontrolled branch, and no CSS/theme integration. The reference implementation in `reference-packages/` demonstrates more robust focus management patterns (`FocusScope`, `DismissButton`) that have been dropped.

## Scores

| Dimension                         | Score | Notes                                                                                          |
| --------------------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 3/5   | Duplication in conditional; `triggerElement: ReactNode` is too loose; inline style for theming |
| Accessibility                     | 3/5   | Arrow SVG lacks `aria-hidden`; missing explicit `DismissButton`; `restoreFocus` not confirmed  |
| Documentation (JSDoc + Storybook) | 3/5   | Good story coverage; no controlled-mode story; stories use unstyled `AriaButton`               |
| Test Coverage                     | 2/5   | Trivial assertion for the uncontrolled branch; no `showArrow`/`width` prop tests               |

## Issues

### P1 — Critical

1. **Code duplication.** The `AriaPopover + OverlayArrow + AriaDialog` block is copy-pasted verbatim in both branches of the `if (triggerElement !== undefined)` conditional (lines 50–59 and 65–74). Extract a `PopoverContent` sub-component or a `renderPopoverContent()` helper:

    ```tsx
    const content = (
        <AriaPopover {...rest} style={popoverStyle}>
            {showArrow && (
                <OverlayArrow>
                    <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M0 0 L6 6 L12 0" />
                    </svg>
                </OverlayArrow>
            )}
            <AriaDialog>{children}</AriaDialog>
        </AriaPopover>
    );
    ```

2. **Arrow SVG lacks `aria-hidden`.** The `<svg>` element for the directional arrow has no `aria-hidden="true"`. Screen readers may announce it as an empty or decorative graphic. Add `aria-hidden="true"` to the `<svg>`.

3. **"renders without triggerElement" test is useless.** The test body is:
    ```tsx
    expect(document.body).toBeInTheDocument();
    ```
    `document.body` is always in the document — this assertion can never fail and proves nothing. Replace it with a meaningful test of the controlled (`isOpen`/`onOpenChange`) pattern, e.g. rendering with `isOpen={false}` and asserting no dialog is present, then rendering with `isOpen={true}` and asserting the dialog is present.

### P2 — Moderate

4. **`triggerElement: ReactNode` is too loose.** Passing any `ReactNode` as a trigger means there is no compile-time guarantee the element is interactive (pressable, focusable). Should accept `ReactElement` at minimum, or a render prop. A non-interactive `ReactNode` (e.g. a plain `<span>`) will silently fail to open the popover.

5. **Missing `DismissButton` for screen reader dismiss.** The reference implementation includes:

    ```tsx
    <DismissButton onDismiss={popoverState.close} />
    ```

    This provides an announced dismiss mechanism for AT users (especially VoiceOver on iOS). While RAC's `Popover` component handles keyboard Escape internally, an explicit `DismissButton` at the end of the content improves AT compat. Evaluate whether RAC's internal dismiss suffices and document the decision.

6. **Inline style for width.** Geti convention is to use CSS modules or `UNSAFE_className` for style overrides, not inline `style`. The `width` and `minWidth` values applied via `popoverStyle` should instead be driven by a CSS custom property or a class from a CSS module. This is especially important for theme consistency.

7. **Stories use raw `AriaButton` (unstyled).** The `react-aria-components` `Button` has no Geti styling. Stories should use the Geti `Button` component so the Storybook demonstrates the real consumer experience. The trigger in `Default`, `WithArrow`, `WithCustomWidth`, etc. should be a styled button.

### P3 — Minor

8. **`Omit<AriaPopoverProps, 'children' | 'trigger'>` silently removes `trigger`.** The `trigger` prop on `AriaPopoverProps` is a string ID used to associate the popover with its trigger element. Omitting it prevents setting an explicit trigger association in the controlled branch (without `triggerElement`). This should be documented in the JSDoc.

9. **No controlled-mode story.** There is no story showing `CustomPopover` used in controlled mode (with `isOpen` / `onOpenChange` props and an external trigger). This is the primary use case for the no-`triggerElement` branch.

10. **Arrow SVG dimensions.** The 12×12 arrow may be too small for some placement contexts. Not a correctness issue, but flagged for design review.

## What's Good

- Correctly built on `react-aria-components` rather than Spectrum v3 — this is the right forward migration path.
- `width` prop as `number | string` is a thoughtful API choice for flexibility.
- `showArrow` defaults to `false`, which is the safe default.
- `style` prop is spread and extended (not overwritten), preserving consumer-provided styles.
- `placement` argType is present in Storybook for interactive control.
- The `triggerElement` pattern for self-managed open state is a good DX shortcut.
- CSF3 format, `parameters.a11y` present.

## Recommended Fixes

1. **[P1]** Extract the duplicated popover body into a local `renderContent` const or sub-component. Fix `aria-hidden="true"` on the SVG in the same pass.
2. **[P1]** Replace the trivial `document.body` assertion with a meaningful controlled-mode test.
3. **[P2]** Change `triggerElement?: ReactNode` to `triggerElement?: ReactElement` for type safety.
4. **[P2]** Replace inline `style` width with a CSS custom property or CSS module class.
5. **[P2]** Replace `AriaButton` in stories with the Geti `Button` component.
6. **[P3]** Add a controlled-mode story showing `isOpen`/`onOpenChange` usage.
7. **[P3]** Document why `trigger` is omitted from the props in the JSDoc.
