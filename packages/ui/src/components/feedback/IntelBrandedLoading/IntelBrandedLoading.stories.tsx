import type { Meta, StoryObj } from '@storybook/react';
import { IntelBrandedLoading } from './IntelBrandedLoading';

const meta: Meta<typeof IntelBrandedLoading> = {
    title: 'Feedback/IntelBrandedLoading',
    component: IntelBrandedLoading,
    tags: ['autodocs'],
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
