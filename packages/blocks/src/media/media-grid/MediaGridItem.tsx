import classNames from './MediaGridItem.module.css';
import type { MediaGridItemProps } from './types';

export function MediaGridItem({
    isSelected = false,
    isPlaceholder = false,
    onPress,
    onDoublePress,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    children,
}: MediaGridItemProps) {
    const className = [
        classNames.itemButton,
        isSelected ? classNames.itemSelected : '',
        isPlaceholder ? classNames.placeholder : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames.itemRoot}>
            {topLeft ? (
                <div
                    className={`${classNames.overlay} ${classNames.topLeft} ${classNames.topLeftContainer}`}
                >
                    {topLeft}
                </div>
            ) : null}
            {topRight ? (
                <div
                    className={`${classNames.overlay} ${classNames.topRight} ${classNames.topRightContainer}`}
                    onClick={(event) => event.stopPropagation()}
                    onDoubleClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                >
                    {topRight}
                </div>
            ) : null}
            {bottomLeft ? (
                <div
                    className={`${classNames.overlay} ${classNames.bottomLeft} ${classNames.bottomLeftContainer}`}
                    onClick={(event) => event.stopPropagation()}
                    onDoubleClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                >
                    {bottomLeft}
                </div>
            ) : null}
            {bottomRight ? (
                <div
                    className={`${classNames.overlay} ${classNames.bottomRight} ${classNames.bottomRightContainer}`}
                    onClick={(event) => event.stopPropagation()}
                    onDoubleClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                >
                    {bottomRight}
                </div>
            ) : null}
            <div
                className={className}
                onClick={(event) => {
                    if (isPlaceholder) {
                        return;
                    }
                    const target = event.target as HTMLElement | null;
                    if (target?.closest('[data-media-grid-interactive="true"]')) {
                        return;
                    }
                    onPress?.({ shiftKey: event.shiftKey });
                }}
                onDoubleClick={(event) => {
                    if (isPlaceholder) {
                        return;
                    }
                    const target = event.target as HTMLElement | null;
                    if (target?.closest('[data-media-grid-interactive="true"]')) {
                        return;
                    }
                    onDoublePress?.();
                }}
            >
                <div className={classNames.content}>{children}</div>
            </div>
        </div>
    );
}
