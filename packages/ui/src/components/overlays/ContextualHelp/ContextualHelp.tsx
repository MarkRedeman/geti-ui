import { ContextualHelp as SpectrumContextualHelp, SpectrumContextualHelpProps } from '@adobe/react-spectrum';

/**
 * Props for the ContextualHelp component.
 * Extends Spectrum's SpectrumContextualHelpProps.
 */
export interface ContextualHelpProps extends SpectrumContextualHelpProps {}

/**
 * A contextual help component that wraps Adobe React Spectrum's ContextualHelp.
 * Shows a user extra information about adjacent UI in a popover triggered by a small icon button.
 */
export const ContextualHelp = (props: ContextualHelpProps) => <SpectrumContextualHelp {...props} />;
