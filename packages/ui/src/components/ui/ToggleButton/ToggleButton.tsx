import { ToggleButton as SpectrumToggleButton, SpectrumToggleButtonProps } from '@adobe/react-spectrum';

/**
 * Props for the ToggleButton component.
 * Extends Spectrum's ToggleButtonProps without modification.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToggleButtonProps extends SpectrumToggleButtonProps {}

/**
 * A toggle button component wrapping Adobe React Spectrum's ToggleButton.
 * Supports selected/deselected states with optional emphasis and quiet styles.
 */
export const ToggleButton = (props: ToggleButtonProps) => <SpectrumToggleButton {...props} />;
