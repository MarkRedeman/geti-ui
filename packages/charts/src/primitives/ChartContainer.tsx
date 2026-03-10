import type { CSSProperties, ReactNode } from 'react';
import { useChartsTheme } from '../hooks/useChartsTheme';

export interface ChartContainerProps {
    /** Width of the chart container. Defaults to '100%'. */
    width?: CSSProperties['width'];
    /** Height of the chart container. Defaults to 300. */
    height?: CSSProperties['height'];
    /** Optional CSS class name. */
    className?: string;
    /** Optional inline styles merged with theme background. */
    style?: CSSProperties;
    /** Chart content. */
    children: ReactNode;
    /** ARIA label for the chart container (accessibility). */
    'aria-label'?: string;
    /** ARIA labelledby for the chart container (accessibility). */
    'aria-labelledby'?: string;
}

/**
 * Responsive wrapper div that sets the chart's background, dimensions,
 * and accessibility role. All chart components should be nested inside this.
 *
 * @example
 * ```tsx
 * <ChartContainer height={400} aria-label="Monthly sales chart">
 *   <LineChart ... />
 * </ChartContainer>
 * ```
 */
export function ChartContainer({
    width = '100%',
    height = 300,
    className,
    style,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}: ChartContainerProps) {
    const theme = useChartsTheme();

    return (
        <div
            role="img"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={className}
            style={{
                width,
                height,
                backgroundColor: theme.backgroundColor,
                position: 'relative',
                ...style,
            }}
        >
            {children}
        </div>
    );
}
