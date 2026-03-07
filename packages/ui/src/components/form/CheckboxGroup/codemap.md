# packages/ui/src/components/form/CheckboxGroup/

## Responsibility

`CheckboxGroup` groups multiple `Checkbox` instances under a shared label, managing their collective selection state and accessibility relationships. It exists as a thin wrapper over Adobe React Spectrum's `CheckboxGroup` so the Geti codebase never imports Spectrum directly.

## Design

Pure pass-through — all props forwarded unchanged to `SpectrumCheckboxGroup`:

```tsx
export interface CheckboxGroupProps extends SpectrumCheckboxGroupProps {}
export const CheckboxGroup = (props: CheckboxGroupProps) => <SpectrumCheckboxGroup {...props} />;
```

No CSS module, no `UNSAFE_className`, no internal state. The full Spectrum API is preserved: `label`, `value`, `defaultValue`, `onChange`, `isDisabled`, `isRequired`, `orientation`, `validationState`, etc.

## Flow

Props in → forwarded unchanged to `SpectrumCheckboxGroup` → Spectrum renders an accessible `<fieldset>`-equivalent with `role="group"`, `aria-labelledby`, and manages checked state across all child `Checkbox` instances.

## Integration

- **Depends on**: `@adobe/react-spectrum` (`CheckboxGroup`, `SpectrumCheckboxGroupProps`)
- **Companion**: `Checkbox` — individual items rendered as children of `CheckboxGroup`
- **Used by**: filter panels, permission editors, multi-select form sections
