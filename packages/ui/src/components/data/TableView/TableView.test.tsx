import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { TableView, TableHeader, TableBody, Column, Row, Cell } from './TableView';

const columns = [
    { name: 'Name', uid: 'name' },
    { name: 'Type', uid: 'type' },
];

const rows = [
    { id: 1, name: 'Games', type: 'File folder' },
    { id: 2, name: 'bootmgr', type: 'System file' },
];

const renderTable = () =>
    render(
        <Provider theme={defaultTheme}>
            <TableView aria-label="Test table">
                <TableHeader columns={columns}>{(col) => <Column key={col.uid}>{col.name}</Column>}</TableHeader>
                <TableBody items={rows}>
                    {(item) => <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>}
                </TableBody>
            </TableView>
        </Provider>
    );

describe('TableView', () => {
    it('renders with role grid', () => {
        renderTable();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders column headers', () => {
        renderTable();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
    });

    it('renders row data', () => {
        renderTable();
        expect(screen.getByText('Games')).toBeInTheDocument();
        expect(screen.getByText('File folder')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        renderTable();
        expect(screen.getByRole('grid', { name: 'Test table' })).toBeInTheDocument();
    });
});
