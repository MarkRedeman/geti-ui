import type { CSSProperties, ReactNode } from 'react';
import { Tooltip, type TooltipProps } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';

export interface ChartTooltipContentProps {
    label?: string | number;
    payload?: Array<{
        name?: string;
        value?: number | string;
        color?: string;
        unit?: string;
    }>;
    active?: boolean;
}

/**
 * Default tooltip content component with Geti theming.
 */
function DefaultTooltipContent({ label, payload, active }: ChartTooltipContentProps) {
    const theme = useChartsTheme();
    if (!active || !payload?.length) return null;

    const containerStyle: CSSProperties = {
        backgroundColor: theme.tooltip.backgroundColor,
        border: `1px solid ${theme.tooltip.borderColor}`,
        borderRadius: theme.tooltip.borderRadius,
        color: theme.tooltip.color,
        padding: theme.tooltip.padding,
        boxShadow: theme.tooltip.boxShadow,
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
    };

    const labelStyle: CSSProperties = {
        marginBottom: 4,
        fontWeight: 600,
        color: theme.tooltip.color,
    };

    const itemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    };

    return (
        <div style={containerStyle}>
            {label !== undefined && <div style={labelStyle}>{label}</div>}
            {payload.map((entry, index) => (
                <div key={`tooltip-item-${index}`} style={itemStyle}>
                    <span
                        style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            flexShrink: 0,
                        }}
                    />
                    <span>
                        {entry.name}: <strong>{entry.value}</strong>
                        {entry.unit}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Use the broad default generics so this type is compatible with any Recharts chart
export interface ChartTooltipProps extends Omit<TooltipProps, 'content'> {
    /** Custom tooltip content renderer. Defaults to themed DefaultTooltipContent. */
    content?: ReactNode | ((props: ChartTooltipContentProps) => ReactNode);
}

/**
 * Themed Recharts Tooltip wrapper.
 * Uses the active chart theme for colors, typography, and spacing.
 *
 * Must be rendered as a direct child of a Recharts chart component.
 *
 * @example
 * ```tsx
 * <LineChart data={data}>
 *   <ChartTooltip />
 * </LineChart>
 * ```
 */
export function ChartTooltip({ content, ...rest }: ChartTooltipProps) {
    const theme = useChartsTheme();

    const tooltipContent =
        content !== undefined
            ? content
            : (props: ChartTooltipContentProps) => <DefaultTooltipContent {...props} />;

    return (
        <Tooltip
            {...rest}
            cursor={{ stroke: theme.cursorColor, strokeOpacity: theme.cursorOpacity, strokeWidth: 1 }}
            content={tooltipContent as TooltipProps['content']}
        />
    );
}
ChartTooltip.displayName = 'Tooltip';
