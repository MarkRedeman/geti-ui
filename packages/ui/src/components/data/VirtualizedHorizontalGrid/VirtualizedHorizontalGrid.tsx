import { ComponentProps, ReactNode } from 'react';
import { DimensionValue, View } from '@adobe/react-spectrum';
import { type Responsive } from '@react-types/shared';
import { ListBox as AriaComponentsListBox, ListBoxItem, Virtualizer } from 'react-aria-components';
import { HorizontalLayout, HorizontalLayoutOptions } from './HorizontalLayout';
import classes from './VirtualizedHorizontalGrid.module.css';

export interface VirtualizedHorizontalGridProps<T> {
    /** The items to display in the grid. */
    items: T[];
    /** The height of the grid container. */
    height?: Responsive<DimensionValue>;
    /** Custom renderer for each item in the grid. */
    renderItem: (item: T) => ReactNode;
    /** Function to generate a unique key for each item. */
    idFormatter: (item: T) => string;
    /** Function to generate a text value for accessibility/search. */
    textValueFormatter: (item: T) => string;
    /** Configuration for the horizontal layout. */
    layoutOptions: HorizontalLayoutOptions;
    /** Optional custom styles for each list box item. */
    listBoxItemStyles?: ComponentProps<typeof ListBoxItem>['style'];
}

/**
 * VirtualizedHorizontalGrid provides a horizontally scrolling virtualized grid.
 * It is commonly used for thumbnail carousels or horizontal media galleries.
 * @deprecated Use @geti-ai/blocks media components (MediaRow/MediaGrid) instead.
 */
export const VirtualizedHorizontalGrid = <T,>({
    items,
    height = '100%',
    renderItem,
    idFormatter,
    textValueFormatter,
    layoutOptions,
    listBoxItemStyles,
}: VirtualizedHorizontalGridProps<T>) => {
    return (
        <View position="relative" width="100%" height={height}>
            <Virtualizer layout={HorizontalLayout} layoutOptions={layoutOptions}>
                <AriaComponentsListBox className={classes.container} orientation="horizontal">
                    {items.map((item) => {
                        const id = idFormatter(item);

                        return (
                            <ListBoxItem
                                id={id}
                                key={id}
                                textValue={textValueFormatter(item)}
                                style={listBoxItemStyles}
                            >
                                {renderItem(item)}
                            </ListBoxItem>
                        );
                    })}
                </AriaComponentsListBox>
            </Virtualizer>
        </View>
    );
};
