import { Cell, Row } from '@geti-ui/ui';
import styles from './media-table.module.css';
import type { MediaGridIdentifiable } from '../media-grid/types';
import type { MediaEntryProps } from './types';

function createPlaceholderCell(size: number) {
    return <div className={styles.thumbnailPlaceholder} style={{ width: size, height: size }} aria-hidden="true" />;
}

type ThumbnailCellProps<T extends MediaGridIdentifiable> = {
    context: MediaEntryProps<T>['context'];
    thumbnailSize: number;
};

function getDefaultThumbnailSrc<T extends MediaGridIdentifiable>(item: T): string | undefined {
    if ('thumbnailUrl' in item && typeof item.thumbnailUrl === 'string') {
        return item.thumbnailUrl;
    }

    if ('thumbnailSrc' in item && typeof item.thumbnailSrc === 'string') {
        return item.thumbnailSrc;
    }

    return undefined;
}

function getDefaultThumbnailAlt<T extends MediaGridIdentifiable>(item: T): string {
    if ('name' in item && typeof item.name === 'string') {
        return item.name;
    }

    if ('label' in item && typeof item.label === 'string') {
        return item.label;
    }

    return `Thumbnail ${String(item.id)}`;
}

function ThumbnailCell<T extends MediaGridIdentifiable>({ context, thumbnailSize }: ThumbnailCellProps<T>) {
    if (context.isPlaceholder || !context.item) {
        return createPlaceholderCell(thumbnailSize);
    }

    const src = getDefaultThumbnailSrc(context.item);
    const alt = getDefaultThumbnailAlt(context.item);
    if (!src) {
        return createPlaceholderCell(thumbnailSize);
    }

    return (
        <img
            className={styles.thumbnail}
            src={src}
            alt={alt}
            width={thumbnailSize}
            height={thumbnailSize}
            draggable={false}
            style={{ minWidth: thumbnailSize, minHeight: thumbnailSize }}
        />
    );
}

export function MediaEntry<T extends MediaGridIdentifiable>({
    entry,
    context,
    getColumn,
    thumbnailColumnKey,
    shouldRenderAutoThumbnailColumn,
    thumbnailSize,
}: MediaEntryProps<T>) {
    return (
        <Row key={entry.key} textValue={context.item ? String(context.item.id) : `placeholder-${entry.index}`}>
            {(columnKey: string | number) => {
                const key = String(columnKey);
                const isAutoThumbnailColumn = shouldRenderAutoThumbnailColumn && key === thumbnailColumnKey;

                if (isAutoThumbnailColumn) {
                    const textValue =
                        !context.item || context.isPlaceholder ? 'Loading thumbnail' : getDefaultThumbnailAlt(context.item);

                    return (
                        <Cell textValue={textValue}>
                            <div className={styles.thumbnailCell}>
                                <ThumbnailCell context={context} thumbnailSize={thumbnailSize} />
                            </div>
                        </Cell>
                    );
                }

                const column = getColumn(key);
                if (!column) {
                    return <Cell>{null}</Cell>;
                }

                const textValue = column.textValue?.(context);

                return (
                    <Cell textValue={textValue}>
                        {key === thumbnailColumnKey ? (
                            <div className={styles.thumbnailCell}>{column.renderCell(context)}</div>
                        ) : (
                            column.renderCell(context)
                        )}
                    </Cell>
                );
            }}
        </Row>
    );
}
