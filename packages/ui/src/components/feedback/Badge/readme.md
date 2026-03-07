# packages/ui/src/components/feedback/Badge/

## Responsibility

Re-exports Adobe React Spectrum's `Badge` as a named Geti component, providing a small inline label for categorical status, counts, or classification (e.g. "New", "Beta", count bubbles).

## Design

Pure thin wrapper — `BadgeProps extends SpectrumBadgeProps` with zero prop additions or overrides. The component body is `(props) => <SpectrumBadge {...props} />`. Spectrum's `variant` (`'neutral' | 'positive' | 'negative' | 'info' | 'seafoam' | 'indigo' | ...`) drives colour.

## Flow

```
props (SpectrumBadgeProps passthrough)
  → <SpectrumBadge {...props} />
```

No state, no effects, no refs.

## Integration

- Contrast with `Tag` (data/) — `Tag` is a fully custom Geti component with Geti-specific token styling, while `Badge` is a direct Spectrum pass-through.
- Used in list items, headers, and navigation elements to communicate status or categorisation at a glance.
- Themed automatically by `ThemeProvider`.
