import type { Meta, StoryObj } from '@storybook/react';

import { DropZone } from './DropZone';

const meta: Meta<typeof DropZone> = {
    tags: ["!dev"],
    component: DropZone,
    title: 'Form/DropZone',
    argTypes: {
        isFilled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof DropZone>;

export const Default: Story = {
    args: {
        children: 'Drop files here',
    },
};
