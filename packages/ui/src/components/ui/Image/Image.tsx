import { Image as SpectrumImage } from '@adobe/react-spectrum';
import type { SpectrumImageProps } from '@adobe/react-spectrum';

/**
 * Props for the Image component.
 * Extends Spectrum's SpectrumImageProps.
 */
export interface ImageProps extends SpectrumImageProps {}

/**
 * An image component that wraps Adobe React Spectrum's Image.
 * Provides accessible image rendering with support for alt text,
 * object-fit, and decorative image handling.
 */
export const Image = (props: ImageProps) => <SpectrumImage {...props} />;
