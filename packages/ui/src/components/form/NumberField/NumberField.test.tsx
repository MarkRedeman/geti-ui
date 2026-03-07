// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { NumberField } from './NumberField';

const renderNumberField = (props: Partial<React.ComponentProps<typeof NumberField>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <NumberField label="Quantity" {...props} />
        </Provider>
    );

describe('NumberField', () => {
    it('renders without crash', () => {
        renderNumberField();
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderNumberField({ label: 'Age' });
        expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('renders a numeric input', () => {
        renderNumberField();
        // React Spectrum renders NumberField as a textbox with role=group wrapper (mobile variant)
        expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    });

    it('is disabled when isDisabled is true', () => {
        renderNumberField({ isDisabled: true });
        expect(screen.getByLabelText('Quantity')).toBeDisabled();
    });

    it('displays defaultValue', () => {
        renderNumberField({ defaultValue: 42 });
        expect(screen.getByLabelText('Quantity')).toHaveValue('42');
    });
});
