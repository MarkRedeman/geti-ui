// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { TableView, TableHeader, TableBody, Column, Row, Cell } from './TableView';

const meta: Meta<typeof TableView> = {
    component: TableView,
    title: 'Components/TableView',
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof TableView>;

const columns = [
    { name: 'Name', uid: 'name' },
    { name: 'Type', uid: 'type' },
    { name: 'Date Modified', uid: 'date' },
];

const rows = [
    { id: 1, name: 'Games', type: 'File folder', date: '6/7/2020' },
    { id: 2, name: 'Program Files', type: 'File folder', date: '4/7/2021' },
    { id: 3, name: 'bootmgr', type: 'System file', date: '11/20/2010' },
    { id: 4, name: 'log.txt', type: 'Text document', date: '1/18/2016' },
];

/** Default table with sortable columns. */
export const Default: Story = {
    render: () => (
        <TableView aria-label="Example table" height="size-3000" width="size-6000">
            <TableHeader columns={columns}>
                {(col) => (
                    <Column key={col.uid} allowsSorting>
                        {col.name}
                    </Column>
                )}
            </TableHeader>
            <TableBody items={rows}>
                {(item) => <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>}
            </TableBody>
        </TableView>
    ),
};

/** Table with multiple row selection. */
export const Selectable: Story = {
    render: () => (
        <TableView aria-label="Selectable table" selectionMode="multiple" height="size-3000" width="size-6000">
            <TableHeader columns={columns}>{(col) => <Column key={col.uid}>{col.name}</Column>}</TableHeader>
            <TableBody items={rows}>
                {(item) => <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>}
            </TableBody>
        </TableView>
    ),
};

/** Compact density table. */
export const Compact: Story = {
    render: () => (
        <TableView aria-label="Compact table" density="compact" height="size-3000" width="size-6000">
            <TableHeader columns={columns}>{(col) => <Column key={col.uid}>{col.name}</Column>}</TableHeader>
            <TableBody items={rows}>
                {(item) => <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>}
            </TableBody>
        </TableView>
    ),
};
