// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Disclosure, DisclosurePanel, DisclosureTitle, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Accordion } from './Accordion';

const renderAccordion = (props: Partial<React.ComponentProps<typeof Accordion>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Accordion {...props}>
                <Disclosure>
                    <DisclosureTitle>Section One</DisclosureTitle>
                    <DisclosurePanel>Content One</DisclosurePanel>
                </Disclosure>
                <Disclosure>
                    <DisclosureTitle>Section Two</DisclosureTitle>
                    <DisclosurePanel>Content Two</DisclosurePanel>
                </Disclosure>
            </Accordion>
        </Provider>
    );

describe('Accordion', () => {
    it('renders without crash', () => {
        renderAccordion();
        expect(screen.getByText('Section One')).toBeInTheDocument();
        expect(screen.getByText('Section Two')).toBeInTheDocument();
    });

    it('renders all section titles', () => {
        renderAccordion();
        expect(screen.getByRole('button', { name: 'Section One' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Section Two' })).toBeInTheDocument();
    });

    it('expands a section when its title is clicked', async () => {
        renderAccordion();
        await userEvent.click(screen.getByRole('button', { name: 'Section One' }));
        expect(screen.getByText('Content One')).toBeVisible();
    });

    it('allows multiple sections open when allowsMultipleExpanded', async () => {
        renderAccordion({ allowsMultipleExpanded: true });
        await userEvent.click(screen.getByRole('button', { name: 'Section One' }));
        await userEvent.click(screen.getByRole('button', { name: 'Section Two' }));
        expect(screen.getByText('Content One')).toBeVisible();
        expect(screen.getByText('Content Two')).toBeVisible();
    });
});
