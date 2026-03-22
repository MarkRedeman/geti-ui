import { Content as SpectrumContent } from '@adobe/react-spectrum';

/**
 * Props for the Content component.
 * Extends Spectrum's SpectrumContentProps.
 */
export type ContentProps = React.ComponentProps<typeof SpectrumContent>;

/**
 * A content region component that wraps Adobe React Spectrum's Content.
 * Intended for dialog and card content areas.
 */
export const Content = (props: ContentProps) => <SpectrumContent {...props} />;
