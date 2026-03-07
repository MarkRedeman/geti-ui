# packages/ui/src/components/ui/

## Responsibility

The `ui/` category is the **foundational primitive layer** of the Geti design system. It contains the core interactive controls and display atoms that every other part of the UI is built upon: buttons in all forms, avatar display, decorative/structural elements, and generic pressable/view containers. These are the lowest-level building blocks — things that do not logically belong to forms, data, navigation, feedback, or layout categories.

Components in this folder:

| Component | Purpose |
|---|---|
| `Button` | Primary call-to-action button (accent/primary/secondary/negative variants) |
| `ActionButton` | Icon-first toolbar action button with Geti `colorVariant` extension |
| `ToggleButton` | Single on/off toggle button (selected/deselected state) |
| `ToggleButtons` | Mutually exclusive button group for view switching or mode selection |
| `Avatar` | Thumbnail for a user or entity |
| `AvatarGroup` | Row of Avatars with overflow count badge |
| `Divider` | Horizontal or vertical visual separator |
| `Image` | Accessible image wrapper |
| `View` | General-purpose styled layout container (Spectrum style props) |
| `CornerIndicator` | Small dot overlay on a child element to signal pending state |
| `PhotoPlaceholder` | Deterministic-colour initials avatar when no photo is available |
| `PressableElement` | Generic Spectrum-style-prop-aware pressable `div` wrapper |

---

## Design

### Wrapping strategy — thin Spectrum wrappers

The vast majority of components here are **thin wrappers around `@adobe/react-spectrum`**. The canonical pattern is:

```tsx
export interface ButtonProps extends Omit<SpectrumButtonProps, 'variant'> {
  variant?: VariantWithoutLegacy;
}
export const Button = ({ variant = 'accent', ...rest }: ButtonProps) => (
  <SpectrumButton {...rest} variant={variant} />
);
```

This achieves three goals:
1. Centralises the import of Spectrum — consumers never import from `@adobe/react-spectrum` directly.
2. Restricts or replaces individual props (e.g. `Button` strips legacy `cta`/`overBackground` variants and defaults to `accent`).
3. Exports a typed `Props` interface so consumers can extend or reference it.

### Geti-specific extensions via `colorVariant` + CSS Modules

`ActionButton` adds a `colorVariant` prop (`dark` | `light` | `blue`). The mapping to CSS classes lives in `ActionButton.module.css` and is resolved by a `COLOR_VARIANT_CLASSES` record. This pattern — Geti-specific prop → CSS module class → applied via `UNSAFE_className` + `clsx` — is the approved mechanism for style overrides that don't have a Spectrum prop equivalent.

### Composite primitives built on top of `Button`/`View`

`ToggleButtons` is custom-built from the library's own `Button` rather than wrapping a Spectrum component. It manages a generic `selectedOption` value and renders a `role="group"` div of `Button` children with `aria-pressed`. This shows the pattern for stateful Geti-specific controls built from lower-level atoms.

`PhotoPlaceholder` renders a Spectrum `View` with a computed `backgroundColor` (from a hash function), an inner centred text initial, and runtime `UNSAFE_style` for the three computed values only. Static layout CSS lives in the CSS module.

`CornerIndicator` wraps any child in a `View position="relative"` and conditionally overlays a small `role="status"` dot using Spectrum dimension tokens (`--spectrum-global-dimension-size-*`).

`AvatarGroup` wraps multiple `Avatar` instances in an inline flex row with a negative-margin overlap effect and an overflow badge, all via inline `CSSProperties` objects using Spectrum global color tokens.

`PressableElement` bridges `react-aria-components`' `Pressable` with Spectrum's `useStyleProps`/`viewStyleProps`, enabling arbitrary elements to accept Spectrum style props (padding, margin, backgroundColor, etc.) while still being keyboard/pointer accessible.

### Key rules

- **No Tailwind** — all styling is via Spectrum style props, `UNSAFE_className` (CSS modules), or Spectrum CSS variable tokens in inline styles.
- **`UNSAFE_className` merged with `clsx`** — never overwrite a caller-supplied `UNSAFE_className`; always merge.
- **`UNSAFE_style` only for runtime-computed values** — static layout belongs in a CSS module.
- Legacy Spectrum variants (`cta`, `overBackground`) are excluded from re-exported types.

---

## Flow

Components here are **pure presentational** — they receive props and render. There is no context, no global state, no side-effects. Data flow is strictly prop-in → render-out.

The only partial exception is `PressableElement`, which calls `useStyleProps` from `@react-spectrum/utils` to translate Spectrum-flavoured style props into a real CSS `style` object.

---

## Integration

- **Consumed by**: every other component category (`form/`, `data/`, `navigation/`, `feedback/`, `overlays/`, `layouts/`) imports from `ui/` to compose higher-level components.
- **Depends on**: `@adobe/react-spectrum` (Spectrum primitives), `react-aria-components` (`Pressable`), `@react-spectrum/utils` (`useStyleProps`), `@react-types/shared` (type aliases).
- **Theme**: components automatically receive Geti's dark theme tokens because they are always rendered inside `ThemeProvider`, which sets the Spectrum `Provider` context.
- **Exports**: all public exports flow up through `packages/ui/src/index.ts`.
