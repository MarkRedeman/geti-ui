import { Heading as SpectrumHeading } from '@adobe/react-spectrum';

/**
 * Heading wrapper around Adobe React Spectrum's Heading component.
 */
export const Heading = (props: React.ComponentProps<typeof SpectrumHeading>) => <SpectrumHeading {...props} />;

/**
 * Props for the Heading component.
 */
export type HeadingProps = React.ComponentProps<typeof SpectrumHeading>;
