import { Fragment, useMemo } from 'react';
import { ChartContainer } from '../../primitives/ChartContainer';
import { useChartsTheme } from '../../hooks/useChartsTheme';

type NormalizationMode = 'none' | 'row' | 'global';

export interface ConfusionMatrixChartProps {
    /** Square matrix values: rows=actual labels, cols=predicted labels. */
    matrix: number[][];
    /** Label names used for both actual and predicted axes. */
    labels: string[];
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 420 */
    height?: number;
    /** Normalization strategy for cell intensity. @default 'none' */
    normalize?: NormalizationMode;
    /** Whether to display values inside cells. @default true */
    showValues?: boolean;
    /** Minimum color intensity opacity. @default 0.1 */
    minOpacity?: number;
    /** Maximum color intensity opacity. @default 0.92 */
    maxOpacity?: number;
    /** Format function for displayed values. */
    valueFormatter?: (value: number, row: number, col: number) => string;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

function parseColorToRgb(color: string): { r: number; g: number; b: number } | null {
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

export function ConfusionMatrixChart({
    matrix,
    labels,
    width = '100%',
    height = 420,
    normalize = 'none',
    showValues = true,
    minOpacity = 0.1,
    maxOpacity = 0.92,
    valueFormatter,
    'aria-label': ariaLabel,
}: ConfusionMatrixChartProps) {
    const theme = useChartsTheme();

    const size = useMemo(() => Math.min(labels.length, matrix.length), [labels.length, matrix.length]);
    const rows = useMemo(() => matrix.slice(0, size).map((row) => row.slice(0, size)), [matrix, size]);

    const rgb = parseColorToRgb(theme.dataColors[0]) ?? { r: 76, g: 155, b: 232 };

    const normalized = useMemo(() => {
        if (size === 0) {
            return [] as number[][];
        }

        if (normalize === 'row') {
            return rows.map((row) => {
                const rowMax = Math.max(...row, 0);
                return row.map((v) => (rowMax > 0 ? v / rowMax : 0));
            });
        }

        const globalMax = Math.max(...rows.flat(), 0);
        if (normalize === 'global') {
            return rows.map((row) => row.map((v) => (globalMax > 0 ? v / globalMax : 0)));
        }

        // none → still compute scale from global max for color intensity.
        return rows.map((row) => row.map((v) => (globalMax > 0 ? v / globalMax : 0)));
    }, [normalize, rows, size]);

    const formatValue = (value: number, rowIndex: number, colIndex: number) => {
        if (valueFormatter) {
            return valueFormatter(value, rowIndex, colIndex);
        }

        if (normalize === 'none') {
            return String(value);
        }

        return `${(value * 100).toFixed(1)}%`;
    };

    return (
        <ChartContainer width={width} height={height} aria-label={ariaLabel}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `120px repeat(${size}, minmax(0, 1fr))`,
                    gridTemplateRows: `44px repeat(${size}, minmax(0, 1fr))`,
                    gap: 4,
                    height: '100%',
                    padding: 8,
                }}
            >
                <div />

                {labels.slice(0, size).map((label) => (
                    <div
                        key={`header-col-${label}`}
                        style={{
                            color: theme.typography.color,
                            fontFamily: theme.typography.fontFamily,
                            fontSize: theme.typography.fontSize,
                            fontWeight: 600,
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        {label}
                    </div>
                ))}

                {rows.map((row, rowIndex) => (
                    <Fragment key={`row-${rowIndex}`}>
                        <div
                            key={`header-row-${labels[rowIndex]}`}
                            style={{
                                color: theme.typography.color,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.fontSize,
                                fontWeight: 600,
                                alignSelf: 'center',
                            }}
                        >
                            {labels[rowIndex]}
                        </div>

                        {row.map((value, colIndex) => {
                            const scaled = normalized[rowIndex]?.[colIndex] ?? 0;
                            const opacity = minOpacity + (maxOpacity - minOpacity) * scaled;
                            const displayValue = formatValue(normalize === 'none' ? value : scaled, rowIndex, colIndex);

                            return (
                                <div
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    title={`Actual ${labels[rowIndex]} → Predicted ${labels[colIndex]}: ${displayValue}`}
                                    style={{
                                        display: 'grid',
                                        placeItems: 'center',
                                        border: `1px solid ${theme.grid.stroke}`,
                                        borderRadius: 4,
                                        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
                                        color: scaled > 0.5 ? '#fff' : theme.typography.color,
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.fontSize,
                                        fontWeight: 600,
                                    }}
                                >
                                    {showValues ? displayValue : null}
                                </div>
                            );
                        })}
                    </Fragment>
                ))}
            </div>
        </ChartContainer>
    );
}
