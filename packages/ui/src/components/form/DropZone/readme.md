# packages/ui/src/components/form/DropZone/

## Responsibility

`DropZone` is a drag-and-drop target area where users can drop files or objects. It wraps Adobe React Spectrum's `DropZone`, providing a labelled region with visual feedback during drag interactions.

## Design

Thin wrapper with a `SpectrumDropZoneProps` type alias exported as `DropZoneProps`:

```tsx
export const DropZone = (props: SpectrumDropZoneProps) => <SpectrumDropZone {...props} />;
export type { SpectrumDropZoneProps as DropZoneProps };
```

Note: unlike most form components, `DropZoneProps` is a type alias (`export type { ... as DropZoneProps }`) rather than a new interface — the upstream type is re-exported directly. No CSS module, no styling overrides.

Full Spectrum API preserved: `onDrop`, `onDropEnter`, `onDropExit`, `isFilled`, `isDisabled`, `replaceMessage`, `children`.

## Flow

Props in → forwarded to `SpectrumDropZone` → Spectrum manages the drag-over state (`isDropTarget`), renders visual highlight on drag enter/exit, and fires `onDrop` with a `DropEvent` containing the dropped items when the user releases.

## Integration

- **Depends on**: `@adobe/react-spectrum` (`DropZone`, `SpectrumDropZoneProps`)
- **Companion**: typically paired with `FileTrigger` (for click-to-browse) to provide both drag-and-drop and button-based file selection in one surface
- **Used by**: file upload panels, dataset import dialogs
