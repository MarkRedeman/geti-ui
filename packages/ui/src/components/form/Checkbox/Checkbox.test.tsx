import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { Checkbox } from './Checkbox';

const renderCheckbox = (props: Partial<React.ComponentProps<typeof Checkbox>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Checkbox {...props}>{props.children ?? 'Accept'}</Checkbox>
        </Provider>
    );

describe('Checkbox', () => {
    it('renders without crash', () => {
        renderCheckbox();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('displays label text', () => {
        renderCheckbox({ children: 'Accept terms' });
        expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('is unchecked by default', () => {
        renderCheckbox();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('is checked when defaultSelected is true', () => {
        renderCheckbox({ defaultSelected: true });
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('calls onChange when clicked', async () => {
        const onChange = rstest.fn();
        renderCheckbox({ onChange });
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledOnce();
    });

    it('does not call onChange when disabled', async () => {
        const onChange = rstest.fn();
        renderCheckbox({ onChange, isDisabled: true });
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onChange).not.toHaveBeenCalled();
    });
});
