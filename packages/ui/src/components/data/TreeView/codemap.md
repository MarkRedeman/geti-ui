# packages/ui/src/components/data/TreeView/

## Responsibility

Re-exports Adobe React Spectrum's `TreeView` as a named Geti component, providing a hierarchical, expandable/collapsible tree for navigating nested data structures (e.g. folder hierarchies, category trees, nested annotation labels).

## Design

Minimal wrapper — `TreeViewProps` is a pure type alias (`export type { SpectrumTreeViewProps as TreeViewProps }`) rather than an extending interface. The component is `(props: TreeViewProps) => <SpectrumTreeView {...props} />`.

This alias-only approach (rather than `extends`) is used because `SpectrumTreeViewProps` is already fully typed and no additional props are needed, making the extension ceremonially redundant.

## Flow

```
props (SpectrumTreeViewProps passthrough)
  → <SpectrumTreeView {...props} />
```

`TreeView` uses Spectrum's `Item` (or a custom render prop) for child nodes, with nested `children` for sub-trees. Expansion state can be controlled or uncontrolled.

## Integration

- Used for nested label hierarchies, file system navigation, and any deeply nested collection display.
- Pairs with `Item` from `ListBox/` or directly from `@adobe/react-spectrum` for node definition.
- Themed automatically by `ThemeProvider`.
