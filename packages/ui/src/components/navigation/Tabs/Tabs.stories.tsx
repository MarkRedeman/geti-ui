// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Content } from '@adobe/react-spectrum';

import { TabItem as Item, TabList, TabPanels, Tabs } from '@geti/ui';

const meta: Meta<typeof Tabs> = {
    tags: ["!dev"],
    component: Tabs,
    title: 'Navigation/Tabs',
    parameters: {
        a11y: {},
    },
    argTypes: {
        orientation: {
            control: { type: 'select' },
            options: ['horizontal', 'vertical'],
        },
        isQuiet: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: (args) => (
        <Tabs {...args} aria-label="History of Ancient Rome">
            <TabList>
                <Item key="FoR">Founding of Rome</Item>
                <Item key="MaR">Monarchy and Republic</Item>
                <Item key="Emp">Empire</Item>
            </TabList>
            <TabPanels>
                <Item key="FoR">
                    <Content>Arma virumque cano, Troiae qui primus ab oris.</Content>
                </Item>
                <Item key="MaR">
                    <Content>Senatus Populusque Romanus.</Content>
                </Item>
                <Item key="Emp">
                    <Content>Alea iacta est.</Content>
                </Item>
            </TabPanels>
        </Tabs>
    ),
};

export const Vertical: Story = {
    render: (args) => (
        <Tabs {...args} orientation="vertical" aria-label="Vertical tabs example">
            <TabList>
                <Item key="overview">Overview</Item>
                <Item key="details">Details</Item>
                <Item key="settings">Settings</Item>
            </TabList>
            <TabPanels>
                <Item key="overview">
                    <Content>Overview content goes here.</Content>
                </Item>
                <Item key="details">
                    <Content>Details content goes here.</Content>
                </Item>
                <Item key="settings">
                    <Content>Settings content goes here.</Content>
                </Item>
            </TabPanels>
        </Tabs>
    ),
};

export const Quiet: Story = {
    render: (args) => (
        <Tabs {...args} isQuiet aria-label="Quiet tabs example">
            <TabList>
                <Item key="first">First Tab</Item>
                <Item key="second">Second Tab</Item>
                <Item key="third">Third Tab</Item>
            </TabList>
            <TabPanels>
                <Item key="first">
                    <Content>First panel content.</Content>
                </Item>
                <Item key="second">
                    <Content>Second panel content.</Content>
                </Item>
                <Item key="third">
                    <Content>Third panel content.</Content>
                </Item>
            </TabPanels>
        </Tabs>
    ),
};

export const Disabled: Story = {
    render: (args) => (
        <Tabs {...args} aria-label="Disabled tabs example">
            <TabList>
                <Item key="active">Active Tab</Item>
                <Item key="disabled">Disabled Tab</Item>
                <Item key="another">Another Tab</Item>
            </TabList>
            <TabPanels>
                <Item key="active">
                    <Content>Active tab content.</Content>
                </Item>
                <Item key="disabled">
                    <Content>Disabled tab content.</Content>
                </Item>
                <Item key="another">
                    <Content>Another tab content.</Content>
                </Item>
            </TabPanels>
        </Tabs>
    ),
    args: { disabledKeys: ['disabled'] },
};
