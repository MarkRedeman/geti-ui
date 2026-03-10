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

export { DonutChart } from './components/DonutChart';
export type { DonutChartProps } from './components/DonutChart';

export { RadarChart } from './components/RadarChart';
export type { RadarChartProps, RadarChartSeriesConfig } from './components/RadarChart';

export { RadialBarChart } from './components/RadialBarChart';
export type { RadialBarChartProps } from './components/RadialBarChart';

export { MeterChart } from './components/MeterChart';
export type { MeterChartProps } from './components/MeterChart';

export { TrainingMetricsChart } from './components/ml/TrainingMetricsChart';
export type { TrainingMetricsChartProps, TrainingMetricSeriesConfig } from './components/ml/TrainingMetricsChart';

export { RunComparisonChart } from './components/ml/RunComparisonChart';
export type { RunComparisonChartProps, RunComparisonSeriesConfig } from './components/ml/RunComparisonChart';

export { ConfusionMatrixChart } from './components/ml/ConfusionMatrixChart';
export type { ConfusionMatrixChartProps } from './components/ml/ConfusionMatrixChart';

export { PrecisionRecallCurve } from './components/ml/PrecisionRecallCurve';
export type { PrecisionRecallCurveProps, PrecisionRecallCurveSeriesConfig } from './components/ml/PrecisionRecallCurve';

export { RocCurve } from './components/ml/RocCurve';
export type { RocCurveProps, RocCurveSeriesConfig } from './components/ml/RocCurve';

export { ClassAPChart } from './components/ml/ClassAPChart';
export type { ClassAPChartProps, ClassAPChartDatum } from './components/ml/ClassAPChart';

export { IoUDistributionChart } from './components/ml/IoUDistributionChart';
export type { IoUDistributionChartProps, IoUDistributionDatum } from './components/ml/IoUDistributionChart';

export { DistributionRidgeChart } from './components/ml/DistributionRidgeChart';
export type { DistributionRidgeChartProps, DistributionRidgeSeries } from './components/ml/DistributionRidgeChart';

export { ErrorBreakdownChart } from './components/ml/ErrorBreakdownChart';
export type { ErrorBreakdownChartProps, ErrorBreakdownSeries } from './components/ml/ErrorBreakdownChart';

export { ConfidenceHistogram } from './components/ml/ConfidenceHistogram';
export type { ConfidenceHistogramProps, ConfidenceHistogramDatum } from './components/ml/ConfidenceHistogram';

export { ClassDistributionChart } from './components/ml/ClassDistributionChart';
export type { ClassDistributionChartProps, ClassDistributionDatum } from './components/ml/ClassDistributionChart';

export { ImageBrightnessDistribution } from './components/ml/ImageBrightnessDistribution';
export type {
    ImageBrightnessDistributionProps,
    ImageBrightnessDistributionDatum,
} from './components/ml/ImageBrightnessDistribution';

export { ImageAspectRatioDistribution } from './components/ml/ImageAspectRatioDistribution';
export type {
    ImageAspectRatioDistributionProps,
    ImageAspectRatioDistributionDatum,
} from './components/ml/ImageAspectRatioDistribution';

export { ReliabilityDiagram } from './components/ml/ReliabilityDiagram';
export type { ReliabilityDiagramProps, ReliabilityDiagramDatum } from './components/ml/ReliabilityDiagram';

export { ConfidenceVsIoUChart } from './components/ml/ConfidenceVsIoUChart';
export type {
    ConfidenceVsIoUChartProps,
    ConfidenceVsIoUSeries,
    ConfidenceVsIoUPoint,
} from './components/ml/ConfidenceVsIoUChart';

export { EmbeddingDistanceDistribution } from './components/ml/EmbeddingDistanceDistribution';
export type {
    EmbeddingDistanceDistributionProps,
    EmbeddingDistanceDistributionDatum,
} from './components/ml/EmbeddingDistanceDistribution';

export { LatencyPercentileChart } from './components/ml/LatencyPercentileChart';
export type { LatencyPercentileChartProps } from './components/ml/LatencyPercentileChart';

export { TreemapChart } from './components/TreemapChart';
export type { TreemapChartProps } from './components/TreemapChart';
