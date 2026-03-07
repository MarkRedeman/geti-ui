import { ColorSwatch as SpectrumColorSwatch, SpectrumColorSwatchProps } from '@adobe/react-spectrum';

export interface ColorSwatchProps extends SpectrumColorSwatchProps {}

/**
 * A ColorSwatch displays a preview of a selected color.
 */
export const ColorSwatch = (props: ColorSwatchProps) => {
    return <SpectrumColorSwatch {...props} />;
};
