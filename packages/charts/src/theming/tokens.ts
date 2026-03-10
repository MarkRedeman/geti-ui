import type { ChartTheme } from './types';

/**
 * Default dark-mode Geti chart theme.
 *
 * Colors are chosen to provide good contrast on dark backgrounds.
 * The data color palette cycles through 8 perceptually distinct colors.
 */
export const defaultGetiChartTheme: ChartTheme = {
    backgroundColor: 'transparent',

    // 8-color perceptually distinct palette optimized for dark backgrounds
    dataColors: [
        '#4C9BE8', // blue
        '#5CE6A2', // green
        '#F9C846', // yellow
        '#F07070', // red/coral
        '#A78BFA', // purple
        '#F97316', // orange
        '#22D3EE', // cyan
        '#FB7185', // pink
    ],

    typography: {
        fontFamily: 'inherit',
        fontSize: 12,
        fontWeight: 400,
        color: '#A3A3A3',
    },

    grid: {
        stroke: '#333333',
        strokeDasharray: '4 2',
        strokeOpacity: 0.8,
    },

    axis: {
        lineColor: '#444444',
        tickColor: '#444444',
        strokeWidth: 1,
    },

    tooltip: {
        backgroundColor: '#1E1E1E',
        borderColor: '#404040',
        borderRadius: 6,
        color: '#E5E5E5',
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    },

    legend: {
        color: '#A3A3A3',
        iconSize: 12,
    },

    cursorColor: '#555555',
    cursorOpacity: 0.4,

    dotRadius: 3,
    activeDotRadius: 5,
};
