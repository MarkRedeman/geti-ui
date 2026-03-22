export type DatasetSubset = 'train' | 'validation' | 'test';

export interface DatasetSubsetPalette {
    /** Training set color. */
    train: string;
    /** Validation set color. */
    validation: string;
    /** Test set color. */
    test: string;
}

export interface DatasetSubsetAliases {
    train: string[];
    validation: string[];
    test: string[];
}

export interface DatasetSubsetColorizeOptions {
    /**
     * Palette override for dataset subsets.
     * Missing keys fall back to `defaultDatasetSubsetPalette`.
     */
    palette?: Partial<DatasetSubsetPalette>;
    /**
     * Series field used to infer subset identity.
     * - `dataKey` is useful for line/area/bar series.
     * - `name` is useful for scatter series.
     *
     * @default 'dataKey'
     */
    matchBy?: 'dataKey' | 'name';
    /**
     * Alias overrides for subset matching.
     */
    aliases?: Partial<DatasetSubsetAliases>;
}

/**
 * Default, opinionated dataset subset palette:
 */
export const defaultDatasetSubsetPalette: DatasetSubsetPalette = {
    train: 'var(--moss-tint-1)',
    validation: 'var(--brand-daisy-tint)',
    test: 'var(--geode-tint)',
};

export const defaultDatasetSubsetAliases: DatasetSubsetAliases = {
    train: ['train', 'training', 'trn'],
    validation: ['validation', 'val', 'valid', 'dev'],
    test: ['test', 'testing', 'tst'],
};

export function createDatasetSubsetPalette(palette?: Partial<DatasetSubsetPalette>): DatasetSubsetPalette {
    return {
        ...defaultDatasetSubsetPalette,
        ...palette,
    };
}

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

function resolveSubset(value: string, aliases?: Partial<DatasetSubsetAliases>): DatasetSubset | undefined {
    const mergedAliases: DatasetSubsetAliases = {
        train: aliases?.train ?? defaultDatasetSubsetAliases.train,
        validation: aliases?.validation ?? defaultDatasetSubsetAliases.validation,
        test: aliases?.test ?? defaultDatasetSubsetAliases.test,
    };

    const needle = normalize(value);
    if (mergedAliases.train.map(normalize).includes(needle)) return 'train';
    if (mergedAliases.validation.map(normalize).includes(needle)) return 'validation';
    if (mergedAliases.test.map(normalize).includes(needle)) return 'test';
    return undefined;
}

/**
 * Resolve color for train/validation/test subset key or alias.
 */
export function getDatasetSubsetColor(
    subsetOrAlias: string,
    options?: Pick<DatasetSubsetColorizeOptions, 'palette' | 'aliases'>
): string | undefined {
    const subset = resolveSubset(subsetOrAlias, options?.aliases);
    if (!subset) return undefined;

    const palette = createDatasetSubsetPalette(options?.palette);
    return palette[subset];
}

/**
 * Apply train/validation/test colors to chart series based on `dataKey` or `name`.
 *
 * Existing explicit `color` values are preserved.
 */
export function withDatasetSubsetPalette<
    T extends {
        color?: string;
        dataKey?: string;
        name?: string;
    },
>(series: T[], options?: DatasetSubsetColorizeOptions): T[] {
    const matchBy = options?.matchBy ?? 'dataKey';

    return series.map((item) => {
        if (item.color) return item;

        const candidate = matchBy === 'name' ? item.name : item.dataKey;
        if (!candidate) return item;

        const resolvedColor = getDatasetSubsetColor(candidate, options);
        if (!resolvedColor) return item;

        return {
            ...item,
            color: resolvedColor,
        };
    });
}
