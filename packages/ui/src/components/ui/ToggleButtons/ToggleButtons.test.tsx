import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleButtons } from './ToggleButtons';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { describe, it, expect, rstest } from '@rstest/core';
import '@testing-library/jest-dom';

describe('ToggleButtons', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    it('renders all options', () => {
        render(
            <ThemeProvider>
                <ToggleButtons options={options} selectedOption="Option 1" onOptionChange={() => {}} />
            </ThemeProvider>
        );

        options.forEach((option) => {
            expect(screen.getByRole('button', { name: option })).toBeInTheDocument();
        });
    });

    it('highlights the selected option', () => {
        render(
            <ThemeProvider>
                <ToggleButtons options={options} selectedOption="Option 2" onOptionChange={() => {}} />
            </ThemeProvider>
        );

        const selectedButton = screen.getByRole('button', { name: 'Option 2' });
        expect(selectedButton).toHaveAttribute('aria-pressed', 'true');

        const unselectedButton = screen.getByRole('button', { name: 'Option 1' });
        expect(unselectedButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('calls onOptionChange when a button is clicked', async () => {
        const onOptionChange = rstest.fn();
        render(
            <ThemeProvider>
                <ToggleButtons options={options} selectedOption="Option 1" onOptionChange={onOptionChange} />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Option 3' }));
        expect(onOptionChange).toHaveBeenCalledWith('Option 3');
    });

    it('does not call onOptionChange when disabled', async () => {
        const onOptionChange = rstest.fn();
        render(
            <ThemeProvider>
                <ToggleButtons options={options} selectedOption="Option 1" onOptionChange={onOptionChange} isDisabled />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Option 2' }));
        expect(onOptionChange).not.toHaveBeenCalled();
    });
});
