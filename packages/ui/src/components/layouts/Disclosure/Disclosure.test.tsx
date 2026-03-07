// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Disclosure, DisclosurePanel, DisclosureTitle } from './Disclosure';

const renderDisclosure = (props: Partial<React.ComponentProps<typeof Disclosure>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Disclosure {...props}>
                <DisclosureTitle>Section Title</DisclosureTitle>
                <DisclosurePanel>Panel Content</DisclosurePanel>
            </Disclosure>
        </Provider>
    );

describe('Disclosure', () => {
    it('renders without crash', () => {
        renderDisclosure();
        expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('renders the title', () => {
        renderDisclosure();
        expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('panel content is hidden by default', () => {
        renderDisclosure();
        expect(screen.queryByText('Panel Content')).not.toBeVisible();
    });

    it('expands when title is clicked', async () => {
        renderDisclosure();
        const trigger = screen.getByRole('button', { name: 'Section Title' });
        await userEvent.click(trigger);
        expect(screen.getByText('Panel Content')).toBeVisible();
    });

    it('renders expanded when isExpanded is set', () => {
        renderDisclosure({ isExpanded: true });
        expect(screen.getByText('Panel Content')).toBeVisible();
    });
});
