# packages/ui/src/components/feedback/Meter/

## Responsibility

Re-exports Adobe React Spectrum's `Meter` as a named Geti component, providing a visual gauge for quantities with semantic colour variants (positive, warning, critical, informative). Used to communicate the current level of a value relative to a known range.

## Design

Pure thin wrapper — `MeterProps extends SpectrumMeterProps` with zero prop additions or overrides. The component body is `(props) => <SpectrumMeter {...props} />`. Spectrum's `variant` prop (`'positive' | 'warning' | 'critical' | 'informative'`) is available as-is.

## Flow

```
props (SpectrumMeterProps passthrough)
  → <SpectrumMeter {...props} />
```

No state, no effects, no refs.

## Integration

- Sits alongside `ProgressBar` and `ProgressCircle` in the feedback category.
- Used in contexts like storage usage, annotation coverage, or model confidence displays where a semantic severity level matters.
- Themed automatically by the `ThemeProvider` wrapping the application.
