import type { Meta, StoryObj } from '@storybook/react';
import { ActionBar, ActionBarContainer, ListView, ListItem } from '@geti/ui';
import { Item, Text } from '@adobe/react-spectrum';
import Edit from '@spectrum-icons/workflow/Edit';
import Delete from '@spectrum-icons/workflow/Delete';
import { Key } from 'react-aria-components';

const meta: Meta<typeof ActionBar> = {
    tags: ['!dev'],
    component: ActionBar,
    title: 'Data/ActionBar',
};

export default meta;

export const Default: StoryObj<typeof ActionBar> = {
    render: () => (
        <ActionBarContainer height="size-2400">
            <ListView aria-label="List with Selection" selectionMode="multiple" defaultSelectedKeys={['1', '2']}>
                <ListItem key="1">Item One</ListItem>
                <ListItem key="2">Item Two</ListItem>
                <ListItem key="3">Item Three</ListItem>
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
