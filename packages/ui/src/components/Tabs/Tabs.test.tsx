// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Content, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Item } from './Item';
import { TabList } from './TabList';
import { TabPanels } from './TabPanels';
import { Tabs } from './Tabs';

const renderTabs = () =>
    render(
        <Provider theme={defaultTheme}>
            <Tabs aria-label="Test tabs">
                <TabList>
                    <Item key="tab1">Tab One</Item>
                    <Item key="tab2">Tab Two</Item>
                    <Item key="tab3">Tab Three</Item>
                </TabList>
                <TabPanels>
                    <Item key="tab1">
                        <Content>Panel One Content</Content>
                    </Item>
                    <Item key="tab2">
                        <Content>Panel Two Content</Content>
                    </Item>
                    <Item key="tab3">
                        <Content>Panel Three Content</Content>
                    </Item>
                </TabPanels>
            </Tabs>
        </Provider>
    );

describe('Tabs', () => {
    it('renders without crash', () => {
        renderTabs();
        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders all tab items', () => {
        renderTabs();
        expect(screen.getByRole('tab', { name: 'Tab One' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Tab Two' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Tab Three' })).toBeInTheDocument();
    });

    it('shows first tab panel by default', () => {
        renderTabs();
        expect(screen.getByRole('tabpanel')).toBeInTheDocument();
        expect(screen.getByText('Panel One Content')).toBeInTheDocument();
    });

    it('changes panel content when a tab is selected', async () => {
        renderTabs();
        await userEvent.click(screen.getByRole('tab', { name: 'Tab Two' }));
        expect(screen.getByText('Panel Two Content')).toBeInTheDocument();
    });

    it('marks the selected tab as selected', async () => {
        renderTabs();
        const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });
        await userEvent.click(tabTwo);
        expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    });
});
