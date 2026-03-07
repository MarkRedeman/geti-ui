# packages/ui/src/components/data/ActionBar/

## Responsibility

Re-exports Adobe React Spectrum's `ActionBar` and `ActionBarContainer` as named Geti components from a single file, providing a contextual toolbar that appears when items in a collection (typically `ListView` or `TableView`) are selected.

## Design

Two exports from one file:

- **`ActionBar`** — generic thin wrapper. `ActionBarProps<T extends object>` is a type alias of `SpectrumActionBarProps<T>`. Component body: `(props) => <SpectrumActionBar {...props} />`. Renders the action buttons that appear when items are selected. Props: `selectedItemCount`, `isEmphasized`, `onAction`, `onClearSelection`, and `children` (action `Item` nodes).
- **`ActionBarContainer`** — thin wrapper. `ActionBarContainerProps extends SpectrumActionBarContainerProps`. Component body: `(props) => <SpectrumActionBarContainer {...props} />`. Must wrap both the collection component and the `ActionBar` to coordinate their layout (the bar slides in at the bottom of the collection).

## Flow

```
<ActionBarContainer>
  <ListView selectionMode="multiple" ...>
    ...
  </ListView>
  <ActionBar selectedItemCount={selectedCount}
             onAction={handleAction}
             onClearSelection={clearSelection}>
    <Item key="delete">Delete</Item>
    <Item key="move">Move</Item>
  </ActionBar>
</ActionBarContainer>
```

`ActionBarContainer` manages the sliding reveal animation and z-index coordination.

## Integration

- Used wherever bulk selection actions are needed on collections: delete multiple images, move multiple annotations, assign labels to multiple items.
- Always paired: `ActionBarContainer` wraps the collection + `ActionBar`; do not use `ActionBar` outside an `ActionBarContainer`.
- `Item` from Spectrum (or `ListBox/Item`) defines the individual action buttons.
