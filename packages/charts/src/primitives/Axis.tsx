import {
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../utils/axisStyles';

export interface GetiXAxisProps extends XAxisProps {}
export interface GetiYAxisProps extends YAxisProps {}

export function GetiXAxis(props: GetiXAxisProps) {
    const theme = useChartsTheme();

    return (
        <XAxis
            tick={getAxisTickStyle(theme)}
            axisLine={getAxisLineStyle(theme)}
            tickLine={getAxisTickLineStyle(theme)}
            {...props}
        />
    );
}
GetiXAxis.displayName = 'XAxis';

export function GetiYAxis(props: GetiYAxisProps) {
    const theme = useChartsTheme();

    return (
        <YAxis
            tick={getAxisTickStyle(theme)}
            axisLine={getAxisLineStyle(theme)}
            tickLine={getAxisTickLineStyle(theme)}
            {...props}
        />
    );
}
GetiYAxis.displayName = 'YAxis';
