# packages/ui/src/components/data/Tag/

## Responsibility

Renders a Geti-styled label chip with optional prefix, suffix, accent dot, tooltip, and dark/light mode. Used as the visual building block for annotation labels, classification results, and taxonomy entries throughout the Geti UI. This is a fully custom component — zero Spectrum dependency.

## Design

The most design-system-native component in the data/ category. Key characteristics:

- **No Spectrum** — styling is 100% inline `CSSProperties` using global CSS custom properties (`var(--spectrum-global-color-gray-100)`, `var(--energy-blue)`). Works inside or outside Spectrum's theming context as long as those CSS variables are present.
- **Accent dot** — `withDot?: boolean` (default `true`) renders a small round indicator using `var(--energy-blue)` before the text. Identifies Geti annotation labels visually.
- **Dark mode toggle** — `darkMode?: boolean` switches `backgroundColor` between `var(--spectrum-global-color-gray-200)` (dark) and `var(--spectrum-global-color-gray-100)` (light).
- **Prefix/suffix** — optional `ReactNode` slots rendered before/after the text with consistent spacing.
- **Tooltip** — optional `tooltip?: string` wraps the entire chip in a Spectrum `TooltipTrigger` + `Tooltip` pair (from `@adobe/react-spectrum`). This is the only Spectrum usage in the component.
- **Props**: `text`, `prefix?`, `suffix?`, `withDot?`, `darkMode?`, `tooltip?`, `id?`, `className?`, `style?`.

## Flow

```
props { text, prefix, suffix, withDot, darkMode, tooltip, ...htmlProps }
  → chipElement = <div style={chipStyle}>
      {withDot && <span style={dotStyle} />}
      {prefix}
      <span>{text}</span>
      {suffix}
    </div>
  → if tooltip:
      <TooltipTrigger>
        {chipElement}
        <Tooltip>{tooltip}</Tooltip>
      </TooltipTrigger>
    else:
      {chipElement}
```

## Integration

- Used directly in annotation overlay labels, label palette items, and classification result displays.
- `TagGroup` (same data/ category) wraps Spectrum's `TagGroup` for interactive tag collections with removal. `Tag` here is not the same as Spectrum's `Tag` — it is a fully independent Geti primitive.
- The `--energy-blue` CSS variable must be present in the global stylesheet (defined in `geti-global.module.css` or the Geti theme tokens).
