import type { DataColorPalette } from '../theming/types';

export const distinctColorScale = [
    '#708541',
    '#E96115',
    '#EDB200',
    '#FF5662',
    '#CC94DA',
    '#5B69FF',
    '#548FAD',
    '#25A18E',
    '#9D3B1A',
    '#C9E649',
    '#F15B85',
    '#81407B',
    '#26518E',
    '#076984',
    '#00F5D4',
    '#FF7D00',
    '#F7DAB3',
    '#80E9AF',
    '#9B5DE5',
    '#00A5CF',
    '#D7BC5E',
] as const;

export const chartColorScalePresets = {
    'hue-spectrum': ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8b00ff'],
    viridis: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'],
    cividis: ['#00224e', '#35456c', '#666970', '#948e77', '#c8b866', '#fee838'],
    plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'],
    magma: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf'],
    inferno: ['#000004', '#420a68', '#932667', '#dd513a', '#fba40a', '#fcffa4'],
    turbo: ['#30123b', '#4663d8', '#3fbf7f', '#f9e721', '#ee5a3a', '#7a0403'],
    distinct: distinctColorScale,
} as const;

export type ChartColorScalePreset = 'theme' | keyof typeof chartColorScalePresets;
export type ChartColorScaleInput = ChartColorScalePreset | readonly [string, string, ...string[]];

interface RgbColor {
    r: number;
    g: number;
    b: number;
}

function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
}

function parseColorToRgb(color: string): RgbColor | null {
    const hex = color.trim();

    const shortHexMatch = /^#([a-f\d]{3})$/i.exec(hex);
    if (shortHexMatch) {
        const [, rgb] = shortHexMatch;
        return {
            r: Number.parseInt(rgb[0] + rgb[0], 16),
            g: Number.parseInt(rgb[1] + rgb[1], 16),
            b: Number.parseInt(rgb[2] + rgb[2], 16),
        };
    }

    const longHexMatch = /^#([a-f\d]{6})$/i.exec(hex);
    if (longHexMatch) {
        const [, rgb] = longHexMatch;
        return {
            r: Number.parseInt(rgb.slice(0, 2), 16),
            g: Number.parseInt(rgb.slice(2, 4), 16),
            b: Number.parseInt(rgb.slice(4, 6), 16),
        };
    }

    const rgbMatch = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(hex);
    if (rgbMatch) {
        return {
            r: Number.parseInt(rgbMatch[1], 10),
            g: Number.parseInt(rgbMatch[2], 10),
            b: Number.parseInt(rgbMatch[3], 10),
        };
    }

    return null;
}

function interpolateRgb(start: RgbColor, end: RgbColor, t: number): string {
    const ratio = clamp01(t);
    const r = Math.round(start.r + (end.r - start.r) * ratio);
    const g = Math.round(start.g + (end.g - start.g) * ratio);
    const b = Math.round(start.b + (end.b - start.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
}

export function resolveChartColorScaleStops(
    colorScale: ChartColorScaleInput | undefined,
    themeColors: DataColorPalette
): readonly [string, string, ...string[]] {
    if (Array.isArray(colorScale) && colorScale.length >= 2) {
        return colorScale as readonly [string, string, ...string[]];
    }

    if (colorScale && colorScale !== 'theme') {
        const preset = chartColorScalePresets[colorScale as keyof typeof chartColorScalePresets];
        if (preset && preset.length >= 2) {
            return preset;
        }
    }

    return [themeColors[0], themeColors[Math.min(themeColors.length - 1, 3)]];
}

export function interpolateColorStops(stops: readonly string[], t: number): string {
    const parsed = stops
        .map((color) => parseColorToRgb(color))
        .filter((value): value is RgbColor => value !== null);

    if (parsed.length === 0) {
        return 'rgb(120, 120, 120)';
    }

    if (parsed.length === 1) {
        const only = parsed[0];
        return `rgb(${only.r}, ${only.g}, ${only.b})`;
    }

    const clamped = clamp01(t);
    const scaled = clamped * (parsed.length - 1);
    const startIndex = Math.floor(scaled);
    const endIndex = Math.min(parsed.length - 1, startIndex + 1);
    const localT = scaled - startIndex;

    return interpolateRgb(parsed[startIndex], parsed[endIndex], localT);
}
