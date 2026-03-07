# packages/ui/src/components/feedback/ProgressCircle/

## Responsibility

Re-exports Adobe React Spectrum's `ProgressCircle` as a named Geti component, providing circular progress indication (both determinate and indeterminate) via the design system's public API.

## Design

Pure thin wrapper — `ProgressCircleProps extends SpectrumProgressCircleProps` with zero prop additions or overrides. The component body is `(props) => <SpectrumProgressCircle {...props} />`.

## Flow

```
props (SpectrumProgressCircleProps passthrough)
  → <SpectrumProgressCircle {...props} />
```

No state, no effects, no refs.

## Integration

- Used internally by `Loading` (spinner variant) to render `<ProgressCircle isIndeterminate aria-label="Loading...">`.
- Pairs with `ProgressBar` and `Meter` as the suite of Geti progress indicators.
- Themed automatically by the `ThemeProvider` wrapping the application.
