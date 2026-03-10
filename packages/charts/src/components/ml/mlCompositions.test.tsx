import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ChartsThemeProvider } from '../../primitives/ChartsThemeProvider';
import { TrainingMetricsChart } from './TrainingMetricsChart';
import { RunComparisonChart } from './RunComparisonChart';
import { ConfusionMatrixChart } from './ConfusionMatrixChart';

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
});
