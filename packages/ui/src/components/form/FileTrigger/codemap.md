# packages/ui/src/components/form/FileTrigger/

## Responsibility

`FileTrigger` attaches native file-picker behaviour to any child element (typically a `Button`), opening the OS file chooser dialog when the child is activated. It is the **only form component in this library that wraps `react-aria-components`** rather than `@adobe/react-spectrum`.

## Design

Thin wrapper over `react-aria-components` `FileTrigger`:

```tsx
import { FileTrigger as AriaFileTrigger } from 'react-aria-components';
export interface FileTriggerProps extends AriaFileTriggerProps {}
export const FileTrigger = (props: FileTriggerProps) => <AriaFileTrigger {...props} />;
```

Uses RAC instead of Spectrum because Spectrum does not ship a `FileTrigger` component — RAC's headless primitive is the appropriate base. No CSS module, no styling. Full RAC API preserved: `onSelect`, `acceptedFileTypes`, `allowsMultipleFiles`, `defaultCamera`, `children`.

## Flow

`FileTrigger` renders a hidden `<input type="file">` and clones its child, passing an `onPress` handler that triggers the file input. When the user selects files, `onSelect` fires with a `FileList`. The child component (e.g. a `Button`) retains its own visual rendering — `FileTrigger` is purely behavioural.

## Integration

- **Depends on**: `react-aria-components` (`FileTrigger`, `FileTriggerProps`)
- **Companion**: typically paired with `DropZone` (drag-and-drop) to offer both interaction modes for file selection
- **Used by**: upload triggers, import dialogs, avatar/image pickers
