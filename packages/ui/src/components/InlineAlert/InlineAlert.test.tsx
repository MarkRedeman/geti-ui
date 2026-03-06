// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Content, Heading, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { InlineAlert } from './InlineAlert';

const renderInlineAlert = (props: Partial<React.ComponentProps<typeof InlineAlert>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <InlineAlert variant="neutral" {...props}>
                {props.children ?? (
                    <>
                        <Heading>Title</Heading>
                        <Content>Description text</Content>
                    </>
                )}
            </InlineAlert>
        </Provider>
    );

describe('InlineAlert', () => {
    it('renders without crash', () => {
        renderInlineAlert();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with role=alert', () => {
        renderInlineAlert();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders title', () => {
        renderInlineAlert();
        expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('renders description', () => {
        renderInlineAlert();
        expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('renders negative variant', () => {
        renderInlineAlert({ variant: 'negative' });
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders positive variant', () => {
        renderInlineAlert({ variant: 'positive' });
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders notice variant', () => {
        renderInlineAlert({ variant: 'notice' });
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});
