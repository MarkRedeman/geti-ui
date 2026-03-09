import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { StatusLight } from './StatusLight';

const renderStatusLight = (props: Partial<React.ComponentProps<typeof StatusLight>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <StatusLight variant="positive" {...props}>
                {props.children ?? 'Active'}
            </StatusLight>
        </Provider>
    );

describe('StatusLight', () => {
    it('renders without crash', () => {
        renderStatusLight();
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders with label', () => {
        renderStatusLight({ children: 'Running' });
        expect(screen.getByText('Running')).toBeInTheDocument();
    });

    it('renders neutral variant', () => {
        renderStatusLight({ variant: 'neutral', children: 'Neutral' });
        expect(screen.getByText('Neutral')).toBeInTheDocument();
    });

    it('renders negative variant', () => {
        renderStatusLight({ variant: 'negative', children: 'Error' });
        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders notice variant', () => {
        renderStatusLight({ variant: 'notice', children: 'Warning' });
        expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('renders info variant', () => {
        renderStatusLight({ variant: 'info', children: 'Info' });
        expect(screen.getByText('Info')).toBeInTheDocument();
    });
});
