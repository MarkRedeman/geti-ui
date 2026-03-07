// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Button } from '../../ui/Button/Button';
import { Tooltip } from './Tooltip';
import { TooltipTrigger } from './TooltipTrigger';

describe('Tooltip', () => {
    it('renders the trigger button without crash', () => {
        render(
            <Provider theme={defaultTheme}>
                <TooltipTrigger delay={0}>
                    <Button variant="primary">Hover me</Button>
                    <Tooltip>Tooltip content</Tooltip>
                </TooltipTrigger>
            </Provider>
        );
        expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    });

    it('does not show tooltip content initially', () => {
        render(
            <Provider theme={defaultTheme}>
                <TooltipTrigger delay={0}>
                    <Button variant="primary">Hover me</Button>
                    <Tooltip>Tooltip content</Tooltip>
                </TooltipTrigger>
            </Provider>
        );
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('renders tooltip with variant prop', () => {
        render(
            <Provider theme={defaultTheme}>
                <TooltipTrigger delay={0}>
                    <Button variant="primary">Hover me</Button>
                    <Tooltip variant="info">Info tooltip</Tooltip>
                </TooltipTrigger>
            </Provider>
        );
        expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    });

    it('renders tooltip with placement prop on trigger', () => {
        render(
            <Provider theme={defaultTheme}>
                <TooltipTrigger delay={0} placement="bottom">
                    <Button variant="primary">Hover me</Button>
                    <Tooltip>Tooltip content</Tooltip>
                </TooltipTrigger>
            </Provider>
        );
        expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    });

    it('renders with disabled trigger', () => {
        render(
            <Provider theme={defaultTheme}>
                <TooltipTrigger isDisabled delay={0}>
                    <Button variant="primary">Disabled trigger</Button>
                    <Tooltip>Tooltip content</Tooltip>
                </TooltipTrigger>
            </Provider>
        );
        expect(screen.getByRole('button', { name: 'Disabled trigger' })).toBeInTheDocument();
    });
});
