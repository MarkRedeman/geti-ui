# ListBox — Peer Review

**File:** `packages/ui/src/components/ListBox/ListBox.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

`ListBox` is a clean passthrough with `Item` re-export. This is a simpler component than `ListView` — no density prop, simpler interaction model. Good baseline but tests are minimal and interaction testing is absent.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                                                 |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Generic `<T extends object>` correct. Full spread. No `any`.                                                                                                            |
| 2   | 🟡 Low   | `Item` is exported as `ListBoxItem` in `index.ts` — correct to avoid collision. Same documentation gap as `ListView`: the alias is not mentioned in JSDoc.              |
| 3   | 🟡 Low   | `SpectrumListBoxProps` may include `disabledKeys` and `selectedKeys` for controlled state. These aren't showcased but are available via spread — worth noting in JSDoc. |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                        |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Renders `role="listbox"` — tests verify this correctly.                                                                                                        |
| 2   | 🟡 Low   | No test for `aria-selected` on selected items. When `selectionMode="single"` and a key is in `selectedKeys`, Spectrum marks items with `aria-selected="true"`. |
| 3   | 🟡 Low   | No test for keyboard navigation (`ArrowDown`/`ArrowUp`, `Enter`/`Space` to select).                                                                            |
| 4   | 🟡 Low   | No story or test for `disabledKeys` — disabled items should have `aria-disabled="true"`.                                                                       |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                  |
| --- | -------- | -------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc on component is accurate.                                                                          |
| 2   | ✅ —     | Three stories: Default (no selection), SingleSelection, MultipleSelection.                               |
| 3   | 🟡 Low   | No story for **sections/groups** within a ListBox (Spectrum supports `Section` and `Header` components). |
| 4   | 🟡 Low   | No story for **disabled items** (`disabledKeys`).                                                        |
| 5   | 🟡 Low   | No story for **controlled selection** (`selectedKeys` + `onSelectionChange`).                            |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                       |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | Five tests covering render, options visible, accessible label, and both selection modes. Reasonable baseline.                                 |
| 2   | 🟠 Medium | **No interaction test** — clicking an option to select it is not tested.                                                                      |
| 3   | 🟡 Low    | No test for `defaultSelectedKeys` or `selectedKeys`.                                                                                          |
| 4   | 🟡 Low    | `'renders with single selection mode'` and `'renders with multiple selection mode'` only assert the listbox exists — no difference is tested. |

---

## Specific Fixes Required

```tsx
// 1. Test option selection interaction:
it('selects an option on click', async () => {
    render(
        <Provider theme={defaultTheme}>
            <ListBox aria-label="Colors" selectionMode="single" width="size-2400">
                <Item key="red">Red</Item>
                <Item key="blue">Blue</Item>
            </ListBox>
        </Provider>
    );
    await userEvent.click(screen.getByText('Red'));
    expect(screen.getByText('Red').closest('[role="option"]')).toHaveAttribute('aria-selected', 'true');
});

// 2. Add disabledKeys story:
export const WithDisabledItems: Story = {
    render: () => (
        <ListBox aria-label="Toppings" selectionMode="multiple" disabledKeys={['olives']} width="size-2400">
            <Item key="cheese">Cheese</Item>
            <Item key="mushrooms">Mushrooms</Item>
            <Item key="olives">Olives (disabled)</Item>
        </ListBox>
    ),
};
```

---

## Overall Rating: 🟡 Acceptable

Functionally correct. Add interaction tests and disabled/section stories.
