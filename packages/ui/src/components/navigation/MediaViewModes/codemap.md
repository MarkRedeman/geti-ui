# packages/ui/src/components/navigation/MediaViewModes/

## Responsibility

Provides a Geti-native composite control for switching between media display density modes (large thumbnails, medium thumbnails, small thumbnails, details view). Renders as a single `ActionButton` that shows the current mode's icon and opens a dropdown `Menu` for selection.

## Design

This is the design system's only navigation component that is fully Geti-authored rather than a Spectrum wrapper.

Key design decisions:
- **`ViewModes` enum** (defined in `utils.ts`) — `LARGE = 'Large thumbnails'`, `MEDIUM = 'Medium thumbnails'`, `SMALL = 'Small thumbnails'`, `DETAILS = 'Details'`. The string values are also the display labels, keeping label and key in sync.
- **Icon mapping** — each `ViewModes` value maps to a `@spectrum-icons/workflow` icon: `List` (Details), `GridSmall`, `GridMedium`, `GridLarge`. Resolved at render time via a lookup record keyed by lowercased mode string (`item.toLocaleLowerCase()`).
- **Composition** — wraps directly from `@adobe/react-spectrum` (not via Geti wrappers): `MenuTrigger`, `Menu`, `TooltipTrigger`, `ActionButton`. The outer `TooltipTrigger` + `ActionButton` shows the current mode icon and a tooltip label.
- **Controlled** — `viewMode: ViewModes` and `setViewMode: (mode: ViewModes) => void` are the only state props. `items?: ViewModes[]` lets callers restrict which modes are shown (defaults to all four).
- **`isDisabled`** — propagated to both the trigger `ActionButton` and the inner `Menu`.

## Flow

```
props { viewMode, setViewMode, items = [all ViewModes], isDisabled }
  → <MenuTrigger>
      <TooltipTrigger>
        <ActionButton isDisabled>
          {icon for current viewMode}
        </ActionButton>
        <Tooltip>{label for current viewMode}</Tooltip>
      </TooltipTrigger>
      <Menu selectionMode="single" selectedKeys={[viewMode]}
            onSelectionChange={key => setViewMode(key)}>
        {items.map(item => <Item key={item}>{icon} {item}</Item>)}
      </Menu>
    </MenuTrigger>
```

Selection change propagates through `setViewMode`, making this a fully controlled component with no internal state.

## Integration

- Used in dataset/annotation gallery views to toggle between thumbnail grid densities and list/details view.
- Depends on `@adobe/react-spectrum` Spectrum components directly (not Geti re-exports) for its composition.
- `ViewModes` enum is exported from `utils.ts` alongside the component and should be imported by consumers to pass typed `viewMode` values.
