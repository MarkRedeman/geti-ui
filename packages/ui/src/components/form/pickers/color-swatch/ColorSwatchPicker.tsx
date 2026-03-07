import {
    ColorSwatchPicker as SpectrumColorSwatchPicker,
    ColorSwatch as SpectrumColorSwatch,
    SpectrumColorSwatchPickerProps,
    SpectrumColorSwatchProps,
} from '@adobe/react-spectrum';

export interface ColorSwatchPickerProps extends SpectrumColorSwatchPickerProps {}

/**
 * A ColorSwatchPicker displays a list of color swatches and allows a user to select one of them.
 */
export const ColorSwatchPicker = (props: ColorSwatchPickerProps) => {
    return <SpectrumColorSwatchPicker {...props} />;
};

export interface ColorSwatchPickerItemProps extends SpectrumColorSwatchProps {}

/**
 * A ColorSwatchPickerItem represents an individual color swatch within a ColorSwatchPicker.
 * In React Spectrum v3, this is just a ColorSwatch.
 */
export const ColorSwatchPickerItem = (props: ColorSwatchPickerItemProps) => {
    return <SpectrumColorSwatch {...props} />;
};
