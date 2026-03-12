export function extractLegendSeriesKey(entry: unknown): string | null {
    if (!entry || typeof entry !== 'object') {
        return null;
    }

    const candidate = entry as { dataKey?: unknown; value?: unknown; payload?: { dataKey?: unknown; value?: unknown } };
    const dataKey = candidate.dataKey ?? candidate.payload?.dataKey;
    if (typeof dataKey === 'string' && dataKey.length > 0) {
        return dataKey;
    }

    const value = candidate.value ?? candidate.payload?.value;
    if (typeof value === 'string' && value.length > 0) {
        return value;
    }

    return null;
}
