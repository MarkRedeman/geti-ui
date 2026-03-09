import { AlertDialog as SpectrumAlertDialog, SpectrumAlertDialogProps } from '@adobe/react-spectrum';

/**
 * Props for the AlertDialog component.
 * Extends Spectrum's SpectrumAlertDialogProps.
 */
export interface AlertDialogProps extends SpectrumAlertDialogProps {}

/**
 * An alert dialog component that wraps Adobe React Spectrum's AlertDialog.
 * Displays important information that users must acknowledge before proceeding.
 */
export const AlertDialog = (props: AlertDialogProps) => <SpectrumAlertDialog {...props} />;
