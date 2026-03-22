import type { MediaGridIdentifiable, MediaColumnProps } from './types';
import { MediaGrid } from './MediaGrid';

export function MediaColumn<T extends MediaGridIdentifiable>(props: MediaColumnProps<T>) {
    return <MediaGrid<T> {...props} columns={1} ariaLabel={props.ariaLabel ?? 'Media column'} />;
}
