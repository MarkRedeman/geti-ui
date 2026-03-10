import {
    ResponsiveContainer,
    type ResponsiveContainerProps,
} from 'recharts';

export interface GetiResponsiveContainerProps
    extends Omit<ResponsiveContainerProps, 'width'> {
    /** Minimum height for stable chart rendering. @default 120 */
    minHeight?: number;
}

export function GetiResponsiveContainer({
    minHeight = 120,
    height,
    children,
    ...rest
}: GetiResponsiveContainerProps) {
    return (
        <ResponsiveContainer width="100%" height={height ?? minHeight} {...rest}>
            {children}
        </ResponsiveContainer>
    );
}
