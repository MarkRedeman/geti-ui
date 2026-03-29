import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { AreaChart } from '../components/AreaChart';
import { ScatterChart } from '../components/ScatterChart';
import { ChartsThemeProvider } from './ChartsThemeProvider';

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const linearData = [
    { x: 1, y: 10 },
    { x: 2, y: 50 },
    { x: 3, y: 200 },
    { x: 4, y: 1000 },
    { x: 5, y: 5000 },
];

const logData = [
    { x: 1, y: 1 },
    { x: 2, y: 10 },
    { x: 3, y: 100 },
    { x: 4, y: 1000 },
    { x: 5, y: 10000 },
];

const categoricalData = [
    { model: 'A', score: 84 },
    { model: 'B', score: 91 },
    { model: 'C', score: 75 },
];

const scatterPoints = [
    { x: 0.1, y: 0.9 },
    { x: 1, y: 10 },
    { x: 10, y: 100 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wrap(node: React.ReactNode) {
    return render(<ChartsThemeProvider>{node}</ChartsThemeProvider>);
}

// ---------------------------------------------------------------------------
// LineChart - scale props
// ---------------------------------------------------------------------------

describe('LineChart - axis scale', () => {
    it('renders with default (no scale props) without crash', () => {
        wrap(
            <LineChart
                data={linearData}
                xAxisKey="x"
                series={[{ dataKey: 'y', name: 'Value' }]}
                aria-label="default scale"
            />
        );
        expect(screen.getByRole('img', { name: 'default scale' })).toBeInTheDocument();
    });

    it('renders with yScale log without crash', () => {
        wrap(
            <LineChart
                data={logData}
                xAxisKey="x"
                series={[{ dataKey: 'y', name: 'Value' }]}
                yScale={{ scale: 'log', domain: [1, 'auto'] }}
                aria-label="log scale"
            />
        );
        expect(screen.getByRole('img', { name: 'log scale' })).toBeInTheDocument();
    });

    it('renders with yScale sqrt without crash', () => {
        wrap(
            <LineChart
                data={linearData}
                xAxisKey="x"
                series={[{ dataKey: 'y' }]}
                yScale={{ scale: 'sqrt' }}
                aria-label="sqrt scale"
            />
        );
        expect(screen.getByRole('img', { name: 'sqrt scale' })).toBeInTheDocument();
    });

    it('renders with both xScale and yScale without crash', () => {
        wrap(
            <LineChart
                data={logData}
                xAxisKey="x"
                series={[{ dataKey: 'y' }]}
                xScale={{ scale: 'linear', domain: [0, 10] }}
                yScale={{ scale: 'log', domain: [1, 'auto'] }}
                aria-label="dual scale"
            />
        );
        expect(screen.getByRole('img', { name: 'dual scale' })).toBeInTheDocument();
    });

    it('accepts allowDataOverflow on yScale without crash', () => {
        wrap(
            <LineChart
                data={linearData}
                xAxisKey="x"
                series={[{ dataKey: 'y' }]}
                yScale={{ scale: 'linear', domain: [0, 100], allowDataOverflow: true }}
                aria-label="overflow"
            />
        );
        expect(screen.getByRole('img', { name: 'overflow' })).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// AreaChart - scale props
// ---------------------------------------------------------------------------

describe('AreaChart - axis scale', () => {
    it('renders with default (no scale props) without crash', () => {
        wrap(
            <AreaChart
                data={linearData}
                xAxisKey="x"
                series={[{ dataKey: 'y' }]}
                aria-label="area default"
            />
        );
        expect(screen.getByRole('img', { name: 'area default' })).toBeInTheDocument();
    });

    it('renders with yScale log without crash', () => {
        wrap(
            <AreaChart
                data={logData}
                xAxisKey="x"
                series={[{ dataKey: 'y' }]}
                yScale={{ scale: 'log', domain: [1, 'auto'] }}
                aria-label="area log"
            />
        );
        expect(screen.getByRole('img', { name: 'area log' })).toBeInTheDocument();
    });

    it('renders with yScale pow without crash', () => {
        wrap(
            <AreaChart
                data={linearData}
                xAxisKey="x"
                series={[{ dataKey: 'y' }]}
                yScale={{ scale: 'pow' }}
                aria-label="area pow"
            />
        );
        expect(screen.getByRole('img', { name: 'area pow' })).toBeInTheDocument();
    });

    it('renders fade gradient areas without crash', () => {
        wrap(
            <AreaChart
                data={linearData}
                xAxisKey="x"
                series={[
                    { dataKey: 'y', name: 'Series A', fade: true },
                    { dataKey: 'y', name: 'Series B', fade: false },
                ]}
                aria-label="area fade"
            />
        );
        expect(screen.getByRole('img', { name: 'area fade' })).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// BarChart - scale props
// ---------------------------------------------------------------------------

describe('BarChart - axis scale', () => {
    it('renders with default (no scale props) without crash', () => {
        wrap(
            <BarChart
                data={categoricalData}
                xAxisKey="model"
                series={[{ dataKey: 'score' }]}
                aria-label="bar default"
            />
        );
        expect(screen.getByRole('img', { name: 'bar default' })).toBeInTheDocument();
    });

    it('renders with yScale log on horizontal layout without crash', () => {
        wrap(
            <BarChart
                data={[
                    { label: 'A', count: 1 },
                    { label: 'B', count: 10 },
                    { label: 'C', count: 100 },
                ]}
                xAxisKey="label"
                series={[{ dataKey: 'count' }]}
                yScale={{ scale: 'log', domain: [1, 'auto'] }}
                aria-label="bar log"
            />
        );
        expect(screen.getByRole('img', { name: 'bar log' })).toBeInTheDocument();
    });

    it('renders with xScale log on vertical layout without crash', () => {
        wrap(
            <BarChart
                data={[
                    { label: 'A', count: 1 },
                    { label: 'B', count: 100 },
                ]}
                xAxisKey="label"
                layout="vertical"
                series={[{ dataKey: 'count' }]}
                xScale={{ scale: 'log', domain: [1, 'auto'] }}
                aria-label="bar vert log"
            />
        );
        expect(screen.getByRole('img', { name: 'bar vert log' })).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// ScatterChart - scale props
// ---------------------------------------------------------------------------

describe('ScatterChart - axis scale', () => {
    it('renders with default (no scale props) without crash', () => {
        wrap(
            <ScatterChart
                series={[{ name: 'Series A', data: scatterPoints }]}
                aria-label="scatter default"
            />
        );
        expect(screen.getByRole('img', { name: 'scatter default' })).toBeInTheDocument();
    });

    it('renders with yScale log without crash', () => {
        wrap(
            <ScatterChart
                series={[{ name: 'Series A', data: scatterPoints }]}
                yScale={{ scale: 'log', domain: [0.1, 'auto'] }}
                aria-label="scatter log"
            />
        );
        expect(screen.getByRole('img', { name: 'scatter log' })).toBeInTheDocument();
    });

    it('renders with log-log scale without crash', () => {
        wrap(
            <ScatterChart
                series={[{ name: 'Series A', data: scatterPoints }]}
                xScale={{ scale: 'log', domain: [0.1, 'auto'] }}
                yScale={{ scale: 'log', domain: [0.1, 'auto'] }}
                aria-label="log-log scatter"
            />
        );
        expect(screen.getByRole('img', { name: 'log-log scatter' })).toBeInTheDocument();
    });

    it('renders with sqrt scale without crash', () => {
        wrap(
            <ScatterChart
                series={[{ name: 'S', data: scatterPoints }]}
                xScale={{ scale: 'sqrt' }}
                yScale={{ scale: 'sqrt' }}
                aria-label="sqrt scatter"
            />
        );
        expect(screen.getByRole('img', { name: 'sqrt scatter' })).toBeInTheDocument();
    });
});
