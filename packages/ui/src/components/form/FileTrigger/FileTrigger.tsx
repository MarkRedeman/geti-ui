import { FileTrigger as AriaFileTrigger } from 'react-aria-components';
import type { FileTriggerProps as AriaFileTriggerProps } from 'react-aria-components';

/**
 * Props for the FileTrigger component.
 * Extends react-aria-components FileTriggerProps without modification.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FileTriggerProps extends AriaFileTriggerProps {}

/**
 * A file trigger component wrapping react-aria-components' FileTrigger.
 * Attaches file input behaviour to a child element (typically a Button),
 * opening the native file picker dialog when the child is activated.
 */
export const FileTrigger = (props: FileTriggerProps) => <AriaFileTrigger {...props} />;
