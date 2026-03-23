import { useState, type Key, type ReactNode } from 'react';
import { Menu, MenuItem, MenuTrigger, PressableElement, Text } from '@geti-ai/ui';
import { Icon } from '@adobe/react-spectrum';
import { MoreMenu } from '@geti-ai/ui/icons';
import styles from './ManagedTab.module.css';

export type ManagedTabAction = {
    key: string;
    label: string;
};

export type ManagedTabProps = {
    label: string;
    isSelected: boolean;
    actions: ManagedTabAction[];
    onAction: (actionKey: string) => void;
    trailingContent?: ReactNode;
};

export function ManagedTab({ label, isSelected, actions, onAction, trailingContent }: ManagedTabProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasActions = actions.length > 0;
    const isActionable = isSelected && hasActions;

    const openMenuIfActionable = () => {
        if (!isActionable) {
            return;
        }

        setIsOpen(true);
    };

    const tabContent = (
        <span className={styles.managedTab}>
            <Text>{label}</Text>

            {isActionable ? (
                <Icon size="S">
                    <MoreMenu className={styles.moreMenuIcon} />
                </Icon>
            ) : (
                <span className={styles.actionSpacer} aria-hidden="true" />
            )}

            {trailingContent}
        </span>
    );

    if (!isActionable) {
        return tabContent;
    }

    return (
        <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <PressableElement UNSAFE_className={styles.trigger} onPress={openMenuIfActionable}>
                {tabContent}
            </PressableElement>
            <Menu
                onAction={(key: Key) => {
                    onAction(String(key));
                    setIsOpen(false);
                }}
            >
                {actions.map((action) => (
                    <MenuItem key={action.key}>{action.label}</MenuItem>
                ))}
            </Menu>
        </MenuTrigger>
    );
}
