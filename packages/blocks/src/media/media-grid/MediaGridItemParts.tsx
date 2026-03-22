import { ActionMenu, Checkbox, StatusLight, Text, View } from '@geti-ai/ui';
import { Item } from '@adobe/react-spectrum';
import styles from './MediaGridItem.module.css';
import type {
    MediaGridItemCheckboxProps,
    MediaGridItemInfoProps,
    MediaGridItemMenuProps,
    MediaGridItemStatusProps,
} from './types';

export function MediaGridItemCheckbox({ ariaLabel, isSelected, onChange }: MediaGridItemCheckboxProps) {
    return (
        <View UNSAFE_className={styles.checkboxContainer}>
            <Checkbox aria-label={ariaLabel} isSelected={isSelected} onChange={onChange} />
        </View>
    );
}

export function MediaGridItemMenu({ ariaLabel = 'Media actions', actions, onAction }: MediaGridItemMenuProps) {
    return (
        <View UNSAFE_className={styles.menuContainer}>
            <ActionMenu isQuiet aria-label={ariaLabel} onAction={(key) => onAction(String(key))}>
                {actions.map((action) => (
                    <Item key={action.key}>{action.label}</Item>
                ))}
            </ActionMenu>
        </View>
    );
}

export function MediaGridItemInfo({ children }: MediaGridItemInfoProps) {
    return (
        <Text UNSAFE_className={styles.infoText}>
            {children}
        </Text>
    );
}

export function MediaGridItemStatus({ variant, children }: MediaGridItemStatusProps) {
    return (
        <StatusLight variant={variant} UNSAFE_className={styles.statusCompact}>
            {children}
        </StatusLight>
    );
}
