// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Card, CardProps } from '../../layouts/Card/Card';

/**
 * Props for the CardView component.
 */
export interface CardViewProps<T = unknown> {
    /** The collection of items to render as cards. */
    items: T[];
    /** Render function that maps an item to a card. */
    renderCard: (item: T, index: number) => CardProps;
    /** 
     * Extractor function for the stable identity key of an item.
     * @default (item, index) => index
     */
    getItemKey?: (item: T, index: number) => string | number;
    /** Accessible label for the card collection. */
    'aria-label'?: string;
    /** The number of columns in the grid layout.
     * @default 3
     */
    columns?: number;
    /** Gap between cards (CSS value).
     * @default '16px'
     */
    gap?: string;
}

/**
 * A collection view that renders a responsive grid of Card components.
 * Use this to display a list of selectable summary cards from a data array.
 */
export const CardView = <T,>({
    items,
    renderCard,
    getItemKey,
    'aria-label': ariaLabel,
    columns = 3,
    gap = '16px',
}: CardViewProps<T>) => {
    return (
        <div
            role="list"
            aria-label={ariaLabel}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
            }}
        >
            {items.map((item, index) => {
                const cardProps = renderCard(item, index);
                const key = getItemKey ? getItemKey(item, index) : index;

                return (
                    <div key={key} role="listitem">
                        <Card {...cardProps} />
                    </div>
                );
            })}
        </div>
    );
};
