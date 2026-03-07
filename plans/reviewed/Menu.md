# Menu — Peer Review

## Summary

`Menu`, `MenuTrigger`, `Item`, and `Section` form a correct thin-wrapper set. The critical issues are: `alert()` in the Default story (will open a real browser dialog in Storybook), no `onAction` callback test, no keyboard navigation tests, and `Item`/`Section` being bare re-exports with no type or JSDoc. The test coverage covers basic open/close but misses all the accessibility-critical keyboard interactions.

## Scores

| Dimension                         | Score | Notes                                                                                    |
| --------------------------------- | ----- | ---------------------------------------------------------------------------------------- |
| Code Quality & Type Safety        | 3/5   | Correct; `Item`/`Section` bare re-exports; `Section title` deprecated; empty interfaces  |
| Accessibility                     | 2/5   | No keyboard nav tests; no `aria-label` on menu in tests; `selectionMode` ARIA not tested |
| Documentation (JSDoc + Storybook) | 3/5   | Good section/selection stories; `alert()` in Default is a DX footgun                     |
| Test Coverage                     | 2/5   | Open/close tested; `onAction`, keyboard nav, selection mode all absent                   |

## Issues

### P1 — Critical

1. **`alert()` in Default story.** `onAction={(key) => alert(\`Selected: \${key}\`)}`opens a real browser alert dialog when clicking a menu item in Storybook. This blocks the UI and provides terrible DX. Replace with`console.log`or the Storybook`action` addon:

    ```tsx
    import { action } from '@storybook/addon-actions';
    // ...
    <Menu onAction={action('onAction')}>
    ```

2. **No `onAction` callback test.** The `Menu` component's primary purpose is to invoke actions. There is no test verifying that `onAction` fires with the correct key when a menu item is pressed. Add:

    ```tsx
    it('calls onAction with the correct key when an item is selected', async () => {
        const onAction = rstest.fn();
        render(
            <Provider theme={defaultTheme}>
                <MenuTrigger>
                    <ActionButton>Open menu</ActionButton>
                    <Menu onAction={onAction}>
                        <Item key="cut">Cut</Item>
                    </Menu>
                </MenuTrigger>
            </Provider>
        );
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
        expect(onAction).toHaveBeenCalledWith('cut');
    });
    ```

3. **No keyboard navigation tests.** Menu keyboard navigation (ArrowDown/Up to move focus, Enter to select, Escape to close) is the primary accessibility interaction per WCAG 2.1 SC 2.1.1 and the APG menu button pattern. None of this is tested:
    ```tsx
    it('navigates menu items with arrow keys', async () => {
        renderMenu();
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });
    ```

### P2 — Moderate

4. **`Item` and `Section` are bare re-exports.** No type exports, no JSDoc. As `MenuItem` and `MenuSection` in the public API, they should at minimum export their props types:

    ```tsx
    // Item.tsx
    export type { ItemProps as MenuItemProps } from '@adobe/react-spectrum';
    export { Item } from '@adobe/react-spectrum';
    ```

5. **No `aria-label` on `Menu` in tests.** The `<Menu>` in the test render helper has no `aria-label`. Menu elements should have accessible names. Add `aria-label="Edit actions"` or similar.

6. **`selectionMode` ARIA role not tested.** When `selectionMode: 'single'`, items get `role="menuitemradio"`. When `selectionMode: 'multiple'`, items get `role="menuitemcheckbox"`. Neither is tested. The `SingleSelect` and `MultiSelect` stories exist but no test verifies the ARIA role change.

7. **`Section title` prop is deprecated.** `<Section title="Clipboard">` uses the deprecated `title` prop (deprecated in Spectrum v3 in favour of `<Section><Heading>Clipboard</Heading>...</Section>`). Update stories to the current API:
    ```tsx
    <Section>
        <Heading>Clipboard</Heading>
        <Item key="cut">Cut</Item>
    </Section>
    ```

### P3 — Minor

8. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

9. **No `disabledKeys` story or test.** Partial item disabling is not demonstrated.

10. **`ActionButton` imported from `@adobe/react-spectrum`** in stories. Use `@geti/ui`'s `ActionButton` if available.

11. **Menu has no story with icons.** Icon + text menu items (common in Geti) are not demonstrated.

## What's Good

- Correct thin wrapper with good JSDoc describing the composition pattern (MenuTrigger → ActionButton + Menu → Item/Section).
- Tests correctly use `role="menu"` and `role="menuitem"` for assertions.
- `waitFor` used correctly for async menu-close assertion.
- Story coverage is good: Default, SingleSelect, MultiSelect, and Sectioned stories show the main patterns.
- `argTypes` exposes `selectionMode` as a Storybook control.
- `parameters.a11y` present.

## Recommended Fixes

1. **[P1]** Replace `alert()` in Default story with `console.log` or `action('onAction')`.
2. **[P1]** Add an `onAction` callback test.
3. **[P1]** Add ArrowDown/Up keyboard navigation and Escape-to-close tests.
4. **[P2]** Add type exports to `Item.tsx` and `Section.tsx`.
5. **[P2]** Add `aria-label` to the `Menu` in the test render helper.
6. **[P2]** Add `selectionMode` ARIA role tests (`menuitemradio`, `menuitemcheckbox`).
7. **[P2]** Update `Section title` to `<Section><Heading>...</Heading></Section>` in stories.
8. **[P3]** Remove `import React from 'react'` from tests.
