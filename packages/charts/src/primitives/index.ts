export { ChartsThemeProvider, ChartsThemeContext } from './ChartsThemeProvider';
export type { ChartsThemeProviderProps } from './ChartsThemeProvider';

export { ChartContainer as GetiChartContainer } from './ChartContainer';
export type { ChartContainerProps as GetiChartContainerProps } from './ChartContainer';

export { ChartGrid as GetiCartesianGrid } from './ChartGrid';
export type { ChartGridProps as GetiCartesianGridProps } from './ChartGrid';

export { GetiXAxis, GetiYAxis } from './Axis';
export type { GetiXAxisProps, GetiYAxisProps } from './Axis';

export { GetiResponsiveContainer } from './ResponsiveContainer';
export type { GetiResponsiveContainerProps } from './ResponsiveContainer';

export { ChartTooltip as GetiTooltip } from './ChartTooltip';
export type {
    ChartTooltipProps as GetiTooltipProps,
    ChartTooltipContentProps as GetiTooltipContentProps,
} from './ChartTooltip';

export { ChartLegend as GetiLegend } from './ChartLegend';
export type { ChartLegendProps as GetiLegendProps } from './ChartLegend';

export { Sparkline } from './Sparkline';
export type { SparklineProps, SparklineCurve } from './Sparkline';

// Axis scale types - re-exported so primitives consumers can use them too
export type { AxisScaleType, AxisScaleConfig } from '../types/axisScale';
