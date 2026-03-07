# packages/ui/src/components/ui/CornerIndicator/

## Responsibility

`CornerIndicator` overlays a small coloured dot in the top-right corner of any child element to signal a pending state or notification. It is a **decorator** — it wraps arbitrary content and conditionally renders the dot without modifying the child.

---

## Design

### Structure

```tsx
<View position="relative">        // Spectrum View — establishes positioning context
    {isActive && (
        <div                       // The indicator dot
            style={{ position: 'absolute', top: ..., right: ..., ... }}
            role="status"
            aria-label="Pending change"
        />
    )}
    {children}
</View>
```

### Sizing via Spectrum dimension tokens

The dot's position and size use Spectrum global dimension tokens in inline styles:

| Property | Token | Value at medium scale |
|---|---|---|
| `top`, `right` | `--spectrum-global-dimension-size-50` | 4 px |
| `width`, `height` | `--spectrum-global-dimension-size-50` | 4 px |
| `borderRadius` | `--spectrum-global-dimension-size-100` | 8 px (full round) |
| `backgroundColor` | `--spectrum-global-color-blue-700` | Geti energy-blue |

Using tokens ensures the dot scales with Spectrum's medium/large scale settings.

### Accessibility

`role="status"` and `aria-label="Pending change"` make the indicator a live region that screen readers can announce. The dot is only rendered (and thus announced) when `isActive` is `true`.

---

## Flow

Pure presentational — no state. Toggle is entirely controlled by the `isActive` prop.

---

## Integration

- **Depends on**: `@adobe/react-spectrum` (`View`), React (`ReactNode`).
- **Consumed by**: toolbar buttons, list items, thumbnail cells — any widget that needs a pending/notification badge without structural changes to the underlying component.
- **Note**: imports `View` from `@adobe/react-spectrum` directly (not from `../View/View`). This is an exception to the centralised-import rule; both resolve identically at runtime.
