# packages/ui/src/components/ui/View/

## Responsibility

`View` is a general-purpose layout container that accepts Spectrum style props (padding, margin, background colour, border, dimensions, etc.) and translates them to real CSS. It is the Geti-library entry point for Spectrum's `View`, re-exported so consumers have a single import path.

---

## Design

```tsx
export const View = (props: React.ComponentProps<typeof SpectrumView>) => <SpectrumView {...props} />;
export type ViewProps = React.ComponentProps<typeof SpectrumView>;
```

**`ViewProps` is inferred** via `React.ComponentProps<typeof SpectrumView>` rather than extending `SpectrumViewProps` directly. This captures the full generic signature of Spectrum's `View` (which is typed with a scale parameter) without needing to replicate its generics manually.

All Spectrum style props pass through unchanged:
- Spacing: `padding`, `paddingX`, `paddingY`, `paddingTop`, etc.
- Sizing: `width`, `height`, `minWidth`, `maxWidth`, etc.
- Colour: `backgroundColor`, `borderColor`
- Position: `position`, `top`, `bottom`, `left`, `right`
- `overflow`, `isHidden`, `id`, `UNSAFE_className`, `UNSAFE_style`

No CSS module, no Geti-specific props.

---

## Flow

Pure presentational. Stateless.

---

## Integration

- **Depends on**: `@adobe/react-spectrum` (`View`).
- **Consumed heavily by**: `PhotoPlaceholder` (as the coloured background container), `CornerIndicator` (as the `position:relative` wrapper), `ColorThumb`, and any component needing a semantically-neutral styled box.
- **`ViewProps` type** is re-exported and used as a base for `PhotoPlaceholderProps` and `ColorThumbProps`, enabling those components to accept all Spectrum style props via spread.
