import { ReactNode, useRef } from 'react';
import { DimensionValue, View } from '@adobe/react-spectrum';
import { useLoadMore } from '@react-aria/utils';
import { type Responsive } from '@react-types/shared';
import {
    ListBox as AriaComponentsListBox,
    ListBoxItem,
    ListLayout,
    ListLayoutOptions,
    Selection,
    Virtualizer,
} from 'react-aria-components';
import { Loading } from '../../feedback/Loading/Loading';
import classes from './VirtualizedListLayout.module.css';

export interface VirtualizedListLayoutProps<T> {
    /** The items to display in the list. */
    items: T[];
    /** The currently selected item(s). */
    selected?: Selection;
    /** Whether the list is currently loading more items. */
    isLoading?: boolean;
    /** Accessibility label for the list. */
    ariaLabel?: string;
    /** Configuration for the virtualized list layout. */
    layoutOptions: ListLayoutOptions;
    /** The height of the list container. */
    containerHeight?: Responsive<DimensionValue>;
    /** Callback triggered when the user scrolls near the end of the list. */
    onLoadMore?: () => void;
    /** Custom renderer for the loading state. */
    renderLoading?: () => ReactNode;
    /** Custom renderer for each item in the list. */
    renderItem: (item: T) => ReactNode;
    /** Function to generate a unique key for each item. */
    idFormatter: (item: T) => string;
    /** Function to generate a text value for accessibility/search. */
    textValueFormatter: (item: T) => string;
}

/**
 * VirtualizedListLayout provides a high-performance list for large datasets.
 * It uses windowing to only render the items currently in view.
 * @deprecated Use @geti-ai/blocks media components (MediaGrid/MediaColumn/MediaRow) instead.
 */
export const VirtualizedListLayout = <T,>({
    items,
    isLoading,
    selected,
    ariaLabel,
    layoutOptions,
    containerHeight,
    renderLoading = () => <Loading mode="inline" size="M" />,
    renderItem,
    onLoadMore,
    idFormatter,
    textValueFormatter,
}: VirtualizedListLayoutProps<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);
    // @ts-ignore - useLoadMore types can be tricky with RAC
    useLoadMore({ onLoadMore, isLoading, items }, ref);

    return (
        <View UNSAFE_className={classes.mainContainer} height={containerHeight}>
            <Virtualizer layout={ListLayout} layoutOptions={layoutOptions}>
                <AriaComponentsListBox
                    ref={ref}
                    className={classes.container}
                    selectionMode="single"
                    selectedKeys={selected}
                    aria-label={ariaLabel}
                >
                    {items.map((item) => {
                        const id = idFormatter(item);

                        return (
                            <ListBoxItem id={id} key={id} textValue={textValueFormatter(item)}>
                                {renderItem(item)}
                            </ListBoxItem>
                        );
                    })}

                    {isLoading && (
                        <ListBoxItem id="loader" textValue="loading">
                            {renderLoading()}
                        </ListBoxItem>
                    )}
                </AriaComponentsListBox>
            </Virtualizer>
        </View>
    );
};
