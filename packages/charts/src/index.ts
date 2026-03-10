// @geti-ai/charts — public API

// Theming
export type { ChartTheme, DataColorPalette, ColorValue, ChartTypography, ChartGridTokens, ChartAxisTokens, ChartTooltipTokens, ChartLegendTokens } from './theming/types';
export { defaultGetiChartTheme } from './theming/tokens';
export { mergeChartTheme } from './theming/chartTheme';
export type { DeepPartial } from './theming/chartTheme';

// Hooks
export { useChartsTheme } from './hooks/useChartsTheme';
export { useGetiUIChartsTheme } from './hooks/useGetiUIChartsTheme';

// Primitives
export { ChartsThemeProvider, ChartsThemeContext } from './primitives/ChartsThemeProvider';
export type { ChartsThemeProviderProps } from './primitives/ChartsThemeProvider';

export { ChartContainer } from './primitives/ChartContainer';
export type { ChartContainerProps } from './primitives/ChartContainer';

export { ChartGrid } from './primitives/ChartGrid';
export type { ChartGridProps } from './primitives/ChartGrid';

export { ChartTooltip } from './primitives/ChartTooltip';
export type { ChartTooltipProps, ChartTooltipContentProps } from './primitives/ChartTooltip';

export { ChartLegend } from './primitives/ChartLegend';
export type { ChartLegendProps } from './primitives/ChartLegend';

export { Sparkline } from './primitives/Sparkline';
export type { SparklineProps, SparklineCurve } from './primitives/Sparkline';

// Chart components
export { LineChart } from './components/LineChart';
export type { LineChartProps, LineChartSeriesConfig } from './components/LineChart';

export { BarChart } from './components/BarChart';
export type { BarChartProps, BarChartSeriesConfig } from './components/BarChart';

export { AreaChart } from './components/AreaChart';
export type { AreaChartProps, AreaChartSeriesConfig } from './components/AreaChart';

export { ScatterChart } from './components/ScatterChart';
export type { ScatterChartProps, ScatterChartSeriesConfig } from './components/ScatterChart';
