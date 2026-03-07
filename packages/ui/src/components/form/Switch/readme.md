# packages/ui/src/components/form/Switch/

## Responsibility

`Switch` is an on/off toggle switch. It wraps Spectrum's `Switch` and applies Geti's energy-blue track/handle colours when `isEmphasized` is `true` — mirroring the same `data-*` attribute + CSS module token-override pattern used by `Slider`.

---

## Design

### The `isEmphasized` → `data-emphasized` pattern

Spectrum's `Switch` supports `isEmphasized` but uses its accent colour for the selected track. To override with `--energy-blue`:

1. `isEmphasized` is passed through to Spectrum (unchanged, in `...props`).
2. Mirrored as `data-emphasized={props.isEmphasized}` on the Spectrum component.
3. CSS module selects `.switch[data-emphasized='true']` and overrides six Spectrum component-level tokens:

```css
/* Switch.module.css */
.switch[data-emphasized='true'] {
    --spectrum-switch-emphasized-track-color-selected:        var(--energy-blue);
    --spectrum-switch-emphasized-track-color-selected-hover:  var(--energy-blue-light);
    --spectrum-switch-emphasized-track-color-selected-down:   var(--energy-blue-lighter);
    --spectrum-switch-emphasized-handle-border-color-selected:       var(--energy-blue);
    --spectrum-switch-emphasized-handle-border-color-selected-hover: var(--energy-blue-light);
    --spectrum-switch-emphasized-handle-border-color-selected-down:  var(--energy-blue-lighter);
}
```

`.switch` is always applied via `UNSAFE_className={clsx(styles.switch, UNSAFE_className)}`.

### Props

```tsx
export interface SwitchProps extends SpectrumSwitchProps {}
```

No props are added or removed. All Spectrum props (`isSelected`, `defaultSelected`, `onChange`, `isEmphasized`, `isDisabled`, `children`, etc.) pass through.

---

## Flow

Pure presentational. No internal state. `isEmphasized` controls the CSS override via `data-emphasized` attribute.

---

## Integration

- **Depends on**: `@adobe/react-spectrum` (`Switch`, `SpectrumSwitchProps`), `clsx`, `./Switch.module.css`.
- **Tokens**: `--energy-blue`, `--energy-blue-light`, `--energy-blue-lighter` from `geti-global.module.css`.
- **Consumed by**: settings panels, feature-flag toggles, on/off preference controls.
