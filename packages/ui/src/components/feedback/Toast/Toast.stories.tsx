import type { Meta, StoryObj } from '@storybook/react';

import { Button, ToastContainer, toast } from '@geti-ai/ui';

const meta: Meta<typeof ToastContainer> = {
    tags: ['!dev'],
    component: ToastContainer,
    title: 'Feedback/Toast',
    parameters: {
        a11y: {},
    },
    decorators: [
        (Story) => (
            <>
                <ToastContainer placement="bottom" />
                <Story />
            </>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof ToastContainer>;

/** Success toast triggered by button press. */
export const Success: Story = {
    render: () => (
        <Button variant="accent" onPress={() => toast.positive('Changes saved successfully!')}>
            Show Success Toast
        </Button>
    ),
};

/** Error toast triggered by button press. */
export const Error: Story = {
    render: () => (
        <Button
            variant="negative"
            onPress={() => toast.negative('An error occurred. Please try again.', { timeout: 10000 })}
        >
            Show Error Toast
        </Button>
    ),
};

/** Info toast triggered by button press. */
export const Info: Story = {
    render: () => (
        <Button variant="primary" onPress={() => toast.info('Your session will expire soon.')}>
            Show Info Toast
        </Button>
    ),
};

/** Neutral toast triggered by button press. */
export const Neutral: Story = {
    render: () => (
        <Button variant="secondary" onPress={() => toast.neutral('No changes detected.')}>
            Show Neutral Toast
        </Button>
    ),
};

/** Toast with action button. */
export const WithAction: Story = {
    render: () => (
        <Button
            variant="primary"
            onPress={() =>
                toast.info('File ready to download.', {
                    actionLabel: 'Download',
                    onAction: () => alert('Downloading…'),
                    shouldCloseOnAction: true,
                })
            }
        >
            Show Toast with Action
        </Button>
    ),
};
