import { Image } from '@geti-ai/ui';
import { MediaGridItem } from './MediaGridItem';
import styles from './MediaGridItem.module.css';
import type { MediaGridThumbnailItemProps } from './types';

export function MediaGridThumbnailItem({ src, alt = 'Media item thumbnail', ...rest }: MediaGridThumbnailItemProps) {
    return (
        <MediaGridItem {...rest}>
            {src ? (
                <Image src={src} alt={alt} UNSAFE_className={styles.thumbnail} objectFit="cover" />
            ) : (
                <div className={styles.placeholderInner} aria-hidden="true" />
            )}
        </MediaGridItem>
    );
}
