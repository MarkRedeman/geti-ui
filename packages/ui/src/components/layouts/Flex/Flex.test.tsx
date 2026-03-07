// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Flex } from './Flex';

const renderFlex = (props: Partial<React.ComponentProps<typeof Flex>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Flex gap="size-100" {...props}>
                {props.children ?? (
                    <>
                        <span>Child One</span>
                        <span>Child Two</span>
                    </>
                )}
            </Flex>
        </Provider>
    );

describe('Flex', () => {
    it('renders without crash', () => {
        renderFlex();
        expect(screen.getByText('Child One')).toBeInTheDocument();
        expect(screen.getByText('Child Two')).toBeInTheDocument();
    });

    it('renders children', () => {
        renderFlex({ children: <span>Custom Child</span> });
        expect(screen.getByText('Custom Child')).toBeInTheDocument();
    });

    it('renders as a column direction', () => {
        renderFlex({ direction: 'column' });
        expect(screen.getByText('Child One')).toBeInTheDocument();
    });

    it('renders multiple children in a row', () => {
        renderFlex({
            direction: 'row',
            children: (
                <>
                    <span>Alpha</span>
                    <span>Beta</span>
                    <span>Gamma</span>
                </>
            ),
        });
        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
        expect(screen.getByText('Gamma')).toBeInTheDocument();
    });
});
