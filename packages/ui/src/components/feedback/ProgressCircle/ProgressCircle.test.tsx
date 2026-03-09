import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { ProgressCircle } from './ProgressCircle';

const renderProgressCircle = (props: Partial<React.ComponentProps<typeof ProgressCircle>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <ProgressCircle aria-label="Loading" value={50} {...props} />
        </Provider>
    );

describe('ProgressCircle', () => {
    it('renders without crash', () => {
        renderProgressCircle();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with role=progressbar', () => {
        renderProgressCircle();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders as indeterminate', () => {
        renderProgressCircle({ isIndeterminate: true });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders small size', () => {
        renderProgressCircle({ size: 'S' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders large size', () => {
        renderProgressCircle({ size: 'L' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
