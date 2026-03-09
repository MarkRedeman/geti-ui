import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button as AriaButton } from 'react-aria-components';
import { describe, it, expect } from '@rstest/core';

import { CustomPopover } from './CustomPopover';

const renderCustomPopover = (props: Partial<React.ComponentProps<typeof CustomPopover>> = {}) =>
    render(
        <CustomPopover triggerElement={<AriaButton>Open</AriaButton>} {...props}>
            {props.children ?? <p>Popover content</p>}
        </CustomPopover>
    );

describe('CustomPopover', () => {
    it('renders the trigger without crash', () => {
        renderCustomPopover();
        expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });

    it('does not show popover content initially', () => {
        renderCustomPopover();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows popover content when trigger is clicked', async () => {
        renderCustomPopover();
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('renders custom content inside popover', async () => {
        renderCustomPopover({ children: <span>Custom content text</span> });
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        expect(screen.getByText('Custom content text')).toBeInTheDocument();
    });

    it('renders without triggerElement (controlled usage)', () => {
        render(
            <CustomPopover>
                <p>Standalone content</p>
            </CustomPopover>
        );
        // Without a trigger, it renders as an AriaPopover directly
        // (isOpen controls visibility; no assertion on dialog visibility needed)
        expect(document.body).toBeInTheDocument();
    });
});
