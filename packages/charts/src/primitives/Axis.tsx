import {
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';

export interface GetiXAxisProps extends XAxisProps {}
export interface GetiYAxisProps extends YAxisProps {}

export function GetiXAxis(props: GetiXAxisProps) {
    const theme = useChartsTheme();

    return (
        <XAxis
            tick={{
                fontSize: theme.typography.fontSize,
                fontFamily: theme.typography.fontFamily,
                fill: theme.typography.color,
            }}
            axisLine={{
                stroke: theme.axis.lineColor,
                strokeWidth: theme.axis.strokeWidth,
            }}
            tickLine={{
                stroke: theme.axis.tickColor,
            }}
            {...props}
        />
    );
}
GetiXAxis.displayName = 'XAxis';

export function GetiYAxis(props: GetiYAxisProps) {
    const theme = useChartsTheme();

    return (
        <YAxis
            tick={{
                fontSize: theme.typography.fontSize,
                fontFamily: theme.typography.fontFamily,
                fill: theme.typography.color,
            }}
            axisLine={{
                stroke: theme.axis.lineColor,
                strokeWidth: theme.axis.strokeWidth,
            }}
            tickLine={{
                stroke: theme.axis.tickColor,
            }}
            {...props}
        />
    );
}
GetiYAxis.displayName = 'YAxis';
