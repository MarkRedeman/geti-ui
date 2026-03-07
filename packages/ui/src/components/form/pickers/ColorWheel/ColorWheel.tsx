import { ColorWheel as SpectrumColorWheel, SpectrumColorWheelProps } from '@adobe/react-spectrum';

export interface ColorWheelProps extends SpectrumColorWheelProps {}

/**
 * ColorWheels allow users to adjust the hue of an HSL or HSB color value on a circular track.
 */
export const ColorWheel = (props: ColorWheelProps) => {
    return <SpectrumColorWheel {...props} />;
};
