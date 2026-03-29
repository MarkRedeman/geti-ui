import {
    createDatasetSubsetPalette,
    defaultDatasetSubsetPalette,
    getDatasetSubsetColor,
    withDatasetSubsetPalette,
} from './datasetSubsetPalette';

describe('datasetSubsetPalette', () => {
    it('creates palette with defaults and overrides', () => {
        expect(createDatasetSubsetPalette()).toEqual(defaultDatasetSubsetPalette);
        expect(createDatasetSubsetPalette({ train: '#0f0' }).train).toBe('#0f0');
        expect(createDatasetSubsetPalette({ train: '#0f0' }).validation).toBe(defaultDatasetSubsetPalette.validation);
    });

    it('resolves colors by aliases', () => {
        expect(getDatasetSubsetColor('train')).toBe(defaultDatasetSubsetPalette.train);
        expect(getDatasetSubsetColor('val')).toBe(defaultDatasetSubsetPalette.validation);
        expect(getDatasetSubsetColor('testing')).toBe(defaultDatasetSubsetPalette.test);
        expect(getDatasetSubsetColor('unknown')).toBeUndefined();
    });

    it('applies subset palette by dataKey preserving explicit colors', () => {
        const series = [
            { dataKey: 'train', name: 'Train' },
            { dataKey: 'val', name: 'Validation' },
            { dataKey: 'test', name: 'Test', color: '#fff' },
            { dataKey: 'baseline', name: 'Baseline' },
        ];

        const out = withDatasetSubsetPalette(series);
        expect(out[0].color).toBe(defaultDatasetSubsetPalette.train);
        expect(out[1].color).toBe(defaultDatasetSubsetPalette.validation);
        expect(out[2].color).toBe('#fff');
        expect(out[3].color).toBeUndefined();
    });

    it('applies subset palette by series name for scatter-style configs', () => {
        const series: Array<{ name: string; color?: string }> = [
            { name: 'Training' },
            { name: 'Validation' },
            { name: 'Test' },
        ];
        const out = withDatasetSubsetPalette(series, { matchBy: 'name' });

        expect(out[0].color).toBe(defaultDatasetSubsetPalette.train);
        expect(out[1].color).toBe(defaultDatasetSubsetPalette.validation);
        expect(out[2].color).toBe(defaultDatasetSubsetPalette.test);
    });
});
