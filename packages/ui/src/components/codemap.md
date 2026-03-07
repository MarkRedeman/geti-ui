# packages/ui/src/components/

## Responsibility

The `components/` directory contains every UI component exported by `@geti/ui`. Components are organised into 8 domain groups, each in its own subdirectory. This maps directly to the 8 export groups in `src/index.ts`.

| Subdirectory | Group name | Contents |
|---|---|---|
| `ui/` | Primitive Actions | Buttons, Avatar, Image, View, Divider, PressableElement, CornerIndicator, PhotoPlaceholder |
| `form/` | Form Controls | Text inputs, Checkbox, Radio, Switch, Slider, DropZone, FileTrigger, Form |
| `form/pickers/` | Form Pickers | Picker, ComboBox, Date/Calendar components, full color picker suite |
| `overlays/` | Overlays | Dialog, AlertDialog, DialogContainer, Popover, CustomPopover, Tooltip, ContextualHelp, FullscreenAction |
| `navigation/` | Navigation | Tabs, Menu, ActionMenu, Breadcrumbs, Link, MediaViewModes |
| `feedback/` | Status & Feedback | Loading, Progress, Meter, Skeleton, Toast, InlineAlert, Badge, StatusLight, IllustratedMessage |
| `data/` | Data Display | TableView, ListView, ListBox, CardView, TagGroup, Tag, ActionBar, TreeView, VirtualizedListLayout, VirtualizedHorizontalGrid |
| `layouts/` | Layout & Structure | Flex, Grid, Well, Card, Accordion, Disclosure |

## Design

**Dominant pattern — thin Spectrum wrapper:**
Every component follows the same structure:
1. Define a local `Props` interface extending the equivalent `@adobe/react-spectrum` or `react-aria-components` type.
2. Add any Geti-specific props (rarely more than 1–2).
3. Render the upstream component, spreading `...rest` to pass all props through.
4. Override only what Geti needs to change (usually `variant`, `colorScheme`, or an `UNSAFE_className`).

```tsx
// canonical pattern
export interface ButtonProps extends SpectrumButtonProps { /* Geti additions */ }
export const Button = ({ variant = 'accent', ...rest }: ButtonProps) => (
    <SpectrumButton {...rest} variant={variant} />
);
```

**File structure per component:**
```
ComponentName/
├── ComponentName.tsx        # Implementation + type exports
├── ComponentName.stories.tsx # Storybook CSF3 stories
├── ComponentName.test.tsx    # rstest unit tests
└── index.ts                  # Optional re-export
```

**CSS override strategy** (in priority order):
1. Spectrum style props (`padding`, `margin`, etc.) — preferred
2. `UNSAFE_className` + CSS Modules — for structural overrides
3. `CSSProperties` with `var(--spectrum-*)` tokens — for runtime-computed values only

**`clsx` for className merging**: whenever a component accepts an `UNSAFE_className` prop from the consumer and also applies its own, `clsx` is used to merge them safely.

**`react-aria-components` (RAC) usage**: a small set of components use RAC instead of Spectrum v3:
- `FileTrigger` — RAC `FileTrigger` (Spectrum v3 has no equivalent)
- `CustomPopover` — RAC `Popover` (needed for unstyled/custom-positioned overlays)
- `VirtualizedListLayout` / `VirtualizedHorizontalGrid` — RAC `Virtualizer` with custom layouts
- `PressableElement` — RAC `PressResponder` / press interaction primitive

**Pure CSS / no-Spectrum components**: a few components have zero Spectrum dependency:
- `Tag` — pure inline CSS with CSS variable tokens
- `Skeleton` — CSS-in-JS shimmer animation
- `Card` (layouts/) — built on Spectrum `View` but with custom interactive/static branching

## Flow

There is no runtime flow within `components/` itself. Each component is stateless (or lightly stateful) and delegates all state management upward to the consumer or to Spectrum/RAC internals.

Data flows: `consumer props → component → Spectrum/RAC primitive → DOM`

The only cross-component wiring happens in composites:
- `ColorPickerDialog` assembles `ColorWheel`, `ColorArea`, `ColorSlider`, `ColorField`, `ColorSwatch`, `Dialog`
- `FullscreenAction` combines `ActionButton` + `DialogTrigger` + fullscreen `Dialog`
- `MediaViewModes` composes `ToggleButtons` + Spectrum workflow icons
- `Accordion` renders a collection of `Disclosure` panels

## Integration

- **`src/index.ts`** is the sole consumer of `components/` — it re-exports every public symbol.
- **`ThemeProvider`** (in `src/theme/`) wraps the entire app and injects Spectrum's React context. All Spectrum-based components require this context to function.
- **`src/utils/distinct-colors.ts`** is used internally by `PhotoPlaceholder` for hash-based avatar colours.
- **Stories** (`.stories.tsx` files) are picked up by Storybook from `.storybook/main.ts` via the glob `src/**/*.stories.tsx`.
- **Tests** (`.test.tsx` files) are picked up by rstest from `rstest.config.ts`.
