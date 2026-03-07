# packages/ui/src/components/layouts/Accordion/

## Responsibility

Re-exports Adobe React Spectrum's `Accordion` as a named Geti component, providing a container for a set of `Disclosure` items — collapsible/expandable sections grouped together. Manages which sections are open (controlled or uncontrolled) and applies consistent spacing.

## Design

Thin wrapper — `AccordionProps extends SpectrumAccordionProps`. The component body is `(props) => <SpectrumAccordion {...props} />`.

`Accordion` acts as a grouping container — it does not render visible UI itself but coordinates the open/close state across its `Disclosure` children (in controlled mode via `expandedKeys`/`onExpandedChange`).

## Flow

```
props { children (Disclosure nodes), expandedKeys?, onExpandedChange?, ...rest }
  → <SpectrumAccordion {...props} />
      → {children}   ← Disclosure components
```

No state, no effects, no refs.

## Integration

- Always used in combination with `Disclosure` (same layouts/ category), which provides the individual collapsible section.
- Used for settings panels, FAQ sections, and grouped navigation lists where multiple collapsible sections are needed.
- Themed automatically by `ThemeProvider`.
