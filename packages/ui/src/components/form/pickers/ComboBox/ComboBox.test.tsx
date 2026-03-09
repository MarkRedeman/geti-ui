import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { ComboBox, Item } from './ComboBox';

const renderComboBox = (props: Partial<React.ComponentProps<typeof ComboBox>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <ComboBox label="Animal" {...props}>
                <Item key="cat">Cat</Item>
                <Item key="dog">Dog</Item>
                <Item key="fish">Fish</Item>
            </ComboBox>
        </Provider>
    );

describe('ComboBox', () => {
    it('renders without crash', () => {
        renderComboBox();
        // React Spectrum renders ComboBox as role="button" in mobile/jsdom environment
        expect(screen.getByRole('button', { name: 'Animal' })).toBeInTheDocument();
    });

    it('displays label', () => {
        renderComboBox({ label: 'Choose animal' });
        expect(screen.getByText('Choose animal')).toBeInTheDocument();
    });

    it('has a trigger button', () => {
        renderComboBox();
        // React Spectrum renders ComboBox as role="button" in mobile/jsdom environment
        expect(screen.getByRole('button', { name: 'Animal' })).toBeInTheDocument();
    });

    it('opens dropdown on interaction', async () => {
        renderComboBox();
        await userEvent.click(screen.getByRole('button', { name: 'Animal' }));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('is disabled when isDisabled is true', () => {
        renderComboBox({ isDisabled: true });
        // React Spectrum uses aria-disabled on the div[role="button"] rather than the disabled attribute
        expect(screen.getByRole('button', { name: 'Animal' })).toHaveAttribute('aria-disabled', 'true');
    });
});
