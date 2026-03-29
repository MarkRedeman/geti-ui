/**
 * Axis scale types supported by the Geti chart components.
 *
 * These mirror the Recharts `ScaleType` with explicit documentation of when each
 * scale applies:
 *
 * - `'auto'`    - Recharts picks the scale based on data type (default Recharts behaviour).
 * - `'linear'`  - Evenly-spaced numeric ticks. Good for most continuous data. **(default for numeric axes)**
 * - `'log'`     - Logarithmic spacing. Ideal for data spanning many orders of magnitude.
 *                 ⚠ Requires **all values to be > 0**; pass `domain={[min, 'auto']}` to avoid
 *                 zero-domain errors.
 * - `'pow'`     - Power / exponential scale. Values are raised to a fixed exponent.
 * - `'sqrt'`    - Square-root scale. A special case of `pow` with exponent 0.5.
 * - `'time'`    - Time-based scale for Date values on the axis.
 * - `'band'`    - Equal-width bands for categorical data (used internally by BarChart).
 * - `'point'`   - Point-based ordinal scale for categories.
 * - `'ordinal'` - Generic ordinal scale.
 * - `'quantile'`| `'quantize'` | `'threshold'` | `'sequential'` - Advanced D3 scales
 *                 forwarded to Recharts unchanged.
 */
export type AxisScaleType =
    | 'auto'
    | 'linear'
    | 'log'
    | 'pow'
    | 'sqrt'
    | 'time'
    | 'band'
    | 'point'
    | 'ordinal'
    | 'quantile'
    | 'quantize'
    | 'threshold'
    | 'sequential';

/**
 * Convenience config block for a single axis scale, covering the most common
 * use-cases without exposing the full Recharts XAxisProps / YAxisProps surface.
 *
 * All fields are optional - omitting them preserves existing defaults.
 */
export interface AxisScaleConfig {
    /**
     * Scale type for the axis.
     * @default 'linear' (numeric axes) / 'band' (category axes)
     */
    scale?: AxisScaleType;
    /**
     * Axis domain `[min, max]`. Each element can be a number, `'auto'`, or
     * `'dataMin'` / `'dataMax'`. Required when using `'log'` scale to avoid
     * a zero lower bound.
     *
     * @example [1, 'auto']  // log scale - exclude zero
     * @example [0, 100]     // fixed linear range
     */
    domain?: [number | string, number | string];
    /**
     * When `true`, chart data that falls outside the provided `domain` is still
     * rendered (clipped at the viewport). Useful when pairing a fixed `domain`
     * with live data.
     * @default false
     */
    allowDataOverflow?: boolean;
}
