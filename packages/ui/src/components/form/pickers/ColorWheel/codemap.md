# packages/ui/src/components/form/pickers/ColorWheel/

## Responsibility

`ColorWheel` lets users adjust the hue of an HSL or HSB color by rotating a thumb around a circular hue ring. It wraps Spectrum's `ColorWheel`.

## Design

Pure thin wrapper:

```tsx
export interface ColorWheelProps extends SpectrumColorWheelProps {}
export const ColorWheel = (props: ColorWheelProps) => <SpectrumColorWheel {...props} />;
```

Key props: `value`, `onChange`, `size` (diameter in pixels), `isDisabled`. Spectrum renders the circular gradient track and draggable thumb with full keyboard/ARIA support.

## Flow

Props in → forwarded to `SpectrumColorWheel` → user drags thumb around circle or uses arrow keys → `onChange` fires with a `Color` value whose hue channel is updated.

## Integration

- **Depends on**: `@adobe/react-spectrum` (`ColorWheel`, `SpectrumColorWheelProps`)
- **Composed into**: `ColorPickerDialog` places `ColorWheel` beside `ColorField` for combined hue + hex editing
- **Used alongside**: `ColorArea` (saturation/brightness 2D) and `ColorSlider` (alpha/individual channels)
