import { ColorSlider as SpectrumColorSlider, SpectrumColorSliderProps } from '@adobe/react-spectrum';

export interface ColorSliderProps extends SpectrumColorSliderProps {}

/**
 * ColorSliders allow users to adjust an individual channel of a color value.
 */
export const ColorSlider = (props: ColorSliderProps) => {
    return <SpectrumColorSlider {...props} />;
};
