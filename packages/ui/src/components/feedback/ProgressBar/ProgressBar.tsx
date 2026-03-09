import { ProgressBar as SpectrumProgressBar, SpectrumProgressBarProps } from '@adobe/react-spectrum';

/**
 * Props for the ProgressBar component.
 * Extends Spectrum's SpectrumProgressBarProps.
 */
export interface ProgressBarProps extends SpectrumProgressBarProps {}

/**
 * A progress bar component that wraps Adobe React Spectrum's ProgressBar.
 * Displays the progression of an operation over time, with support for
 * determinate and indeterminate states.
 */
export const ProgressBar = (props: ProgressBarProps) => <SpectrumProgressBar {...props} />;
