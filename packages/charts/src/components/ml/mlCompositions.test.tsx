import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import userEvent from '@testing-library/user-event';
import { ChartsThemeProvider } from '../../primitives/ChartsThemeProvider';
import { TrainingMetricsChart } from './TrainingMetricsChart';
import { RunComparisonChart } from './RunComparisonChart';
import { ConfusionMatrixChart } from './ConfusionMatrixChart';
import { ParallelCoordinates } from './ParallelCoordinates';

function wrap(node: React.ReactNode) {
    return render(<ChartsThemeProvider>{node}</ChartsThemeProvider>);
}

describe('ML compositions', () => {
    it('renders TrainingMetricsChart with custom aria-label', () => {
        wrap(
            <TrainingMetricsChart
                data={[
                    { epoch: 1, train_loss: 0.6, val_loss: 0.7 },
                    { epoch: 2, train_loss: 0.4, val_loss: 0.55 },
                ]}
                metrics={[{ name: 'Loss', trainKey: 'train_loss', validationKey: 'val_loss' }]}
                aria-label="training metrics"
            />
        );

        expect(screen.getByRole('img', { name: 'training metrics' })).toBeTruthy();
    });

    it('renders RunComparisonChart with default animation disabled and animate enabled', () => {
        const data = [
            { run: 'run-a', map: 0.62 },
            { run: 'run-b', map: 0.67 },
        ];

        const { rerender } = wrap(
            <RunComparisonChart
                data={data}
                series={[{ dataKey: 'map', name: 'mAP' }]}
                aria-label="run comparison"
            />
        );

        expect(screen.getByRole('img', { name: 'run comparison' })).toBeTruthy();

        rerender(
            <ChartsThemeProvider>
                <RunComparisonChart
                    data={data}
                    series={[{ dataKey: 'map', name: 'mAP' }]}
                    animate
                    aria-label="run comparison animated"
                />
            </ChartsThemeProvider>
        );

        expect(screen.getByRole('img', { name: 'run comparison animated' })).toBeTruthy();
    });

    it('renders ConfusionMatrixChart in normalized mode', () => {
        wrap(
            <ConfusionMatrixChart
                matrix={[
                    [7, 1],
                    [2, 8],
                ]}
                labels={['cat', 'dog']}
                normalize="row"
                aria-label="confusion matrix"
            />
        );

        expect(screen.getByRole('img', { name: 'confusion matrix' })).toBeTruthy();
    });

    it('renders ParallelCoordinates with highlight and hover/select callbacks', () => {
        const pcaRows = [
            {
                id: 'img-001',
                pc1: -2.1,
                pc2: -0.7,
                pc3: 0.3,
                pc4: 1.1,
                pc5: 0.4,
                pc6: -0.2,
                pc7: 1.8,
                pc8: 2.5,
            },
            {
                id: 'img-002',
                pc1: -1.4,
                pc2: 0.1,
                pc3: 0.9,
                pc4: 1.5,
                pc5: 0.8,
                pc6: 0.2,
                pc7: 2.1,
                pc8: 2.9,
            },
            {
                id: 'img-003',
                pc1: -0.9,
                pc2: 0.8,
                pc3: 1.2,
                pc4: 1.8,
                pc5: 1.1,
                pc6: 0.7,
                pc7: 2.6,
                pc8: 3.2,
            },
        ];

        wrap(
            <ParallelCoordinates
                data={pcaRows}
                axes={[
                    { dataKey: 'pc1', label: 'PC1' },
                    { dataKey: 'pc2', label: 'PC2' },
                    { dataKey: 'pc3', label: 'PC3' },
                    { dataKey: 'pc4', label: 'PC4' },
                    { dataKey: 'pc5', label: 'PC5' },
                    { dataKey: 'pc6', label: 'PC6' },
                    { dataKey: 'pc7', label: 'PC7' },
                    { dataKey: 'pc8', label: 'PC8' },
                ]}
                colorBy="pc3"
                colorGradient="hue-spectrum"
                lineOpacity={0.25}
                highlight={{ enabled: true, interaction: { lineHover: true } }}
                onHoverRowChange={() => undefined}
                onSelectRowChange={() => undefined}
                aria-label="parallel coordinates"
            />
        );

        expect(screen.getByRole('img', { name: 'parallel coordinates' })).toBeTruthy();
    });

    it('renders ParallelCoordinates with selection mode enabled', async () => {
        const user = userEvent.setup();
        const pcaRows = [
            { id: 'img-001', pc1: -1.2, pc2: 0.4, pc3: 1.1, pc4: 1.7 },
            { id: 'img-002', pc1: -0.8, pc2: 0.7, pc3: 1.4, pc4: 2.0 },
            { id: 'img-003', pc1: -0.1, pc2: 1.1, pc3: 1.9, pc4: 2.4 },
        ];

        wrap(
            <ParallelCoordinates
                data={pcaRows}
                axes={[
                    { dataKey: 'pc1', label: 'PC1' },
                    { dataKey: 'pc2', label: 'PC2' },
                    { dataKey: 'pc3', label: 'PC3' },
                    { dataKey: 'pc4', label: 'PC4' },
                ]}
                colorBy="pc3"
                selection={{ enabled: true, mode: 'bounding-box' }}
                filterBySelection
                aria-label="parallel coordinates selection"
            />
        );

        expect(screen.getByRole('img', { name: 'parallel coordinates selection' })).toBeTruthy();

        await user.pointer([
            {
                target: screen.getByRole('img', { name: 'parallel coordinates selection' }),
                coords: { x: 50, y: 50 },
                keys: '[MouseLeft>]'
            },
            {
                target: screen.getByRole('img', { name: 'parallel coordinates selection' }),
                coords: { x: 180, y: 180 },
            },
            {
                target: screen.getByRole('img', { name: 'parallel coordinates selection' }),
                keys: '[/MouseLeft]'
            },
        ]);
    });
});
