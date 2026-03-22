import { ButtonGroup as SpectrumButtonGroup, SpectrumButtonGroupProps } from '@adobe/react-spectrum';

/**
 * Props for the ButtonGroup component.
 * Extends Spectrum's SpectrumButtonGroupProps.
 */
export interface ButtonGroupProps extends SpectrumButtonGroupProps {}

/**
 * A button group component that wraps Adobe React Spectrum's ButtonGroup.
 * Use it to align and space multiple related actions.
 */
export const ButtonGroup = (props: ButtonGroupProps) => <SpectrumButtonGroup {...props} />;
