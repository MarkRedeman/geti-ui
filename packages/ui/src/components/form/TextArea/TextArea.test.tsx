// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { TextArea } from './TextArea';

const renderTextArea = (props: Partial<React.ComponentProps<typeof TextArea>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <TextArea label="Description" {...props} />
        </Provider>
    );

describe('TextArea', () => {
    it('renders without crash', () => {
        renderTextArea();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderTextArea({ label: 'Bio' });
        expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
        const onChange = rstest.fn();
        renderTextArea({ onChange });
        await userEvent.type(screen.getByRole('textbox'), 'hello');
        expect(onChange).toHaveBeenCalled();
    });

    it('is disabled when isDisabled is true', () => {
        renderTextArea({ isDisabled: true });
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('is read-only when isReadOnly is true', () => {
        renderTextArea({ isReadOnly: true, value: 'read only' });
        expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
});
