import { CSSProperties } from 'react';

import { clsx } from 'clsx';

import { View, ViewProps } from '../../../ui/View/View';
import styles from './ColorThumb.module.css';

/** Allows CSS custom properties to be safely included in a React style object. */
type CSSPropertiesWithVars = CSSProperties & Record<`--${string}`, string>;

export interface ColorThumbProps extends ViewProps {
    /** The color to display in the thumb. */
    color: string;
    /** The size of the thumb (width and height). Defaults to 10. */
    size?: number;
}

/**
 * A ColorThumb is a small square display of a color.
 *
 * Static layout (display: block) lives in `ColorThumb.module.css`.
 * The background color is the only dynamic value; it is threaded through
 * the `--color-thumb-bg` CSS custom property so the CSS module owns the
 * `background-color` declaration and JavaScript only sets a variable.
 *
 * Based on the reference implementation in Geti.
 */
export const ColorThumb = ({ color, size = 10, UNSAFE_className, UNSAFE_style, ...rest }: ColorThumbProps) => {
    return (
        <View
            {...rest}
            width={size}
            height={size}
            UNSAFE_className={clsx(styles.colorThumb, UNSAFE_className)}
            UNSAFE_style={
                {
                    '--color-thumb-bg': color,
                    ...UNSAFE_style,
                } as CSSPropertiesWithVars
            }
        />
    );
};
