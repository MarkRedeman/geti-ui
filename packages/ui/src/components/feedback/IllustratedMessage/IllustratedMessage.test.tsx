// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme, Content, Heading } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { IllustratedMessage } from './IllustratedMessage';

const renderIllustratedMessage = () =>
    render(
        <Provider theme={defaultTheme}>
            <IllustratedMessage>
                <Heading>No results</Heading>
                <Content>Try a different search.</Content>
            </IllustratedMessage>
        </Provider>
    );

describe('IllustratedMessage', () => {
    it('renders without crash', () => {
        renderIllustratedMessage();
        expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('renders the heading', () => {
        renderIllustratedMessage();
        expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('renders the content body', () => {
        renderIllustratedMessage();
        expect(screen.getByText('Try a different search.')).toBeInTheDocument();
    });
});
