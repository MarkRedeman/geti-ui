# TableView — Peer Review

**File:** `packages/ui/src/components/TableView/TableView.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

`TableView` is a composite re-export that wraps the full Spectrum table suite (`TableView`, `TableHeader`, `TableBody`, `Column`, `Row`, `Cell`). This is the correct approach — re-exporting subcomponents avoids forcing consumers to reach into Spectrum. Type exports are mostly correct. Key issues: sub-component prop types exported from the component file are not re-exported from `index.ts`, the `Row` component lacks a `key` in stories, and tests don't cover sort or selection.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 Medium | **Sub-component prop types (`SpectrumColumnProps`, `TableHeaderProps`, `TableBodyProps`, `RowProps`, `CellProps`) are exported from `TableView.tsx` but NOT from `index.ts`.** Consumers importing from `@geti/ui` cannot access these types without going through Spectrum directly. Fix: add `export type { SpectrumColumnProps, TableHeaderProps, TableBodyProps, RowProps, CellProps } from './components/TableView/TableView'` to `index.ts`. |
| 2   | 🟡 Low    | `TableViewProps<T>` is a generic type extending `SpectrumTableProps<T>` — correctly typed. The `TableView` component correctly propagates the generic `<T extends object>`.                                                                                                                                                                                                                                                                        |
| 3   | 🟡 Low    | `Column` is re-exported as `Column` (not `TableColumn`) — this could shadow DOM `Column` names in scope but is acceptable given Spectrum's own naming.                                                                                                                                                                                                                                                                                             |
| 4   | ✅ —      | Full passthrough via spread on all re-exported subcomponents. No `any`.                                                                                                                                                                                                                                                                                                                                                                            |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                        |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —     | All stories provide `aria-label` on `TableView` — correct, as this is required by Spectrum. Tests verify this.                 |
| 2   | 🟡 Low   | No story or test demonstrates **keyboard navigation** (arrow keys to navigate cells, Space/Enter for selection, Tab to focus). |
| 3   | 🟡 Low   | The `Selectable` story does not demonstrate `onSelectionChange` callback — selection state is uncontrolled and visual only.    |
| 4   | 🟡 Low   | No test for `sortDescriptor` or `onSortChange` — sort direction is not tested at all.                                          |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                             |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc on `TableView` and each re-exported subcomponent is clear.                                                    |
| 2   | ✅ —     | Three stories: `Default` (sortable), `Selectable` (multiple selection), `Compact` (density).                        |
| 3   | 🟡 Low   | No story for **empty table state** (zero `items`).                                                                  |
| 4   | 🟡 Low   | No story for **loading state** (`loadingState` prop).                                                               |
| 5   | 🟡 Low   | No story for **drag and drop** (Spectrum supports it). This is advanced but warranted given its prevalence in Geti. |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                      |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —      | Four tests: role grid, column headers, row data, accessible label. Solid baseline.                                                                           |
| 2   | 🔴 Medium | **No test for row selection.** `selectionMode="multiple"` with keyboard/click selection is a core interaction for Geti use cases and is completely untested. |
| 3   | 🟡 Low    | No test for `onSortChange` — clicking a sortable column header should trigger it.                                                                            |
| 4   | 🟡 Low    | The `renderTable` helper renders a non-selectable table by default — test should cover a selectable variant.                                                 |
| 5   | 🟡 Low    | No test for empty `items` array — should render headers but no rows.                                                                                         |

---

## Specific Fixes Required

### 1. Re-export sub-component prop types from `index.ts`

```ts
// packages/ui/src/index.ts (line ~143-144)
export { TableView, TableHeader, TableBody, Column, Row, Cell } from './components/TableView/TableView';
export type {
    TableViewProps,
    SpectrumColumnProps,
    TableHeaderProps,
    TableBodyProps,
    RowProps,
    CellProps,
} from './components/TableView/TableView';
```

### 2. Add selection test

```tsx
import userEvent from '@testing-library/user-event';

it('supports row selection via click', async () => {
    render(
        <Provider theme={defaultTheme}>
            <TableView aria-label="Selectable" selectionMode="multiple">
                <TableHeader columns={columns}>{(col) => <Column key={col.uid}>{col.name}</Column>}</TableHeader>
                <TableBody items={rows}>
                    {(item) => <Row>{(key) => <Cell>{item[key as keyof typeof item]}</Cell>}</Row>}
                </TableBody>
            </TableView>
        </Provider>
    );
    const firstRow = screen.getAllByRole('row')[1]; // skip header
    await userEvent.click(firstRow);
    expect(firstRow).toHaveAttribute('aria-selected', 'true');
});
```

### 3. Add empty state story

```tsx
export const Empty: Story = {
    render: () => (
        <TableView aria-label="Empty table" height="size-3000" width="size-6000">
            <TableHeader columns={columns}>{(col) => <Column key={col.uid}>{col.name}</Column>}</TableHeader>
            <TableBody items={[]}>{() => <Row>{() => <Cell />}</Row>}</TableBody>
        </TableView>
    ),
};
```

---

## Overall Rating: 🟡 Acceptable

Well-structured re-export composite. Fix the missing type exports in `index.ts` and add selection/sort tests.
