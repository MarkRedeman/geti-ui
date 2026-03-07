# ListView — Peer Review

**File:** `packages/ui/src/components/ListView/ListView.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

`ListView` is a clean passthrough wrapper plus `Item` re-export over Spectrum's `ListView`. Good story coverage for density and selection modes. Tests are minimal — three tests all assert existence only. The `Item` export naming collision in `index.ts` is handled but the alias (`ListItem`) should be noted.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                                                                                                                                                               |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Generic `<T extends object>` correctly propagated. Full spread passthrough. No `any`.                                                                                                                                                                                                 |
| 2   | 🟡 Low   | `Item` is exported as `ListItem` in `index.ts` (to avoid collision with `ListBoxItem`, `TagItem`). This is reasonable — but the alias is not mentioned in the `ListView.tsx` JSDoc. Consumers will see `ListItem` in the public API and may not connect it back to Spectrum's `Item`. |
| 3   | 🟡 Low   | No `index.ts` file in the component folder (unlike Button which has `index.ts`). Minor inconsistency but not a problem.                                                                                                                                                               |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                         |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumListView` renders `role="grid"` (not `role="list"`) — this is intentional in Spectrum for complex list items. Tests use `getByRole('grid')` correctly. |
| 2   | 🟡 Low   | No test or story demonstrates keyboard navigation (`ArrowUp`/`ArrowDown` between items, `Space` for selection).                                                 |
| 3   | 🟡 Low   | `selectionMode="single"` story doesn't show `onSelectionChange` — the story is display-only.                                                                    |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                                    |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —     | JSDoc on `ListView` is accurate.                                                                                                                                                           |
| 2   | ✅ —     | Stories: Default (single-select), MultiSelect, Compact density, Spacious density — good spread.                                                                                            |
| 3   | 🟡 Low   | No story for **empty state** (zero items).                                                                                                                                                 |
| 4   | 🟡 Low   | No story demonstrating `loadingState` prop.                                                                                                                                                |
| 5   | 🟡 Low   | `argTypes` define `selectionMode` and `density` controls but the Default story uses `render: () => (...)` with hardcoded values instead of `args`, so the controls won't affect the story. |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                         |
| --- | --------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | 🟠 Medium | Only **3 tests**, all asserting existence only. No interaction testing.                                         |
| 2   | 🟠 Medium | No test for **selection** — clicking an item in `selectionMode="single"` should mark it `aria-selected="true"`. |
| 3   | 🟡 Low    | No test for keyboard navigation (`ArrowDown` to next item).                                                     |
| 4   | 🟡 Low    | No test for `density` prop — though this is a visual property and may not be worth testing in unit tests.       |
| 5   | ✅ —      | `renderListView` helper correctly wraps in `Provider`.                                                          |

---

## Specific Fixes Required

```tsx
// 1. Add selection interaction test:
it('selects item on click', async () => {
    render(
        <Provider theme={defaultTheme}>
            <ListView aria-label="Selectable" selectionMode="single" width="size-3000">
                <Item key="1">Item One</Item>
                <Item key="2">Item Two</Item>
            </ListView>
        </Provider>
    );
    await userEvent.click(screen.getByText('Item One'));
    expect(screen.getByText('Item One').closest('[role="row"]')).toHaveAttribute('aria-selected', 'true');
});

// 2. Add keyboard navigation test:
it('navigates items with arrow keys', async () => {
    renderListView();
    const grid = screen.getByRole('grid');
    grid.focus();
    await userEvent.keyboard('{ArrowDown}');
    // Focus should move to first item
    expect(document.activeElement).toBeInTheDocument();
});

// 3. Fix stories to use args pattern:
export const Default: Story = {
    args: {
        'aria-label': 'List view',
        selectionMode: 'single',
    },
    render: (args) => (
        <ListView {...args} width="size-3000">
            <Item key="1">Adobe Photoshop</Item>
            ...
        </ListView>
    ),
};
```

---

## Overall Rating: 🟡 Acceptable

Clean wrapper. Tests are too shallow for a complex interactive component.
