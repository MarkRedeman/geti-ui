import { ProgressCircle as SpectrumProgressCircle, SpectrumProgressCircleProps } from '@adobe/react-spectrum';

/**
 * Props for the ProgressCircle component.
 * Extends Spectrum's SpectrumProgressCircleProps.
 */
export interface ProgressCircleProps extends SpectrumProgressCircleProps {}

/**
 * A circular progress indicator component that wraps Adobe React Spectrum's ProgressCircle.
 * Displays the progression of an operation in a circular form, with support for
 * determinate and indeterminate states.
 */
export const ProgressCircle = (props: ProgressCircleProps) => <SpectrumProgressCircle {...props} />;
