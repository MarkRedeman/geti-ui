# packages/ui/src/components/data/TableView/

## Responsibility

Re-exports Adobe React Spectrum's `TableView` and all its sub-components (`TableHeader`, `TableBody`, `Column`, `Row`, `Cell`) as named Geti components from a single file, providing a complete virtualized, accessible data table with sorting, selection, and drag-and-drop support.

## Design

Thin wrapper for `TableView` itself — `TableViewProps extends SpectrumTableViewProps`. The component body is `(props) => <SpectrumTableView {...props} />`.

All sub-components (`TableHeader`, `TableBody`, `Column`, `Row`, `Cell`) are re-exported as type aliases pointing directly to their Spectrum equivalents — no wrapping required since they carry no Geti-specific behaviour.

Props type aliases (`TableHeaderProps`, `TableBodyProps`, `ColumnProps`, `RowProps`, `CellProps`) are also re-exported for consumer TypeScript usage.

The design choice to export everything from one file ensures callers only need a single import path for the entire table API.

## Flow

```
<TableView selectionMode="multiple" onAction={handler}>
  <TableHeader>
    <Column>Name</Column>
    <Column>Status</Column>
  </TableHeader>
  <TableBody items={rows}>
    {row => (
      <Row key={row.id}>
        <Cell>{row.name}</Cell>
        <Cell>{row.status}</Cell>
      </Row>
    )}
  </TableBody>
</TableView>
```

## Integration

- Used in dataset management, model comparison, and audit log views where tabular data with sorting and multi-select is needed.
- Contrast with `ListView` — use `TableView` for multi-column structured data; use `ListView` for single-column item collections.
- `Column` supports `allowsSorting` and `width`; `TableView` surfaces `sortDescriptor` and `onSortChange` for server-side sort integration.
