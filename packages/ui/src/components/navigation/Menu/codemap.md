# packages/ui/src/components/navigation/Menu/

## Responsibility

Provides the complete menu component suite: a generic `Menu` for rendering a list of selectable/actionable items, a `MenuTrigger` to pair a trigger element with the menu overlay, and re-exports of `Item` and `Section` for structuring menu content. Together they cover all dropdown menu use cases in the design system.

## Design

Four co-located files, all thin wrappers over `@adobe/react-spectrum`:

- **`Menu.tsx`** — generic `MenuProps<T extends object> extends SpectrumMenuProps<T>`. Renders `<SpectrumMenu {...props} />`. Supports `selectionMode` (`'single' | 'multiple' | 'none'`), `onAction`, `disabledKeys`, etc.
- **`MenuTrigger.tsx`** — `MenuTriggerProps extends SpectrumMenuTriggerProps`. Renders `<SpectrumMenuTrigger {...props} />`. Manages open/close state of the menu overlay and wires keyboard interaction.
- **`Item.tsx`** — direct re-export of Spectrum's `Item`. No wrapping.
- **`Section.tsx`** — direct re-export of Spectrum's `Section`. No wrapping.

The generic `T` on `Menu` allows typed `items` arrays to be passed via Spectrum's collection API without casting.

## Flow

```
<MenuTrigger>
  <TriggerElement />          ← first child (e.g. ActionButton)
  <Menu items={items} onAction={handler}>
    <Item key="...">Label</Item>
    <Section title="Group">
      <Item key="...">Label</Item>
    </Section>
  </Menu>
</MenuTrigger>
```

`MenuTrigger` manages overlay open state. On trigger activation, `Menu` renders into a Spectrum overlay. `onAction(key)` fires when an item is activated.

## Integration

- Used by `ActionMenu` (same navigation/ category), which combines `MenuTrigger` + `Menu` into a single pre-wired component with an `ActionButton` trigger.
- Used by `MediaViewModes` composite to render view mode selections.
- `Item` and `Section` are also used directly by `ListBox`, `ComboBox`, `Picker`, and `TabList` elsewhere in the design system.
