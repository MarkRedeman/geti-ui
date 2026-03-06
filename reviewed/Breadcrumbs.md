# Breadcrumbs — Peer Review

## Summary

`Breadcrumbs` is a well-structured wrapper that correctly leverages Spectrum's accessible `<nav>` + `<ol>` structure, a significant improvement over the reference implementation's manual mapping. Tests correctly assert `aria-current="page"` on the last item and the navigation landmark. The main gaps are: no `onAction` test (primary SPA navigation pattern), no disabled state test, and the usual bare `Item.tsx` re-export issue.

## Scores

| Dimension                         | Score | Notes                                                                          |
| --------------------------------- | ----- | ------------------------------------------------------------------------------ |
| Code Quality & Type Safety        | 3/5   | Correct generic; empty interface extends; `Item` is bare re-export             |
| Accessibility                     | 4/5   | `aria-current="page"` tested; nav landmark tested; `onAction` pattern untested |
| Documentation (JSDoc + Storybook) | 3/5   | Good size/disabled stories; no `onAction` story; no `showRoot` demonstration   |
| Test Coverage                     | 3/5   | Landmark and current page tested; `onAction` and disabled state absent         |

## Issues

### P1 — Critical

1. **`onAction` is not tested.** In SPA (router-based) navigation, breadcrumb items do not use `href` — they rely on `onAction` on the `Breadcrumbs` component to handle navigation. This is the most common real-world usage pattern in the Geti product and is completely untested:
    ```tsx
    it('calls onAction when a breadcrumb item is pressed', async () => {
        const onAction = rstest.fn();
        render(
            <Provider theme={defaultTheme}>
                <Breadcrumbs onAction={onAction}>
                    <Item key="home">Home</Item>
                    <Item key="products">Products</Item>
                    <Item key="current">Current</Item>
                </Breadcrumbs>
            </Provider>
        );
        await userEvent.click(screen.getByRole('link', { name: 'Home' }));
        expect(onAction).toHaveBeenCalledWith('home');
    });
    ```

### P2 — Moderate

2. **Test relies on Spectrum's internal aria-label string.** `getByRole('navigation', { name: 'Breadcrumbs' })` works because Spectrum hard-codes `aria-label="Breadcrumbs"`. If Spectrum changes this string in a future version, the test breaks silently. Consider querying `getByRole('navigation')` without a name assertion, or at minimum adding a comment that this is implementation-dependent.

3. **No disabled state test.** `isDisabled` prevents items from being interactive. There is no test verifying that disabled breadcrumbs are not pressable.

4. **`Item.tsx` is a bare re-export.** `export { Item } from '@adobe/react-spectrum'` has no type export or JSDoc. Add:

    ```tsx
    export type { ItemProps as BreadcrumbItemProps } from '@adobe/react-spectrum';
    export { Item } from '@adobe/react-spectrum';
    ```

5. **Empty interface extends.** `BreadcrumbsProps<T> extends SpectrumBreadcrumbsProps<T> {}` adds nothing. Add a JSDoc comment or switch to a `type` alias.

6. **Generic component `displayName` absent.** Arrow function generic `const Breadcrumbs = <T extends object>(props) => ...` benefits from `Breadcrumbs.displayName = 'Breadcrumbs'` for React DevTools and Storybook introspection.

### P3 — Minor

7. **`import React from 'react'` in tests.** Unnecessary with the modern JSX transform.

8. **No `onAction` story.** The SPA navigation pattern (no `href`, use `onAction`) is the most common real-world usage but not demonstrated in Storybook. Add a story using the Storybook `action` addon.

9. **`showRoot` in argTypes but no story.** `showRoot` collapses middle breadcrumbs on narrow viewports, keeping only the root and current items. A story demonstrating this with many breadcrumb items is missing.

10. **`MultiLevel` story is the same as `Default` + one extra item.** Consider making `MultiLevel` distinctly different — e.g., with 6+ items where overflow behavior is visible.

## What's Good

- Correctly uses Spectrum's built-in accessible `<nav aria-label="Breadcrumbs">` + `<ol>` structure — a clear improvement over the reference implementation's manual rendering.
- Tests correctly verify `aria-current="page"` on the last breadcrumb item.
- `getByRole('navigation', { name: 'Breadcrumbs' })` tests the landmark correctly.
- `argTypes` covers `size`, `isDisabled`, and `showRoot` for interactive exploration.
- JSDoc accurately describes the composition pattern with `Item`.
- `parameters.a11y` present.
- Four stories cover the main variants (default, multi-level, small size, disabled).

## Recommended Fixes

1. **[P1]** Add an `onAction` callback test for SPA navigation usage.
2. **[P1]** Add an `onAction` Storybook story using the Storybook `action` addon.
3. **[P2]** Add type export to `Item.tsx`: `export type { ItemProps as BreadcrumbItemProps }`.
4. **[P2]** Add a disabled state test verifying items are not clickable when `isDisabled` is true.
5. **[P2]** Add `Breadcrumbs.displayName = 'Breadcrumbs'`.
6. **[P3]** Remove `import React from 'react'` from tests.
7. **[P3]** Add a `ShowRoot` story with many items where collapse behavior is visible.
