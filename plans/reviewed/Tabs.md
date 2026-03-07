# Tabs — Peer Review

## Summary

`Tabs`, `TabList`, and `TabPanels` are correct generic wrappers with proper JSDoc and good story coverage. The critical issue is the absence of keyboard navigation tests — arrow-key navigation is the primary accessibility contract for tab widgets and is entirely untested. `Item.tsx` is a bare re-export with no type wrapping. All three main component interfaces have the empty-extend no-op pattern.

## Scores

| Dimension                         | Score | Notes                                                                               |
| --------------------------------- | ----- | ----------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 3/5   | Correct generics; `Item` is bare re-export; all three interfaces are empty extends  |
| Accessibility                     | 3/5   | `aria-label` on stories is good; no arrow-key navigation test; no disabled-key test |
| Documentation (JSDoc + Storybook) | 3/5   | Good variant stories; no icon-tab story; `density` missing from argTypes            |
| Test Coverage                     | 3/5   | Click-to-select tested; keyboard navigation entirely absent                         |

## Issues

### P1 — Critical

1. **No keyboard navigation tests.** The tab widget's primary accessibility interaction is arrow-key navigation: `ArrowRight`/`ArrowLeft` to move between tabs in horizontal mode, `ArrowDown`/`ArrowUp` in vertical mode. `Tab` key to move focus into/out of the tablist. None of these interactions are tested:

    ```tsx
    it('navigates between tabs with arrow keys', async () => {
        renderTabs();
        const tabOne = screen.getByRole('tab', { name: 'Tab One' });
        tabOne.focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'Tab Two' })).toHaveFocus();
    });
    ```

    This is required by WCAG 2.1 SC 2.1.1 and the APG tabs pattern.

2. **`Item.tsx` is a bare re-export without a type export.** `Item` is re-exported from `@adobe/react-spectrum` without any wrapping or type export. The public API exports it as `TabItem`. Without a type export (`export type { ItemProps as TabItemProps }`), consumers cannot type check `Item` props from the design system package. Same issue exists in Breadcrumbs and Menu.

### P2 — Moderate

3. **No `disabledKeys` test.** The `Disabled` story correctly uses `args: { disabledKeys: ['disabled'] }`, but no test verifies that a disabled tab cannot be activated by click or keyboard. Disabled tabs must still be focusable (but not activatable) per the APG pattern.

4. **No controlled selection test.** `selectedKey` / `onSelectionChange` controlled pattern is not tested. This is a common integration pattern.

5. **Empty interface extends.** All three component interfaces (`TabsProps`, `TabListProps`, `TabPanelsProps`) extend their Spectrum counterparts with no additions. Add JSDoc extension-point comments or switch to `type` aliases.

6. **Generic component `displayName` absent.** Arrow function generics (e.g., `const Tabs = <T extends object>(props) => ...`) can confuse Storybook's component introspection and React DevTools. Add:
    ```tsx
    Tabs.displayName = 'Tabs';
    ```
    Note: this requires declaring the function before setting the property, which means switching from the inline arrow form.

### P3 — Minor

7. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

8. **No icon-tab story.** Tabs with icons (`<Item key="foo"><Icon /><Text>Label</Text></Item>`) are common in the Geti product. A story demonstrating this pattern is missing.

9. **`density` prop not in argTypes.** Spectrum `Tabs` supports `density: 'compact' | 'regular'`. Not exposed as an interactive control.

10. **`defaultSelectedKey` not demonstrated.** The `Default` story always starts on the first tab. A story with `defaultSelectedKey` set to a non-first tab would demonstrate the default selection API.

## What's Good

- All stories correctly pass `aria-label` to `<Tabs>`, which is good accessibility practice (the tablist needs an accessible name).
- The `Disabled` story correctly uses `args: { disabledKeys: ['disabled'] }` rather than `isDisabled` on individual items.
- Tests use correct ARIA roles: `tablist`, `tab`, `tabpanel`.
- The `Vertical` story demonstrates orientation switching.
- JSDoc on all three components clearly explains the composition pattern.
- `parameters.a11y` present on all stories.
- The generic type parameter `<T extends object>` is correctly threaded through all three components and their props interfaces.

## Recommended Fixes

1. **[P1]** Add `ArrowRight`/`ArrowLeft` keyboard navigation tests for both horizontal and vertical orientations.
2. **[P1]** Add type export: `export type { ItemProps as TabItemProps }` in `Item.tsx`, or wrap `Item` with a typed alias.
3. **[P2]** Add a `disabledKeys` test verifying disabled tabs cannot be activated.
4. **[P2]** Add a controlled `selectedKey` + `onSelectionChange` test.
5. **[P2]** Add `Tabs.displayName = 'Tabs'` (and same for `TabList`, `TabPanels`).
6. **[P3]** Remove `import React from 'react'` from tests.
7. **[P3]** Add `density` to argTypes and an icon-tab story.
