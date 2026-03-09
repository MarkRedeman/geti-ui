import { DialogContainer as SpectrumDialogContainer, SpectrumDialogContainerProps } from '@adobe/react-spectrum';

/**
 * Props for the DialogContainer component.
 * Extends Spectrum's SpectrumDialogContainerProps.
 */
export interface DialogContainerProps extends SpectrumDialogContainerProps {}

/**
 * A dialog container component that wraps Adobe React Spectrum's DialogContainer.
 * Accepts a single Dialog as a child and manages showing/hiding it in a modal.
 * Useful when there is no persistent trigger element, or the trigger unmounts while the dialog is open.
 */
export const DialogContainer = (props: DialogContainerProps) => <SpectrumDialogContainer {...props} />;
