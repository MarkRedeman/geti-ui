import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Badge } from './Badge';

const renderBadge = (props: Partial<React.ComponentProps<typeof Badge>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Badge variant="neutral" {...props}>
                {props.children ?? 'Label'}
            </Badge>
        </Provider>
    );

describe('Badge', () => {
    it('renders without crash', () => {
        renderBadge();
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('renders with label text', () => {
        renderBadge({ children: 'Active' });
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders info variant', () => {
        renderBadge({ variant: 'info', children: 'Info' });
        expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('renders positive variant', () => {
        renderBadge({ variant: 'positive', children: 'Success' });
        expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('renders negative variant', () => {
        renderBadge({ variant: 'negative', children: 'Error' });
        expect(screen.getByText('Error')).toBeInTheDocument();
    });
});
