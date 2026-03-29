import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { MediaGridItemCheckbox, MediaGridItemInfo, MediaGridItemMenu, MediaGridItemStatus } from './MediaGridItemParts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithTheme(ui: React.ReactNode) {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
}

// ---------------------------------------------------------------------------
// 1. MediaGridItemCheckbox
// ---------------------------------------------------------------------------

describe('MediaGridItemCheckbox', () => {
    it('calls onChange with true when unchecked checkbox is clicked', async () => {
        const onChange = rstest.fn();
        renderWithTheme(<MediaGridItemCheckbox ariaLabel="Select item" isSelected={false} onChange={onChange} />);

        await userEvent.click(screen.getByRole('checkbox', { name: 'Select item' }));

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when checked checkbox is clicked', async () => {
        const onChange = rstest.fn();
        renderWithTheme(<MediaGridItemCheckbox ariaLabel="Select item" isSelected={true} onChange={onChange} />);

        await userEvent.click(screen.getByRole('checkbox', { name: 'Select item' }));

        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('stops click propagation so parent click handler is not triggered', () => {
        const onChange = rstest.fn();
        const parentClick = rstest.fn();

        renderWithTheme(
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div onClick={parentClick}>
                <MediaGridItemCheckbox ariaLabel="Select item" isSelected={false} onChange={onChange} />
            </div>
        );

        // The wrapper div inside MediaGridItemCheckbox has onClick={stop}.
        // Firing a click on the checkbox element should not reach the outer div.
        const checkbox = screen.getByRole('checkbox', { name: 'Select item' });
        fireEvent.click(checkbox);

        expect(parentClick).not.toHaveBeenCalled();
    });

    it('stops mousedown propagation from container to parent', () => {
        const onChange = rstest.fn();
        const parentMouseDown = rstest.fn();

        renderWithTheme(
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div onMouseDown={parentMouseDown}>
                <MediaGridItemCheckbox ariaLabel="Select item" isSelected={false} onChange={onChange} />
            </div>
        );

        const checkbox = screen.getByRole('checkbox', { name: 'Select item' });
        fireEvent.mouseDown(checkbox);

        expect(parentMouseDown).not.toHaveBeenCalled();
    });

    it('reflects isSelected=true as checked attribute on the checkbox', () => {
        renderWithTheme(<MediaGridItemCheckbox ariaLabel="Select item" isSelected={true} onChange={rstest.fn()} />);

        const checkbox = screen.getByRole('checkbox', { name: 'Select item' });
        // aria-checked or checked attribute set when selected
        expect(checkbox.getAttribute('aria-checked') ?? (checkbox as HTMLInputElement).checked).toBeTruthy();
    });

    it('reflects isSelected=false as unchecked state', () => {
        renderWithTheme(<MediaGridItemCheckbox ariaLabel="Select item" isSelected={false} onChange={rstest.fn()} />);

        const checkbox = screen.getByRole('checkbox', { name: 'Select item' });
        const isChecked =
            checkbox.getAttribute('aria-checked') === 'true' || (checkbox as HTMLInputElement).checked === true;
        expect(isChecked).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// 2. MediaGridItemMenu - renders actions and calls onAction
// ---------------------------------------------------------------------------

describe('MediaGridItemMenu', () => {
    const actions = [
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete' },
    ];

    it('renders the trigger button with the provided aria-label', () => {
        renderWithTheme(<MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={rstest.fn()} />);

        expect(screen.getByRole('button', { name: 'Item actions' })).toBeTruthy();
    });

    it('uses default aria-label "Media actions" when none is provided', () => {
        renderWithTheme(<MediaGridItemMenu actions={actions} onAction={rstest.fn()} />);

        expect(screen.getByRole('button', { name: 'Media actions' })).toBeTruthy();
    });

    it('opens the menu and renders all action items when trigger is clicked', async () => {
        renderWithTheme(<MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={rstest.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: 'Item actions' }));

        expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeTruthy();
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeTruthy();
    });

    it('calls onAction with the correct string key when a menu item is selected', async () => {
        const onAction = rstest.fn();
        renderWithTheme(<MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={onAction} />);

        await userEvent.click(screen.getByRole('button', { name: 'Item actions' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

        expect(onAction).toHaveBeenCalledWith('edit');
    });

    it('calls onAction with "delete" key when Delete item is selected', async () => {
        const onAction = rstest.fn();
        renderWithTheme(<MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={onAction} />);

        await userEvent.click(screen.getByRole('button', { name: 'Item actions' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

        expect(onAction).toHaveBeenCalledWith('delete');
    });

    it('closes the menu after an item is selected', async () => {
        renderWithTheme(<MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={rstest.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: 'Item actions' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

        await waitFor(() => {
            expect(screen.queryByRole('menu')).toBeNull();
        });
    });
});

// ---------------------------------------------------------------------------
// 3. MediaGridItemMenu - interaction does not bubble to parent click
// ---------------------------------------------------------------------------

describe('MediaGridItemMenu propagation', () => {
    const actions = [{ key: 'rename', label: 'Rename' }];

    it('does not propagate click from the menu trigger to a parent handler', () => {
        const parentClick = rstest.fn();

        renderWithTheme(
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div onClick={parentClick}>
                <MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={rstest.fn()} />
            </div>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Item actions' }));

        expect(parentClick).not.toHaveBeenCalled();
    });

    it('does not propagate mousedown from the menu container to a parent handler', () => {
        const parentMouseDown = rstest.fn();

        renderWithTheme(
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div onMouseDown={parentMouseDown}>
                <MediaGridItemMenu ariaLabel="Item actions" actions={actions} onAction={rstest.fn()} />
            </div>
        );

        fireEvent.mouseDown(screen.getByRole('button', { name: 'Item actions' }));

        expect(parentMouseDown).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// 4. MediaGridItemInfo
// ---------------------------------------------------------------------------

describe('MediaGridItemInfo', () => {
    it('renders children text', () => {
        renderWithTheme(<MediaGridItemInfo>640 × 480</MediaGridItemInfo>);

        expect(screen.getByText('640 × 480')).toBeTruthy();
    });

    it('renders arbitrary ReactNode children', () => {
        renderWithTheme(
            <MediaGridItemInfo>
                <span>Nested span</span>
            </MediaGridItemInfo>
        );

        expect(screen.getByText('Nested span')).toBeTruthy();
    });
});

// ---------------------------------------------------------------------------
// 5. MediaGridItemStatus
// ---------------------------------------------------------------------------

describe('MediaGridItemStatus', () => {
    it('renders children text', () => {
        renderWithTheme(<MediaGridItemStatus variant="positive">Annotated</MediaGridItemStatus>);

        expect(screen.getByText('Annotated')).toBeTruthy();
    });

    it('renders with "notice" variant and shows label', () => {
        renderWithTheme(<MediaGridItemStatus variant="notice">In progress</MediaGridItemStatus>);

        expect(screen.getByText('In progress')).toBeTruthy();
    });

    it('renders with "negative" variant and shows label', () => {
        renderWithTheme(<MediaGridItemStatus variant="negative">Failed</MediaGridItemStatus>);

        expect(screen.getByText('Failed')).toBeTruthy();
    });

    it('renders with "neutral" variant and shows label', () => {
        renderWithTheme(<MediaGridItemStatus variant="neutral">Unknown</MediaGridItemStatus>);

        expect(screen.getByText('Unknown')).toBeTruthy();
    });

    it('renders with "info" variant and shows label', () => {
        renderWithTheme(<MediaGridItemStatus variant="info">Info</MediaGridItemStatus>);

        expect(screen.getByText('Info')).toBeTruthy();
    });

    it('applies the Spectrum BEM class matching the provided variant', () => {
        const { container } = renderWithTheme(<MediaGridItemStatus variant="positive">Annotated</MediaGridItemStatus>);

        // Spectrum's StatusLight always adds a stable BEM modifier class
        // "spectrum-StatusLight--<variant>" regardless of CSS-module null-loading.
        // Walk up from the text node's parent to find the spectrum root element.
        const label = screen.getByText('Annotated');
        const statusEl =
            label.closest('[class*="spectrum-StatusLight"]') ??
            label.parentElement?.closest('[class*="spectrum-StatusLight"]') ??
            container.querySelector('[class*="spectrum-StatusLight--positive"]');
        expect(statusEl).toBeTruthy();
        expect(statusEl!.className).toContain('spectrum-StatusLight--positive');
    });
});
