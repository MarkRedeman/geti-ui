import { StatusLight as SpectrumStatusLight, SpectrumStatusLightProps } from '@adobe/react-spectrum';

/**
 * Props for the StatusLight component.
 * Extends Spectrum's SpectrumStatusLightProps.
 */
export interface StatusLightProps extends SpectrumStatusLightProps {}

/**
 * A status light component that wraps Adobe React Spectrum's StatusLight.
 * Status lights are used to color code categories and labels commonly found in data visualization.
 * When status lights have a semantic meaning, they should use semantic variant colors.
 */
export const StatusLight = (props: StatusLightProps) => <SpectrumStatusLight {...props} />;
