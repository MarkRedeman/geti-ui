# packages/ui/src/components/ui/Divider/

## Responsibility

`Divider` renders a horizontal or vertical visual separator to group and divide content in close proximity. It is a minimal Spectrum wrapper with no Geti-specific extensions.

---

## Design

```tsx
export interface DividerProps extends SpectrumDividerProps {}
export const Divider = (props: DividerProps) => <SpectrumDivider {...props} />;
```

All Spectrum props pass through unchanged:
- `orientation` — `'horizontal'` (default) or `'vertical'`
- `size` — `'S'` | `'M'` | `'L'` controls thickness
- `UNSAFE_className`, `UNSAFE_style`

No CSS module, no Geti-specific props.

---

## Flow

Pure presentational. Stateless.

---

## Integration

- **Depends on**: `@adobe/react-spectrum` (`Divider`, `SpectrumDividerProps`).
- **Consumed by**: dialogs (between header and content), toolbars, sidebars, and any layout requiring a clear visual break between sections.
- **Colour**: inherits from `--spectrum-alias-border-color-mid` or similar tokens set in `geti-dark.module.css`.
