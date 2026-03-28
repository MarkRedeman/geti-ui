import { Icon as SpectrumIcon, type IconProps as SpectrumIconProps } from '@adobe/react-spectrum';

/**
 * Icon wrapper around Adobe React Spectrum's Icon component.
 */
export const Icon = (props: SpectrumIconProps) => <SpectrumIcon {...props} />;

/**
 * Props for the Icon component.
 */
export type IconProps = SpectrumIconProps;
