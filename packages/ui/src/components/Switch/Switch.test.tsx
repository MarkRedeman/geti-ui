// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { Switch } from './Switch';

const renderSwitch = (props: Partial<React.ComponentProps<typeof Switch>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Switch {...props}>{props.children ?? 'Toggle'}</Switch>
        </Provider>
    );

describe('Switch', () => {
    it('renders with role=switch', () => {
        renderSwitch();
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('displays label text', () => {
        renderSwitch({ children: 'Enable feature' });
        expect(screen.getByText('Enable feature')).toBeInTheDocument();
    });

    it('calls onChange when clicked', async () => {
        const onChange = rstest.fn();
        renderSwitch({ onChange, children: 'Toggle' });
        await userEvent.click(screen.getByRole('switch', { name: 'Toggle' }));
        expect(onChange).toHaveBeenCalledOnce();
    });

    it('does not call onChange when disabled', async () => {
        const onChange = rstest.fn();
        renderSwitch({ onChange, isDisabled: true, children: 'Toggle' });
        await userEvent.click(screen.getByRole('switch', { name: 'Toggle' }));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('accepts isEmphasized prop without error', () => {
        renderSwitch({ isEmphasized: true, children: 'Toggle' });
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });
});
