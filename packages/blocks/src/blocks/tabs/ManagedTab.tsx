import { useEffect, useState, type Key, type ReactNode } from 'react';
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

    useEffect(() => {
        if (!isSelected) {
            setIsOpen(false);
        }
    }, [isSelected]);

    const openMenuIfSelected = () => {
        if (!isSelected || actions.length === 0) {
            return;
        }

        setIsOpen(true);
    };

    const content = (
        <span className={styles.managedTab}>
            <Text>{label}</Text>

            {isSelected && actions.length > 0 ? (
                <Icon size="S">
                    <MoreMenu className={styles.moreMenuIcon} />
                </Icon>
            ) : (
                <span className={styles.actionSpacer} aria-hidden="true" />
            )}

            {trailingContent}
        </span>
    );

    if (!isSelected || actions.length === 0) {
        return content;
    }

    return (
        <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <PressableElement UNSAFE_className={styles.trigger} onPress={openMenuIfSelected}>
                {content}
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
