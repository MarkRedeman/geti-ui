import type { Meta, StoryObj } from '@storybook/react';
import { PhotoPlaceholder } from '@geti/ui';

const meta: Meta<typeof PhotoPlaceholder> = {
    tags: ["!dev"],
    component: PhotoPlaceholder,
    title: 'UI/PhotoPlaceholder',
};

export default meta;
type Story = StoryObj<typeof PhotoPlaceholder>;

export const Default: Story = {
    args: {
        name: 'John Doe',
        indicator: 'jdoe@example.com',
    },
};

export const Large: Story = {
    args: {
        name: 'Jane Smith',
        indicator: 'jsmith@example.com',
        width: 'size-2400',
        height: 'size-2400',
    },
};

export const CustomBorderRadius: Story = {
    args: {
        name: 'Square Avatar',
        indicator: 'square@example.com',
        borderRadius: '8px',
    },
};
