import { ComponentProps, CSSProperties, ReactNode } from 'react';
import { useStyleProps, viewStyleProps } from '@react-spectrum/utils';
import { StyleProps } from '@react-types/shared';
import { Pressable } from 'react-aria-components';

export interface PressableElementProps extends Omit<ComponentProps<typeof Pressable>, 'children'>, StyleProps {
    id?: string;
    isTruncated?: boolean;
    onDoubleClick?: () => void;
    children: ReactNode;
}

const TruncatedTextStyles: CSSProperties = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

// Keys to omit from the div and pass to Pressable
const stylePropKeys = Object.keys(viewStyleProps);
const propsToOmit = [...stylePropKeys, 'UNSAFE_className', 'UNSAFE_style', 'id'];

/**
 * PressableElement is a generic pressable wrapper for arbitrary elements.
 * It combines react-aria-components' Pressable with Spectrum's style props.
 */
export const PressableElement = ({ id, children, isTruncated, onDoubleClick, ...props }: PressableElementProps) => {
    const styles = isTruncated ? TruncatedTextStyles : {};

    // Manual omit for the div since we don't have lodash-es yet or want to keep it simple
    const pressableProps: any = {};
    Object.keys(props).forEach((key) => {
        if (!propsToOmit.includes(key)) {
            (pressableProps as any)[key] = (props as any)[key];
        }
    });

    const { styleProps } = useStyleProps(props);

    return (
        <Pressable {...pressableProps}>
            <div
                {...styleProps}
                id={id}
                style={{ ...styles, ...styleProps.style }}
                onDoubleClick={onDoubleClick}
                role="button"
                tabIndex={0}
            >
                {children}
            </div>
        </Pressable>
    );
};
