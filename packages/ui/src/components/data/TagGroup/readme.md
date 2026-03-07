# packages/ui/src/components/data/TagGroup/

## Responsibility

Re-exports Adobe React Spectrum's `TagGroup` as a named Geti component, providing an interactive list of removable tags with selection and keyboard navigation. Used for editable label/tag sets where users can add or remove items.

## Design

Generic thin wrapper — `TagGroupProps<T extends object> extends SpectrumTagGroupProps<T>`. The component body is `(props) => <SpectrumTagGroup {...props} />`. Also re-exports Spectrum's `Item` for tag item definition.

Key Spectrum props: `label`, `onRemove(keys)`, `selectionMode`, `maxRows` (truncates overflow to a "Show more" expander).

**Important distinction**: Spectrum's `Tag` (used inside `TagGroup`) is unrelated to `Tag` in `data/Tag/`. The former is Spectrum's interactive removable chip; the latter is Geti's custom annotation label chip. They share a name but have entirely different APIs and styling.

## Flow

```
props { label, onRemove, items, children (Item nodes), maxRows, ...rest }
  → <SpectrumTagGroup {...props} />
```

No state, no effects, no refs.

## Integration

- Used in label assignment UI, filter panels, and multi-select fields where the current selection is shown as removable chips.
- Pairs with Spectrum's `Tag` component (not re-exported by Geti) for individual tag items inside the group.
- Contrast with `data/Tag/` — that is the Geti-custom annotation label chip; this is Spectrum's interactive removable tag container.
