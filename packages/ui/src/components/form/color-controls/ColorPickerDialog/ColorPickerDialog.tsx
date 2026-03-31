import { ColorPicker as SpectrumColorPicker, ColorEditor, parseColor, type Color } from '@adobe/react-spectrum';
import { ColorSwatch } from '../color-swatch/ColorSwatch';
import { ColorSwatchPicker } from '../color-swatch/ColorSwatchPicker';
import { Flex } from '../../../layouts/Flex/Flex';
import { DISTINCT_COLORS } from '../../../../utils/distinct-colors';

export interface ColorPickerDialogProps {
    /** The current color value (any CSS color string). */
    color?: string;
    /** Callback called with a hex string when the color changes. */
    onColorChange?: (color: string) => void;
    /** A visible label for the color picker trigger. */
    label?: string;
    /**
     * An array of hex color strings to display as preset swatches.
     * Defaults to `DISTINCT_COLORS`.
     */
    swatches?: string[];
}

const DEFAULT_COLOR = 'hsb(0, 100%, 100%)';

/**
 * Safely parses a color string into a Color object.
 * Falls back to red if the value is undefined or unparseable.
 */
const safeParseColor = (value: string | undefined): Color => {
    if (!value) {
        return parseColor(DEFAULT_COLOR);
    }
    try {
        return parseColor(value);
    } catch {
        console.warn(`[ColorPickerDialog] Invalid color value: "${value}". Falling back to default.`);
        return parseColor(DEFAULT_COLOR);
    }
};

/**
 * A ColorPickerDialog combines a color swatch trigger with a popover containing
 * a ColorEditor (color area, hue slider, and color fields) and a ColorSwatchPicker
 * for quick preset selection.
 *
 * Built on top of React Spectrum's `ColorPicker` and `ColorEditor`.
 */
export const ColorPickerDialog = ({
    color: colorProp,
    onColorChange,
    label = 'Pick Color',
    swatches = DISTINCT_COLORS,
}: ColorPickerDialogProps) => {
    const handleChange = (c: Color) => {
        onColorChange?.(c.toString('hex'));
    };

    return (
        <SpectrumColorPicker label={label} defaultValue={safeParseColor(colorProp)} onChange={handleChange}>
            <Flex direction="column" gap="size-300">
                <ColorEditor hideAlphaChannel />
                <ColorSwatchPicker size="S" maxWidth="size-2400">
                    {swatches.map((hex) => (
                        <ColorSwatch key={hex} color={hex} />
                    ))}
                </ColorSwatchPicker>
            </Flex>
        </SpectrumColorPicker>
    );
};
