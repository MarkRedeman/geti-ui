/**
 * Core token names used throughout the Geti charts theming system.
 * Token names map to CSS custom properties via useGetiUIChartsTheme.
 */

/** A CSS color string or any valid color value. */
export type ColorValue = string;

/**
 * Palette of data series colors, used to assign distinct colors to chart lines/bars/areas.
 * At least one color is required; the chart cycles through them.
 */
export type DataColorPalette = [ColorValue, ...ColorValue[]];

/** Typographic config for chart labels, ticks, and legends. */
export interface ChartTypography {
    /** Font family for all chart text. */
    fontFamily: string;
    /** Base font size in pixels for axis ticks and labels. */
    fontSize: number;
    /** Font weight for axis labels. */
    fontWeight: number | string;
    /** Text color for axis ticks, legends, and tooltips. */
    color: ColorValue;
}

/** Grid appearance tokens. */
export interface ChartGridTokens {
    /** Stroke color for grid lines. */
    stroke: ColorValue;
    /** Stroke dash array for grid lines (e.g. '4 2'). */
    strokeDasharray: string;
    /** Opacity of grid lines (0–1). */
    strokeOpacity: number;
}

/** Axis appearance tokens. */
export interface ChartAxisTokens {
    /** Color of axis lines. */
    lineColor: ColorValue;
    /** Color of axis tick marks. */
    tickColor: ColorValue;
    /** Stroke width of axis lines. */
    strokeWidth: number;
}

/** Tooltip appearance tokens. */
export interface ChartTooltipTokens {
    /** Tooltip container background color. */
    backgroundColor: ColorValue;
    /** Tooltip border color. */
    borderColor: ColorValue;
    /** Tooltip border radius in pixels. */
    borderRadius: number;
    /** Tooltip text color. */
    color: ColorValue;
    /** Tooltip container padding (CSS shorthand). */
    padding: string;
    /** Box shadow for the tooltip. */
    boxShadow: string;
}

/** Legend appearance tokens. */
export interface ChartLegendTokens {
    /** Legend item text color. */
    color: ColorValue;
    /** Legend icon size in pixels. */
    iconSize: number;
}

/**
 * Full chart theme object.
 * Passed to ChartsThemeProvider and consumed by all chart primitives.
 */
export interface ChartTheme {
    /** Background color of the chart container. */
    backgroundColor: ColorValue;
    /** Ordered palette of colors for data series. Cycles if series count exceeds length. */
    dataColors: DataColorPalette;
    /** Typography settings. */
    typography: ChartTypography;
    /** Grid line settings. */
    grid: ChartGridTokens;
    /** Axis line/tick settings. */
    axis: ChartAxisTokens;
    /** Tooltip settings. */
    tooltip: ChartTooltipTokens;
    /** Legend settings. */
    legend: ChartLegendTokens;
    /** Cursor line color shown on hover. */
    cursorColor: ColorValue;
    /** Cursor line opacity. */
    cursorOpacity: number;
    /** Default dot/point radius on line/scatter charts. */
    dotRadius: number;
    /** Dot/point radius when active (hovered). */
    activeDotRadius: number;
}
