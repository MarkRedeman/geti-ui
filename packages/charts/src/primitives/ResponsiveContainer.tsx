import { ResponsiveContainer, type ResponsiveContainerProps } from 'recharts';

export interface GetiResponsiveContainerProps extends Omit<ResponsiveContainerProps, 'width' | 'minWidth'> {
    /** Minimum height for stable chart rendering. @default 120 */
    minHeight?: number;
    /**
     * Minimum width fallback to prevent zero-width rendering in constrained/virtual
     * preview environments. @default 280
     */
    minWidth?: number;
}

export function GetiResponsiveContainer({
    minHeight = 120,
    minWidth = 280,
    height,
    children,
    ...rest
}: GetiResponsiveContainerProps) {
    return (
        <ResponsiveContainer width="100%" minWidth={minWidth} height={height ?? minHeight} {...rest}>
            {children}
        </ResponsiveContainer>
    );
}
