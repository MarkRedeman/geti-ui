import { Text as SpectrumText } from '@adobe/react-spectrum';

/**
 * Inline text wrapper around Adobe React Spectrum's Text component.
 */
export const Text = (props: React.ComponentProps<typeof SpectrumText>) => <SpectrumText {...props} />;

/**
 * Props for the Text component.
 */
export type TextProps = React.ComponentProps<typeof SpectrumText>;
