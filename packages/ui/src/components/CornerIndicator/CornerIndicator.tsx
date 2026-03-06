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
            {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'var(--spectrum-global-dimension-size-50)',
                        right: 'var(--spectrum-global-dimension-size-50)',
                        width: 'var(--spectrum-global-dimension-size-50)',
                        height: 'var(--spectrum-global-dimension-size-50)',
                        borderRadius: 'var(--spectrum-global-dimension-size-100)',
                        backgroundColor: 'var(--spectrum-global-color-blue-700)',
                        zIndex: 1,
                    }}
                    role="status"
                    aria-label="Pending change"
                />
            )}
            {children}
        </View>
    );
};
