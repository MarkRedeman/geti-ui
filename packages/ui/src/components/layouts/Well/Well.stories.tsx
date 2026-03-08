// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Well } from '@geti/ui';

const meta: Meta<typeof Well> = {
    tags: ['!dev'],
    component: Well,
    title: 'Layouts/Well',
    argTypes: {
        role: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Well>;

/** Standard Well displaying preformatted content. */
export const Default: Story = {
    args: {
        children:
            'This is a standard well. It displays non-editable content separately from other content on the screen.',
    },
};

/** Well used to display code or markup. */
export const CodeExample: Story = {
    args: {
        children: (
            <pre>
                <code>{`import { Well } from '@geti/ui';\n\n<Well>Content goes here</Well>`}</code>
            </pre>
        ),
    },
};

/** Well with an accessible region role. */
export const WithRegionRole: Story = {
    args: {
        role: 'region',
        'aria-label': 'Notes section',
        children: 'This well has an explicit region role for accessibility.',
    },
};
