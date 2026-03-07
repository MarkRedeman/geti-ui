import type { Meta, StoryObj } from '@storybook/react';
import { ActionBar, ActionBarContainer } from './ActionBar';
import { ListView, Item } from '../ListView/ListView';
import { Text } from '@adobe/react-spectrum';
import Edit from '@spectrum-icons/workflow/Edit';
import Delete from '@spectrum-icons/workflow/Delete';
import { Key } from 'react-aria-components';

const meta: Meta<typeof ActionBar> = {
    tags: ["!dev"],
    component: ActionBar,
    title: 'Data/ActionBar',
};

export default meta;

export const Default: StoryObj<typeof ActionBar> = {
    render: () => (
        <ActionBarContainer height="size-2400">
            <ListView aria-label="List with Selection" selectionMode="multiple" defaultSelectedKeys={['1', '2']}>
                <Item key="1">Item One</Item>
                <Item key="2">Item Two</Item>
                <Item key="3">Item Three</Item>
            </ListView>
            <ActionBar
                selectedItemCount={2}
                onAction={(key: Key) => console.log(key)}
                onClearSelection={() => console.log('clear')}
            >
                <Item key="edit">
                    <Edit />
                    <Text>Edit</Text>
                </Item>
                <Item key="delete">
                    <Delete />
                    <Text>Delete</Text>
                </Item>
            </ActionBar>
        </ActionBarContainer>
    ),
};
