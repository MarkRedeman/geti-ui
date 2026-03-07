# ActionMenu — Peer Review

## Summary

`ActionMenu` is the best-implemented component in Group 4: it has `aria-label` in the test render helper, tests the `onAction` callback with the correct key, and verifies `isDisabled`. The main issues are `alert()` in the Default story, missing `aria-label` in three of four Storybook stories (creating inaccessible icon buttons), and absent keyboard navigation tests.

## Scores

| Dimension                         | Score | Notes                                                                                          |
| --------------------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 4/5   | Clean generic wrapper; empty interface extends; `Item` from `@adobe/react-spectrum` in stories |
| Accessibility                     | 2/5   | Stories 1–3 have no `aria-label`; no keyboard nav tests; `alert()` bad DX                      |
| Documentation (JSDoc + Storybook) | 3/5   | Good variant stories; `aria-label` only in WithLabel; no icon-item story                       |
| Test Coverage                     | 4/5   | `onAction`, disabled state, open/close all tested; keyboard nav absent                         |

## Issues

### P1 — Critical

1. **`alert()` in Default story.** `onAction={(key) => alert(\`Selected: \${key}\`)}`opens a real browser dialog when clicking a menu item in Storybook. Replace with`console.log`or`action('onAction')`from`@storybook/addon-actions`.

2. **Default, Quiet, and Disabled stories have no `aria-label`.** `ActionMenu` renders an icon button (three dots / kebab menu icon) with no visible text label. Without `aria-label`, the trigger button has no accessible name. The `a11y` Storybook plugin should catch this as a violation. Only the `WithLabel` story demonstrates the correct pattern:

    ```tsx
    export const Default: Story = {
        render: (args) => (
            <ActionMenu {...args} aria-label="More actions" onAction={console.log}>
                ...
            </ActionMenu>
        ),
    };
    ```

3. **No keyboard navigation tests.** ArrowDown to open, ArrowDown/Up to navigate items, Enter/Space to select, Escape to close — none are tested. These are the primary keyboard interactions for action menus per WCAG 2.1 SC 2.1.1:
    ```tsx
    it('opens menu with Enter key on trigger', async () => {
        renderActionMenu();
        screen.getByRole('button').focus();
        await userEvent.keyboard('{Enter}');
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });
    it('closes menu with Escape key', async () => {
        renderActionMenu();
        await userEvent.click(screen.getByRole('button'));
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    });
    ```

### P2 — Moderate

4. **Empty interface extends.** `ActionMenuProps<T> extends SpectrumActionMenuProps<T> {}` adds nothing. Add a JSDoc comment or switch to a `type` alias.

5. **`Item` imported from `@adobe/react-spectrum` in stories.** Stories import `Item` directly from Adobe Spectrum rather than using `@geti/ui`'s `MenuItem`. Use the Geti export for consistency:

    ```tsx
    import { MenuItem } from '@geti/ui';
    // or from the local export:
    // import { Item } from '../Menu/Item';
    ```

6. **No `disabledKeys` story or test.** Partial item disabling is not demonstrated or tested.

7. **`displayName` absent on generic component.** Arrow function generic `const ActionMenu = <T extends object>(props) => ...` should have `ActionMenu.displayName = 'ActionMenu'` for React DevTools and Storybook.

### P3 — Minor

8. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

9. **No icon-items story.** ActionMenu is commonly used with icons alongside text labels (`<Item key="edit"><Edit /><Text>Edit</Text></Item>`). Not demonstrated.

10. **`align` and `direction` argTypes present but not demonstrated.** These props are listed in argTypes but no story shows their visual effect. Add directional placement stories similar to the approach in Popover stories.

11. **Test queries `screen.getByRole('button')` without a name.** In tests 1–3 (render, not visible initially, opens on click), `getByRole('button')` without a `name` option works here because there's only one button, but it's less robust. Since the test render helper includes `aria-label="More actions"`, use `getByRole('button', { name: 'More actions' })` for specificity.

## What's Good

- Test render helper correctly includes `aria-label="More actions"` — unique in this group.
- `onAction` callback is tested and the key value is asserted (`toHaveBeenCalledWith('edit')`).
- `isDisabled` correctly tested with `toBeDisabled()`.
- Menu-close-after-selection is tested with `waitFor`.
- `argTypes` includes `isDisabled`, `isQuiet`, `align`, and `direction` for Storybook controls.
- `WithLabel` story correctly demonstrates the required `aria-label` prop.
- JSDoc is clear and accurate.
- `parameters.a11y` present.

## Recommended Fixes

1. **[P1]** Replace `alert()` in Default story with `console.log` or `action('onAction')`.
2. **[P1]** Add `aria-label="More actions"` to Default, Quiet, and Disabled stories.
3. **[P1]** Add keyboard navigation tests: Enter to open, ArrowDown/Up to navigate, Escape to close.
4. **[P2]** Replace `Item` from `@adobe/react-spectrum` in stories with `@geti/ui` `MenuItem`.
5. **[P2]** Add `ActionMenu.displayName = 'ActionMenu'`.
6. **[P3]** Remove `import React from 'react'` from tests.
7. **[P3]** Strengthen test queries to use `getByRole('button', { name: 'More actions' })`.
