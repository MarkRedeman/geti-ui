import { Well as SpectrumWell, SpectrumWellProps } from '@adobe/react-spectrum';

/**
 * Props for the Well component.
 * Extends Spectrum's SpectrumWellProps.
 */
export interface WellProps extends SpectrumWellProps {}

/**
 * A content container that wraps Adobe React Spectrum's Well.
 * Wells display non-editable content separately from other content on the screen,
 * often used for preformatted text or code/markup examples.
 */
export const Well = (props: WellProps) => <SpectrumWell {...props} />;
