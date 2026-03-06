// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const renderRadioGroup = (props: Partial<React.ComponentProps<typeof RadioGroup>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <RadioGroup label="Favorite pet" {...props}>
                <Radio value="cats">Cats</Radio>
                <Radio value="dogs">Dogs</Radio>
                <Radio value="other">Other</Radio>
            </RadioGroup>
        </Provider>
    );

describe('RadioGroup', () => {
    it('renders without crash', () => {
        renderRadioGroup();
        expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('displays group label', () => {
        renderRadioGroup({ label: 'Choose color' });
        expect(screen.getByText('Choose color')).toBeInTheDocument();
    });

    it('renders all radio options', () => {
        renderRadioGroup();
        expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('selects a radio when clicked', async () => {
        renderRadioGroup();
        const catsRadio = screen.getByLabelText('Cats');
        await userEvent.click(catsRadio);
        expect(catsRadio).toBeChecked();
    });

    it('calls onChange when selection changes', async () => {
        const onChange = rstest.fn();
        renderRadioGroup({ onChange });
        await userEvent.click(screen.getByLabelText('Dogs'));
        expect(onChange).toHaveBeenCalledWith('dogs');
    });

    it('disables all radios when isDisabled is true', () => {
        renderRadioGroup({ isDisabled: true });
        const radios = screen.getAllByRole('radio');
        radios.forEach((radio) => expect(radio).toBeDisabled());
    });
});
