// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Disclosure, DisclosurePanel, DisclosureTitle } from '@adobe/react-spectrum';

import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
    component: Accordion,
    title: 'Components/Accordion',
    argTypes: {
        isQuiet: { control: 'boolean' },
        allowsMultipleExpanded: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

/** Default accordion with multiple collapsible sections. */
export const Default: Story = {
    render: (args) => (
        <Accordion {...args}>
            <Disclosure>
                <DisclosureTitle>Section One</DisclosureTitle>
                <DisclosurePanel>
                    <p>Content for section one.</p>
                </DisclosurePanel>
            </Disclosure>
            <Disclosure>
                <DisclosureTitle>Section Two</DisclosureTitle>
                <DisclosurePanel>
                    <p>Content for section two.</p>
                </DisclosurePanel>
            </Disclosure>
            <Disclosure>
                <DisclosureTitle>Section Three</DisclosureTitle>
                <DisclosurePanel>
                    <p>Content for section three.</p>
                </DisclosurePanel>
            </Disclosure>
        </Accordion>
    ),
};

/** Accordion allowing multiple panels to be open simultaneously. */
export const MultipleExpanded: Story = {
    render: (args) => (
        <Accordion {...args} allowsMultipleExpanded>
            <Disclosure>
                <DisclosureTitle>First Item</DisclosureTitle>
                <DisclosurePanel>
                    <p>First item content — stays open when others open.</p>
                </DisclosurePanel>
            </Disclosure>
            <Disclosure>
                <DisclosureTitle>Second Item</DisclosureTitle>
                <DisclosurePanel>
                    <p>Second item content.</p>
                </DisclosurePanel>
            </Disclosure>
        </Accordion>
    ),
};

/** Quiet accordion style. */
export const Quiet: Story = {
    render: (args) => (
        <Accordion {...args} isQuiet>
            <Disclosure>
                <DisclosureTitle>Quiet Section A</DisclosureTitle>
                <DisclosurePanel>
                    <p>Quiet accordion panel A.</p>
                </DisclosurePanel>
            </Disclosure>
            <Disclosure>
                <DisclosureTitle>Quiet Section B</DisclosureTitle>
                <DisclosurePanel>
                    <p>Quiet accordion panel B.</p>
                </DisclosurePanel>
            </Disclosure>
        </Accordion>
    ),
};
