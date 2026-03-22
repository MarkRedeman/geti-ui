import { PressableElement } from '@geti-ai/ui';
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
        <PressableElement onPress={onPress} onDoubleClick={onDoublePress} UNSAFE_className={className}>
            {topLeft ? <div className={`${classNames.overlay} ${classNames.topLeft}`}>{topLeft}</div> : null}
            {topRight ? <div className={`${classNames.overlay} ${classNames.topRight}`}>{topRight}</div> : null}
            {bottomLeft ? <div className={`${classNames.overlay} ${classNames.bottomLeft}`}>{bottomLeft}</div> : null}
            {bottomRight ? <div className={`${classNames.overlay} ${classNames.bottomRight}`}>{bottomRight}</div> : null}
            <div className={classNames.content}>{children}</div>
        </PressableElement>
    );
}
