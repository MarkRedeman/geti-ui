// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme, Checkbox } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { CheckboxGroup } from './CheckboxGroup';

const renderCheckboxGroup = (props: Partial<React.ComponentProps<typeof CheckboxGroup>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <CheckboxGroup label="Options" {...props}>
                <Checkbox value="a">Option A</Checkbox>
                <Checkbox value="b">Option B</Checkbox>
                <Checkbox value="c">Option C</Checkbox>
            </CheckboxGroup>
        </Provider>
    );

describe('CheckboxGroup', () => {
    it('renders without crash', () => {
        renderCheckboxGroup();
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('displays group label', () => {
        renderCheckboxGroup({ label: 'Preferences' });
        expect(screen.getByText('Preferences')).toBeInTheDocument();
    });

    it('renders all checkbox options', () => {
        renderCheckboxGroup();
        expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('calls onChange when a checkbox is toggled', async () => {
        const onChange = rstest.fn();
        renderCheckboxGroup({ onChange });
        await userEvent.click(screen.getByLabelText('Option A'));
        expect(onChange).toHaveBeenCalledWith(['a']);
    });

    it('disables all checkboxes when isDisabled is true', () => {
        renderCheckboxGroup({ isDisabled: true });
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((cb) => expect(cb).toBeDisabled());
    });
});
