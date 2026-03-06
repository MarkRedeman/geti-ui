// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@adobe/react-spectrum';

import { FileTrigger } from './FileTrigger';

const meta: Meta<typeof FileTrigger> = {
    component: FileTrigger,
    title: 'Components/FileTrigger',
    argTypes: {
        acceptedFileTypes: { control: 'object' },
        allowsMultiple: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof FileTrigger>;

export const Default: Story = {
    render: (args) => (
        <FileTrigger {...args}>
            <Button variant="accent">Upload file</Button>
        </FileTrigger>
    ),
};

export const ImageOnly: Story = {
    render: (args) => (
        <FileTrigger {...args} acceptedFileTypes={['image/*']}>
            <Button variant="accent">Upload image</Button>
        </FileTrigger>
    ),
};

export const MultipleFiles: Story = {
    render: (args) => (
        <FileTrigger {...args} allowsMultiple>
            <Button variant="accent">Upload files</Button>
        </FileTrigger>
    ),
};

export const WithOnSelect: Story = {
    render: (args) => (
        <FileTrigger
            {...args}
            onSelect={(files) => {
                if (files) {
                    console.log(
                        'Selected files:',
                        Array.from(files).map((f) => f.name)
                    );
                }
            }}
        >
            <Button variant="accent">Upload with callback</Button>
        </FileTrigger>
    ),
};
