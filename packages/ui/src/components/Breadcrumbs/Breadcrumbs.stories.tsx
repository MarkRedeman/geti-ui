// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs } from './Breadcrumbs';
import { Item } from './Item';

const meta: Meta<typeof Breadcrumbs> = {
    component: Breadcrumbs,
    title: 'Components/Breadcrumbs',
    parameters: {
        a11y: {},
    },
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['S', 'M', 'L'],
        },
        isDisabled: { control: 'boolean' },
        showRoot: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
    render: (args) => (
        <Breadcrumbs {...args}>
            <Item key="home" href="/">
                Home
            </Item>
            <Item key="products" href="/products">
                Products
            </Item>
            <Item key="current">Current Page</Item>
        </Breadcrumbs>
    ),
};

export const MultiLevel: Story = {
    render: (args) => (
        <Breadcrumbs {...args}>
            <Item key="home" href="/">
                Home
            </Item>
            <Item key="section" href="/section">
                Section
            </Item>
            <Item key="subsection" href="/section/subsection">
                Subsection
            </Item>
            <Item key="page">Current Page</Item>
        </Breadcrumbs>
    ),
};

export const Small: Story = {
    render: (args) => (
        <Breadcrumbs {...args} size="S">
            <Item key="home" href="/">
                Home
            </Item>
            <Item key="projects" href="/projects">
                Projects
            </Item>
            <Item key="current">My Project</Item>
        </Breadcrumbs>
    ),
};

export const Disabled: Story = {
    render: (args) => (
        <Breadcrumbs {...args} isDisabled>
            <Item key="home" href="/">
                Home
            </Item>
            <Item key="products" href="/products">
                Products
            </Item>
            <Item key="current">Current Page</Item>
        </Breadcrumbs>
    ),
};
