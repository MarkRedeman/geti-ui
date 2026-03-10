import { CartesianGrid } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';

export interface ChartGridProps {
    /** Show horizontal grid lines. Defaults to true. */
    horizontal?: boolean;
    /** Show vertical grid lines. Defaults to false. */
    vertical?: boolean;
    /** Override grid stroke color (uses theme value by default). */
    stroke?: string;
    /** Override stroke dash array (uses theme value by default). */
    strokeDasharray?: string;
    /** Override stroke opacity (uses theme value by default). */
    strokeOpacity?: number;
}

/**
 * Themed CartesianGrid wrapper for use inside Recharts chart components.
 * Reads stroke and dash settings from the active chart theme.
 *
 * Must be rendered as a direct child of a Recharts chart component.
 *
 * @example
 * ```tsx
 * <LineChart data={data}>
 *   <ChartGrid />
 * </LineChart>
 * ```
 */
export function ChartGrid({
    horizontal = true,
    vertical = false,
    stroke,
    strokeDasharray,
    strokeOpacity,
}: ChartGridProps) {
    const theme = useChartsTheme();

    return (
        <CartesianGrid
            horizontal={horizontal}
            vertical={vertical}
            stroke={stroke ?? theme.grid.stroke}
            strokeDasharray={strokeDasharray ?? theme.grid.strokeDasharray}
            strokeOpacity={strokeOpacity ?? theme.grid.strokeOpacity}
        />
    );
}
ChartGrid.displayName = 'CartesianGrid';
