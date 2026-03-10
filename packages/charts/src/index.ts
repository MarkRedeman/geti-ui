// @geti-ai/charts — public API

// Theming
export type { ChartTheme, DataColorPalette, ColorValue, ChartTypography, ChartGridTokens, ChartAxisTokens, ChartTooltipTokens, ChartLegendTokens } from './theming/types';
export { defaultGetiChartTheme } from './theming/tokens';
export { mergeChartTheme } from './theming/chartTheme';
export type { DeepPartial } from './theming/chartTheme';

// Axis scale types
export type { AxisScaleType, AxisScaleConfig } from './types/axisScale';

// Hooks
export { useChartsTheme } from './hooks/useChartsTheme';
export { useGetiUIChartsTheme } from './hooks/useGetiUIChartsTheme';
export { useVoronoiHover } from './hooks/useVoronoiHover';
export type { UseVoronoiHoverOptions, UseVoronoiHoverReturn, VoronoiActivePoint } from './hooks/useVoronoiHover';

// Voronoi utilities (for custom chart implementations)
export type { ScatterDataPoint, VoronoiHitResult } from './utils/voronoiUtils';
export { buildVoronoiLookup, linearProject, computeDomain } from './utils/voronoiUtils';

// Dataset subset palette utilities (train/validation/test)
export type {
    DatasetSubset,
    DatasetSubsetPalette,
    DatasetSubsetAliases,
    DatasetSubsetColorizeOptions,
} from './utils/datasetSubsetPalette';
export {
    defaultDatasetSubsetPalette,
    defaultDatasetSubsetAliases,
    createDatasetSubsetPalette,
    getDatasetSubsetColor,
    withDatasetSubsetPalette,
} from './utils/datasetSubsetPalette';

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
export type { LineChartProps, LineChartSeriesConfig, LineChartCurve } from './components/LineChart';

export { BarChart } from './components/BarChart';
export type { BarChartProps, BarChartSeriesConfig } from './components/BarChart';

export { AreaChart } from './components/AreaChart';
export type { AreaChartProps, AreaChartSeriesConfig } from './components/AreaChart';

export { ScatterChart } from './components/ScatterChart';
export type { ScatterChartProps, ScatterChartSeriesConfig } from './components/ScatterChart';

export { PieChart } from './components/PieChart';
export type { PieChartProps } from './components/PieChart';
