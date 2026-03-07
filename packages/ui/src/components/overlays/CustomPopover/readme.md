# packages/ui/src/components/overlays/CustomPopover/

## Responsibility

Provides a lower-level, more customisable popover built on `react-aria-components` (RAC) rather than Spectrum's `DialogTrigger`. Offers two usage modes — controlled (caller owns open state, no trigger element) and uncontrolled (trigger element provided) — plus an optional arrow indicator.

## Design

Built entirely on RAC primitives (`Popover`, `DialogTrigger`, `OverlayArrow`, `Dialog`), **not** `@adobe/react-spectrum`. This gives more direct DOM/layout control at the cost of Spectrum's automatic styling.

Two usage modes, selected by the presence of `triggerElement` prop:
- **With `triggerElement`** — wraps content in RAC `DialogTrigger` (uncontrolled open state managed by the trigger element).
- **Without `triggerElement`** — renders bare RAC `AriaPopover` (controlled by caller's `isOpen`/`onOpenChange`).

**Optional arrow** — `showArrow?: boolean` renders `<OverlayArrow><svg viewBox="0 0 12 12">M0 0 L6 6 L12 0</svg></OverlayArrow>` inside the popover. The SVG is a 12×12 triangle pointing toward the trigger.

**Width** — `width?: string` sets both `width` and `minWidth` on the popover's inline style, ensuring consistent sizing.

## Flow

```
// Controlled (no trigger):
props { isOpen, onOpenChange, children, width, showArrow, placement }
  → <AriaPopover isOpen={isOpen} onOpenChange={onOpenChange} style={popoverStyle}>
      {showArrow && <OverlayArrow>...</OverlayArrow>}
      <AriaDialog>{children}</AriaDialog>
    </AriaPopover>

// Uncontrolled (with trigger):
props { triggerElement, children, width, showArrow, placement }
  → <AriaDialogTrigger>
      {triggerElement}
      <AriaPopover style={popoverStyle}>
        {showArrow && <OverlayArrow>...</OverlayArrow>}
        <AriaDialog>{children}</AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
```

## Integration

- Use when `Popover` (Spectrum-based) doesn't offer sufficient layout control or when the arrow indicator is needed.
- Contrast with `Popover` — `CustomPopover` uses RAC directly and is not themed by Spectrum's visual token system; callers must supply their own styling.
- Used by complex editor popovers in the annotation canvas where pixel-accurate placement and arrow direction matter.
