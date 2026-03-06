import { FC } from 'react';
import { Flex, Text, View, ViewProps } from '@adobe/react-spectrum';
import { StyleProps } from '@react-types/shared';
import { getDistinctColorBasedOnHash } from '../../utils/distinct-colors';
import { getForegroundColor, hexaToRGBA } from './utils';

export interface PhotoPlaceholderProps extends StyleProps {
    /** The name of the person or entity. */
    name: string;
    /** A unique string used to deterministically pick a background color. */
    indicator: string;
    /** The width of the placeholder. Defaults to 'size-1600'. */
    width?: ViewProps<5>['width'];
    /** The height of the placeholder. Defaults to 'size-1600'. */
    height?: ViewProps<5>['height'];
    /** The border radius of the placeholder. Defaults to '50%'. */
    borderRadius?: string;
}

/**
 * PhotoPlaceholder displays a placeholder for a user's photo with their initials and a deterministic background color.
 */
export const PhotoPlaceholder: FC<PhotoPlaceholderProps> = ({
    name,
    indicator,
    width = 'size-1600',
    height = 'size-1600',
    borderRadius = '50%',
    ...viewProps
}) => {
    const backgroundColor = getDistinctColorBasedOnHash(indicator);
    const letter = (name.trim().length === 0 ? indicator : name).charAt(0);

    const color = getForegroundColor(
        hexaToRGBA(backgroundColor),
        'var(--spectrum-global-color-gray-50)',
        'var(--spectrum-global-color-gray-900)'
    );

    return (
        <View
            width={width}
            minWidth={width}
            minHeight={height}
            height={height}
            UNSAFE_style={{ backgroundColor, color, borderRadius }}
            {...viewProps}
        >
            <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
                <Text>{letter.toUpperCase()}</Text>
            </Flex>
        </View>
    );
};
