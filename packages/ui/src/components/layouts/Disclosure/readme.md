# packages/ui/src/components/layouts/Disclosure/

## Responsibility

Provides the individual collapsible section primitive for accordion-style layouts. Wraps Spectrum's `Disclosure` and re-exports `DisclosurePanel` and `DisclosureTitle` directly (no wrapping needed), giving callers a complete set of parts from a single import.

## Design

Three exports from one file:

- **`Disclosure`** — thin wrapper. `DisclosureProps extends SpectrumDisclosureProps`. Component body: `(props) => <SpectrumDisclosure {...props} />`. Manages the collapsed/expanded state (uncontrolled) or accepts `isExpanded`/`onExpandedChange` (controlled).
- **`DisclosurePanel`** — direct re-export of `SpectrumDisclosurePanel`. No wrapping — it carries no Geti-specific behaviour.
- **`DisclosureTitle`** — direct re-export of `SpectrumDisclosureTitle`. No wrapping — renders the clickable header with the expand/collapse chevron.

Props type aliases (`DisclosurePanelProps`, `DisclosureTitleProps`) are also re-exported for TypeScript consumers.

## Flow

```
<Disclosure>
  <DisclosureTitle>Section heading</DisclosureTitle>
  <DisclosurePanel>
    {/* collapsible content */}
  </DisclosurePanel>
</Disclosure>
```

`DisclosureTitle` is the interactive trigger (renders the chevron). `DisclosurePanel` is the collapsible content region. `Disclosure` owns the toggle state.

## Integration

- Used standalone for single collapsible sections.
- Used inside `Accordion` (same layouts/ category) for grouped, coordinated multi-section layouts.
- `DisclosureTitle` and `DisclosurePanel` must be direct children of `Disclosure` (Spectrum's slot system requires the structural relationship).
- Themed automatically by `ThemeProvider`.
