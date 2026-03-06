// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Link } from './Link';

const renderLink = (props: Partial<React.ComponentProps<typeof Link>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Link href="https://example.com" {...props}>
                {props.children ?? 'Click here'}
            </Link>
        </Provider>
    );

describe('Link', () => {
    it('renders without crash', () => {
        renderLink();
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('displays children text', () => {
        renderLink({ children: 'Learn more' });
        expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
    });

    it('renders with href attribute', () => {
        renderLink({ href: 'https://docs.example.com' });
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://docs.example.com');
    });

    it('renders primary variant', () => {
        renderLink({ variant: 'primary' });
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent('Click here');
    });

    it('renders secondary variant', () => {
        renderLink({ variant: 'secondary' });
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent('Click here');
    });

    it('renders quiet style', () => {
        renderLink({ isQuiet: true });
        expect(screen.getByRole('link')).toBeInTheDocument();
    });
});
