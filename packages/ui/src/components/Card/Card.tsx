// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { View } from '@adobe/react-spectrum';

/**
 * Props for the Card component.
 */
export interface CardProps {
    /** The content to render inside the card. */
    children: React.ReactNode;
    /** Accessible label for the card. */
    'aria-label'?: string;
    /** Whether the card is selected. */
    isSelected?: boolean;
    /** Whether the card is disabled. */
    isDisabled?: boolean;
    /** Callback fired when the card is pressed. */
    onPress?: () => void;
    /** Additional CSS class name. */
    UNSAFE_className?: string;
}

/**
 * A card component for displaying summary content in a contained, styled panel.
 * Built on top of Spectrum's View with accessible button semantics when interactive.
 */
export const Card = ({
    children,
    'aria-label': ariaLabel,
    isSelected = false,
    isDisabled = false,
    onPress,
    UNSAFE_className,
}: CardProps) => {
    const isInteractive = typeof onPress === 'function';

    if (isInteractive) {
        return (
            <View
                borderWidth="thin"
                borderColor={isSelected ? 'focus' : 'mid'}
                borderRadius="medium"
                padding="size-200"
                backgroundColor={isSelected ? 'informative' : 'default'}
                UNSAFE_className={UNSAFE_className}
            >
                <button
                    aria-label={ariaLabel}
                    aria-pressed={isSelected}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    onClick={isDisabled ? undefined : onPress}
                    style={{
                        all: 'unset',
                        display: 'block',
                        width: '100%',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    {children}
                </button>
            </View>
        );
    }

    return (
        <View
            borderWidth="thin"
            borderColor={isSelected ? 'focus' : 'mid'}
            borderRadius="medium"
            padding="size-200"
            backgroundColor="default"
            UNSAFE_className={UNSAFE_className}
        >
            <article aria-label={ariaLabel}>{children}</article>
        </View>
    );
};
