import { Legend, type LegendProps } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';

export interface ChartLegendProps extends Omit<LegendProps, 'ref'> {
    /**
     * Legend position relative to the chart.
     * @default 'bottom'
     */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /**
     * Horizontal alignment of the legend.
     * @default 'center'
     */
    align?: 'left' | 'center' | 'right';
}

/**
 * Themed Recharts Legend wrapper.
 * Picks up color and icon size from the active chart theme.
 *
 * Must be rendered as a direct child of a Recharts chart component.
 *
 * @example
 * ```tsx
 * <LineChart data={data}>
 *   <ChartLegend />
 * </LineChart>
 * ```
 */
export function ChartLegend({
    verticalAlign = 'bottom',
    align = 'center',
    itemSorter = null,
    ...rest
}: ChartLegendProps) {
    const theme = useChartsTheme();

    return (
        <Legend
            verticalAlign={verticalAlign}
            align={align}
            itemSorter={itemSorter}
            iconSize={theme.legend.iconSize}
            wrapperStyle={{
                color: theme.legend.color,
                fontSize: theme.typography.fontSize,
                fontFamily: theme.typography.fontFamily,
                paddingTop: verticalAlign === 'bottom' ? 8 : 0,
                paddingBottom: verticalAlign === 'top' ? 8 : 0,
            }}
            {...rest}
        />
    );
}
ChartLegend.displayName = 'Legend';
