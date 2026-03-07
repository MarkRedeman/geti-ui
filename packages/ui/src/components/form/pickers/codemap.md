# packages/ui/src/components/form/pickers/

## Responsibility

Houses all picker and color-input components: date/time pickers, dropdown pickers, comboboxes, and the full suite of color-selection primitives. Every component here follows the same thin-wrapper pattern over `@adobe/react-spectrum`, with two exceptions: `ColorThumb` (fully custom, built on the library's own `View`) and `ColorPickerDialog` (a stateful composite that orchestrates multiple color primitives).

## Design

**Dominant pattern — thin wrapper:**
```tsx
export interface PickerProps<T extends object> extends SpectrumPickerProps<T> {}
export const Picker = <T extends object>(props: PickerProps<T>) => <SpectrumPicker {...props} />;
```
All props forwarded unchanged; no CSS overrides; Spectrum owns all rendering and accessibility.

**Date/time pickers — Safari mobile fix:**
`DatePicker` and `DateRangePicker` hard-code `width="size-2400"` before spreading `...props` to prevent layout flickering on Safari mobile. Callers can override with an explicit `width` prop since spread comes after.

**DateField / Calendar — dual-export files:**
`DateField.tsx` exports both `DateField` and `TimeField`. `Calendar.tsx` exports both `Calendar` and `RangeCalendar`. Both use type-alias exports (`export type { Spectrum... as ... }`) rather than `interface extends`.

**ColorThumb — custom component:**
Does not wrap Spectrum. Uses the library's own `View` + a CSS module. Background color is injected via `--color-thumb-bg` CSS custom property set in `UNSAFE_style`, so the module's `background-color` declaration stays in CSS rather than JS.

**ColorPickerDialog — stateful composite:**
Imports all color primitives directly from `@adobe/react-spectrum` (not library wrappers). Manages a `useState<Color>` draft while the dialog is open; only commits to the caller via `onColorChange` when the Confirm button is pressed. Cancel discards the draft.

## Flow

For thin wrappers: props in → forwarded to Spectrum → Spectrum renders accessible date/color/picker input.

For `ColorPickerDialog`: `color` prop (string) → `parseColor()` → `useState<Color>` draft → user manipulates `ColorArea`/`ColorWheel`/`ColorSlider`/`ColorField`/`ColorSwatchPicker` → Confirm → `color.toString('hex')` → `onColorChange` callback.

## Integration

- **Depends on**: `@adobe/react-spectrum`, `@react-types/datepicker`, `@react-types/shared`, library's own `View` (for `ColorThumb`)
- **Consumed by**: form surfaces requiring date selection, color picking, or option selection
- **Sub-components exported**: `Item` re-exported from `ComboBox` and `Picker` for option children
