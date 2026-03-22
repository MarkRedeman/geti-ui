import { useState } from 'react';
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
    const [isHovered, setIsHovered] = useState(false);
    const showTopCorners = isSelected || isHovered;

    const className = [
        classNames.itemButton,
        isSelected ? classNames.itemSelected : '',
        isPlaceholder ? classNames.placeholder : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames.itemRoot} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {showTopCorners && topLeft ? (
                <div className={`${classNames.overlay} ${classNames.topLeft} ${classNames.topLeftContainer}`}>{topLeft}</div>
            ) : null}
            {showTopCorners && topRight ? (
                <div className={`${classNames.overlay} ${classNames.topRight} ${classNames.topRightContainer}`}>{topRight}</div>
            ) : null}
            {bottomLeft ? <div className={`${classNames.overlay} ${classNames.bottomLeft} ${classNames.bottomLeftContainer}`}>{bottomLeft}</div> : null}
            {bottomRight ? <div className={`${classNames.overlay} ${classNames.bottomRight} ${classNames.bottomRightContainer}`}>{bottomRight}</div> : null}
            <div
                className={className}
                onClick={(event) => {
                    if (isPlaceholder) {
                        return;
                    }
                    onPress?.({ shiftKey: event.shiftKey });
                }}
                onDoubleClick={() => {
                    if (isPlaceholder) {
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
