import { View, ViewProps } from '../View/View';

export interface ColorThumbProps extends ViewProps {
    /** The color to display in the thumb. */
    color: string;
    /** The size of the thumb (width and height). Defaults to 10. */
    size?: number;
}

/**
 * A ColorThumb is a small square display of a color.
 * Based on the reference implementation in Geti.
 */
export const ColorThumb = ({ color, size = 10, ...rest }: ColorThumbProps) => {
    return (
        <View
            {...rest}
            UNSAFE_style={{
                ...rest.UNSAFE_style,
                backgroundColor: color,
                width: size,
                height: size,
            }}
        />
    );
};
