import { ActionMenu, ActionMenuItem, Checkbox, StatusLight, Text } from '@geti-ui/ui';
import type { MouseEvent, PointerEvent } from 'react';
import styles from './MediaGridItem.module.css';
import type {
    MediaGridItemCheckboxProps,
    MediaGridItemInfoProps,
    MediaGridItemMenuProps,
    MediaGridItemStatusProps,
} from './types';

export function MediaGridItemCheckbox({ ariaLabel, isSelected, onChange }: MediaGridItemCheckboxProps) {
    const stop = (event: MouseEvent | PointerEvent) => {
        event.stopPropagation();
    };

    return (
        <div
            className={styles.checkboxContainer}
            data-media-grid-interactive="true"
            onMouseDown={stop}
            onClick={stop}
            onDoubleClick={stop}
            onPointerDown={stop}
            onPointerUp={stop}
        >
            <Checkbox aria-label={ariaLabel} isSelected={isSelected} onChange={(next: boolean) => onChange(next)} />
        </div>
    );
}

export function MediaGridItemMenu({ ariaLabel = 'Media actions', actions, onAction }: MediaGridItemMenuProps) {
    const stop = (event: MouseEvent | PointerEvent) => {
        event.stopPropagation();
    };

    return (
        <div
            className={styles.menuContainer}
            data-media-grid-interactive="true"
            onMouseDown={stop}
            onClick={stop}
            onDoubleClick={stop}
            onPointerDown={stop}
            onPointerUp={stop}
        >
            <ActionMenu isQuiet aria-label={ariaLabel} onAction={(key: React.Key) => onAction(String(key))}>
                {actions.map((action) => (
                    <ActionMenuItem key={action.key}>{action.label}</ActionMenuItem>
                ))}
            </ActionMenu>
        </div>
    );
}

export function MediaGridItemInfo({ children }: MediaGridItemInfoProps) {
    return <Text UNSAFE_className={styles.infoText}>{children}</Text>;
}

export function MediaGridItemStatus({ variant, children }: MediaGridItemStatusProps) {
    return (
        <StatusLight variant={variant} UNSAFE_className={styles.statusCompact}>
            {children}
        </StatusLight>
    );
}
