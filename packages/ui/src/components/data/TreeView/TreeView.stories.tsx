import type { Meta, StoryObj } from '@storybook/react';
import { Item, Text } from '@adobe/react-spectrum';
import { TreeView } from '@geti/ui';

const meta: Meta<typeof TreeView> = {
    tags: ['!dev'],
    component: TreeView,
    title: 'Data/TreeView',
};

export default meta;
type Story = StoryObj<typeof TreeView>;

export const Default: Story = {
    render: (args) => (
        <TreeView {...args} aria-label="Files">
            <Item textValue="Documents">
                <Text>Documents</Text>
                <Item textValue="Project.docx">Project.docx</Item>
                <Item textValue="Budget.xlsx">Budget.xlsx</Item>
            </Item>
            <Item textValue="Images">
                <Text>Images</Text>
                <Item textValue="logo.png">logo.png</Item>
            </Item>
        </TreeView>
    ),
};
