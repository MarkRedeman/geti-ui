import { Footer as SpectrumFooter } from '@adobe/react-spectrum';

/**
 * Props for the Footer component.
 */
export type FooterProps = React.ComponentProps<typeof SpectrumFooter>;

/**
 * A footer region component that wraps Adobe React Spectrum's Footer.
 * Intended for dialog actions and footer content.
 */
export const Footer = (props: FooterProps) => <SpectrumFooter {...props} />;
