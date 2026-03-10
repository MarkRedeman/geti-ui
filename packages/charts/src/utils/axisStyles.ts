import type { ChartTheme } from '../theming/types';

export function getAxisTickStyle(theme: ChartTheme): {
    fontSize: number;
    fontFamily: string;
    fill: string;
} {
    return {
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        fill: theme.typography.color,
    };
}

export function getAxisLineStyle(theme: ChartTheme): { stroke: string; strokeWidth: number } {
    return {
        stroke: theme.axis.lineColor,
        strokeWidth: theme.axis.strokeWidth,
    };
}

export function getAxisTickLineStyle(theme: ChartTheme): { stroke: string } {
    return {
        stroke: theme.axis.tickColor,
    };
}
