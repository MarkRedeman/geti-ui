# packages/ui/src/components/form/TextField/

## Responsibility

Provides a single-line text input primitive. A minimal Spectrum wrapper whose sole role is to centralise the import of `SpectrumTextField` so consumers never reference `@adobe/react-spectrum` directly.

## Design

Pure thin wrapper — no props are altered, no additional logic:

```tsx
export interface TextFieldProps extends SpectrumTextFieldProps {}
export const TextField = (props: TextFieldProps) => <SpectrumTextField {...props} />;
```

`TextFieldProps` extends `SpectrumTextFieldProps` without modification, preserving the full Spectrum API surface (label, value, onChange, errorMessage, isDisabled, isRequired, validationState, width, etc.).

## Flow

Fully controlled or uncontrolled by the consumer. `value` + `onChange` for controlled; omit both for uncontrolled. Spectrum manages the ARIA state (`aria-invalid`, `aria-describedby`) internally.

## Integration

- **Depends on**: `@adobe/react-spectrum` (`TextField`, `SpectrumTextFieldProps`)
- **Used by**: any form in the library requiring a single-line text input
- **Composed into**: `PasswordField` uses Spectrum's `TextField` directly (not this wrapper) for its inner input
