import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';

export interface MeterChartProps {
    /** Score value. */
    value: number;
    /** Max score. @default 100 */
    max?: number;
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 220 */
    height?: number;
    /** Filled meter segment color. Defaults to theme primary line color. */
    color?: string;
    /** Track/background segment color. */
    trackColor?: string;
    /** Start angle in degrees. @default 180 */
    startAngle?: number;
    /** End angle in degrees. @default 0 */
    endAngle?: number;
    /** Inner radius. @default '72%' */
    innerRadius?: number | string;
    /** Outer radius. @default '100%' */
    outerRadius?: number | string;
    /** Show center value text. @default true */
    showValue?: boolean;
    /** Formatter for center value text. */
    valueFormatter?: (value: number, max: number) => string;
    /** Show tooltip. @default false */
    showTooltip?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function MeterChart({
    value,
    max = 100,
    width = '100%',
    height = 220,
    color,
    trackColor,
    startAngle = 180,
    endAngle = 0,
    innerRadius = '72%',
    outerRadius = '100%',
    showValue = true,
    valueFormatter,
    showTooltip = false,
    animate = false,
    tooltipProps,
    'aria-label': ariaLabel,
}: MeterChartProps) {
    const theme = useChartsTheme();

    const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
    const normalized = Math.max(0, Math.min(value, safeMax));
    const remaining = Math.max(0, safeMax - normalized);

    const fillColor = color ?? theme.dataColors[0];
    const bgColor = trackColor ?? theme.grid.stroke;

    const displayValue = valueFormatter
        ? valueFormatter(normalized, safeMax)
        : `${Math.round((normalized / safeMax) * 100)}%`;

    const data = [
        { name: 'value', value: normalized },
        { name: 'remaining', value: remaining },
    ];

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height, position: 'relative' }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        startAngle={startAngle}
                        endAngle={endAngle}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        stroke="none"
                        isAnimationActive={animate}
                    >
                        <Cell fill={fillColor} />
                        <Cell fill={bgColor} />
                    </Pie>
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                </RechartsPieChart>
            </ResponsiveContainer>

            {showValue && (
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '72%',
                        transform: 'translate(-50%, -50%)',
                        color: theme.typography.color,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        pointerEvents: 'none',
                    }}
                >
                    {displayValue}
                </div>
            )}
        </div>
    );
}
