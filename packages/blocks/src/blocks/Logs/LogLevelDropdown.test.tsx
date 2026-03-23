import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { LogLevelDropdown } from './LogLevelDropdown';

const levels = ['INFO', 'WARNING', 'ERROR'];

function renderDropdown(selected = new Set<string>(['INFO'])) {
    const onLevelChange = rstest.fn();
    const onSelectAll = rstest.fn();
    const onClearAll = rstest.fn();

    render(
        <ThemeProvider>
            <LogLevelDropdown
                levels={levels}
                selectedLevels={selected}
                onLevelChange={onLevelChange}
                onSelectAll={onSelectAll}
                onClearAll={onClearAll}
            />
        </ThemeProvider>
    );

    return { onLevelChange, onSelectAll, onClearAll };
}

describe('LogLevelDropdown', () => {
    it('opens and renders level checkboxes', async () => {
        renderDropdown();
        await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));

        expect(screen.getByRole('checkbox', { name: 'INFO' })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: 'WARNING' })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: 'ERROR' })).toBeTruthy();
    });

    it('calls onLevelChange when toggling a level', async () => {
        const { onLevelChange } = renderDropdown();
        await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'WARNING' }));

        expect(onLevelChange).toHaveBeenCalled();
    });

    it('calls All and None handlers', async () => {
        const { onSelectAll, onClearAll } = renderDropdown(new Set(['INFO']));
        await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));
        await userEvent.click(screen.getByRole('button', { name: 'All' }));
        expect(onSelectAll).toHaveBeenCalled();
        await userEvent.click(screen.getByRole('button', { name: 'None' }));
        expect(onClearAll).toHaveBeenCalled();
    });
});
