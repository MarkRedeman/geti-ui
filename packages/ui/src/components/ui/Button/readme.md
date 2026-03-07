# packages/ui/src/components/ui/Button/

## Responsibility

`Button` is the primary call-to-action control. It wraps Adobe React Spectrum's `Button` and re-exports it as the Geti-flavoured entry point. Its single purpose is to:

1. Strip the two legacy Spectrum variants (`cta`, `overBackground`) from the public API so they cannot be used accidentally.
2. Default the `variant` prop to `'accent'` (Geti's energy-blue primary action colour).
3. Merge caller-supplied `UNSAFE_className` cleanly via `clsx` rather than overwriting it.

---

## Design

### Wrapping strategy

```tsx
// Button.tsx (simplified)
type VariantWithoutLegacy = Exclude<SpectrumButtonProps['variant'], 'cta' | 'overBackground'>;

export interface ButtonProps extends Omit<SpectrumButtonProps, 'variant'> {
    variant?: VariantWithoutLegacy;
    UNSAFE_className?: string;
    ref?: FocusableRef<HTMLElement>;
}

export const Button = ({ variant = 'accent', UNSAFE_className, ...rest }: ButtonProps) => (
    <SpectrumButton {...rest} variant={variant} UNSAFE_className={clsx(UNSAFE_className) || undefined} />
);
```

**Key decisions:**
- `Omit<SpectrumButtonProps, 'variant'>` plus the narrowed `variant?` replaces the Spectrum union with the restricted one. TypeScript will reject `variant="cta"` at call sites.
- `clsx(UNSAFE_className) || undefined` normalises empty-string to `undefined` so Spectrum doesn't receive a blank className attribute.
- `FocusableRef<HTMLElement>` is exposed on `ButtonProps` so callers can get a ref to the underlying element via Spectrum's ref model.
- `Button.module.css` exists but is currently empty — reserved for future static overrides.

### Allowed variants

| Variant | Usage |
|---|---|
| `accent` (default) | Primary action — energy-blue fill |
| `primary` | Neutral fill |
| `secondary` | Outlined / ghost |
| `negative` | Destructive action — coral-red fill |

---

## Flow

Pure presentational — props in, Spectrum `Button` out. No state, no context, no side-effects.

---

## Integration

- **Imported by**: `ToggleButtons` (internal composition), `ColorPickerDialog`, and every consumer that needs a labelled call-to-action.
- **Depends on**: `@adobe/react-spectrum` (`Button`, `SpectrumButtonProps`), `@react-types/shared` (`FocusableRef`), `clsx`.
- **Theme**: variant colours (`accent` → energy-blue) resolve from `--spectrum-global-color-*` tokens set by `ThemeProvider`.
