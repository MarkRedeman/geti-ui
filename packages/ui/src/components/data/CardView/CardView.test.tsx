import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { CardView, CardViewProps } from './CardView';

interface TestItem {
    id: number;
    label: string;
}

const testItems: TestItem[] = [
    { id: 1, label: 'Card One' },
    { id: 2, label: 'Card Two' },
    { id: 3, label: 'Card Three' },
];

const defaultProps: CardViewProps<TestItem> = {
    items: testItems,
    'aria-label': 'Card collection',
    renderCard: (item) => ({
        'aria-label': item.label,
        children: <span>{item.label}</span>,
    }),
};

const renderCardView = (props: Partial<CardViewProps<TestItem>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <CardView {...defaultProps} {...props} />
        </Provider>
    );

describe('CardView', () => {
    it('renders without crash', () => {
        renderCardView();
        expect(screen.getByRole('list', { name: 'Card collection' })).toBeInTheDocument();
    });

    it('renders all items', () => {
        renderCardView();
        expect(screen.getByText('Card One')).toBeInTheDocument();
        expect(screen.getByText('Card Two')).toBeInTheDocument();
        expect(screen.getByText('Card Three')).toBeInTheDocument();
    });

    it('renders correct number of list items', () => {
        renderCardView();
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('renders empty list when items is empty', () => {
        renderCardView({ items: [] });
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('renders with custom columns', () => {
        renderCardView({ columns: 2 });
        expect(screen.getByRole('list')).toBeInTheDocument();
    });
});
