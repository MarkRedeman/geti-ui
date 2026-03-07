// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Disclosure, DisclosurePanel, DisclosureTitle } from './Disclosure';

const meta: Meta<typeof Disclosure> = {
    tags: ["!dev"],
    component: Disclosure,
    title: 'Layouts/Disclosure',
    argTypes: {
        isQuiet: { control: 'boolean' },
        isExpanded: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Disclosure>;

/** Default disclosure — collapsed by default. */
export const Default: Story = {
    render: (args) => (
        <Disclosure {...args}>
            <DisclosureTitle>Section Title</DisclosureTitle>
            <DisclosurePanel>
                <p>This is the collapsible content of the disclosure panel.</p>
            </DisclosurePanel>
        </Disclosure>
    ),
};

/** Disclosure expanded by default. */
export const Expanded: Story = {
    render: (args) => (
        <Disclosure {...args} isExpanded>
            <DisclosureTitle>Expanded Section</DisclosureTitle>
            <DisclosurePanel>
                <p>This panel is open by default.</p>
            </DisclosurePanel>
        </Disclosure>
    ),
};

/** Quiet style disclosure. */
export const Quiet: Story = {
    render: (args) => (
        <Disclosure {...args} isQuiet>
            <DisclosureTitle>Quiet Disclosure</DisclosureTitle>
            <DisclosurePanel>
                <p>Quiet variant with reduced visual weight.</p>
            </DisclosurePanel>
        </Disclosure>
    ),
};

/** Disabled disclosure. */
export const Disabled: Story = {
    render: (args) => (
        <Disclosure {...args} isDisabled>
            <DisclosureTitle>Disabled Section</DisclosureTitle>
            <DisclosurePanel>
                <p>This disclosure cannot be toggled.</p>
            </DisclosurePanel>
        </Disclosure>
    ),
};
