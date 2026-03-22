import { useEffect, useRef, useState } from 'react';
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
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [hasExpandedMenu, setHasExpandedMenu] = useState(false);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }

        const updateExpandedState = () => {
            const expandedTrigger = root.querySelector('[aria-haspopup="true"][aria-expanded="true"]');
            setHasExpandedMenu(expandedTrigger !== null);
        };

        updateExpandedState();

        const observer = new MutationObserver(updateExpandedState);
        observer.observe(root, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['aria-expanded'],
        });

        return () => observer.disconnect();
    }, []);

    const showTopCorners = isSelected || isHovered || hasExpandedMenu;

    const className = [
        classNames.itemButton,
        isSelected ? classNames.itemSelected : '',
        isPlaceholder ? classNames.placeholder : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={rootRef} className={classNames.itemRoot} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <PressableElement onPress={onPress} onDoubleClick={onDoublePress} UNSAFE_className={className}>
                {showTopCorners && topLeft ? (
                    <div className={`${classNames.overlay} ${classNames.topLeft} ${classNames.topLeftContainer}`}>{topLeft}</div>
                ) : null}
                {showTopCorners && topRight ? (
                    <div className={`${classNames.overlay} ${classNames.topRight} ${classNames.topRightContainer}`}>{topRight}</div>
                ) : null}
                {bottomLeft ? (
                    <div className={`${classNames.overlay} ${classNames.bottomLeft} ${classNames.bottomLeftContainer}`}>{bottomLeft}</div>
                ) : null}
                {bottomRight ? (
                    <div className={`${classNames.overlay} ${classNames.bottomRight} ${classNames.bottomRightContainer}`}>{bottomRight}</div>
                ) : null}
                <div className={classNames.content}>{children}</div>
            </PressableElement>
        </div>
    );
}
