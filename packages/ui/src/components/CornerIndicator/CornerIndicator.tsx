import { ReactNode } from 'react';
import { View } from '@adobe/react-spectrum';

export interface CornerIndicatorProps {
    /** Whether the indicator is visible. */
    isActive: boolean;
    /** The element to which the indicator is attached. */
    children: ReactNode;
}

/**
 * CornerIndicator displays a small decorative indicator in the corner of a UI element.
 * It is commonly used to indicate a pending status or a notification.
 */
export const CornerIndicator = ({ isActive, children }: CornerIndicatorProps) => {
    return (
        <View position="relative">
            <View
                position="absolute"
                top="size-50"
                right="size-50"
                width="size-50"
                height="size-50"
                borderRadius="large"
                backgroundColor="blue-700"
                isHidden={!isActive}
            />
            {children}
        </View>
    );
};
