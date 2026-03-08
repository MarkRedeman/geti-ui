import type { Meta, StoryObj } from '@storybook/react';
import { IntelBrandedLoading } from '@geti/ui';

const meta: Meta<typeof IntelBrandedLoading> = {
    tags: ["!dev"],
    title: 'Feedback/IntelBrandedLoading',
    component: IntelBrandedLoading,
};

export default meta;
type Story = StoryObj<typeof IntelBrandedLoading>;

export const Default: Story = {
    args: {
        height: '400px',
    },
};

export const FullHeight: Story = {
    args: {
        height: '100vh',
    },
};
