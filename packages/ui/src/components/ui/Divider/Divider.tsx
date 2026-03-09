import { Divider as SpectrumDivider, SpectrumDividerProps } from '@adobe/react-spectrum';

/**
 * Props for the Divider component.
 * Extends Spectrum's SpectrumDividerProps.
 */
export interface DividerProps extends SpectrumDividerProps {}

/**
 * A divider component that wraps Adobe React Spectrum's Divider.
 * Dividers bring clarity to a layout by grouping and dividing content in close proximity.
 */
export const Divider = (props: DividerProps) => <SpectrumDivider {...props} />;
