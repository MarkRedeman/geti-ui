import { ColorArea as SpectrumColorArea, SpectrumColorAreaProps } from '@adobe/react-spectrum';

export interface ColorAreaProps extends SpectrumColorAreaProps {}

/**
 * ColorArea allows users to adjust two channels of an RGB, HSL or HSB color value against a two-dimensional gradient background.
 */
export const ColorArea = (props: ColorAreaProps) => {
    return <SpectrumColorArea {...props} />;
};
