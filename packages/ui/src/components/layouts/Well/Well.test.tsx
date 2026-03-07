// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Well } from './Well';

const renderWell = (props: Partial<React.ComponentProps<typeof Well>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Well {...props}>{props.children ?? 'Well content'}</Well>
        </Provider>
    );

describe('Well', () => {
    it('renders without crash', () => {
        renderWell();
        expect(screen.getByText('Well content')).toBeInTheDocument();
    });

    it('renders children', () => {
        renderWell({ children: 'Custom content' });
        expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('renders with region role', () => {
        renderWell({ role: 'region', 'aria-label': 'Notes' });
        expect(screen.getByRole('region', { name: 'Notes' })).toBeInTheDocument();
    });

    it('renders multiline content', () => {
        renderWell({
            children: (
                <pre>
                    <code>const x = 1;</code>
                </pre>
            ),
        });
        expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });
});
