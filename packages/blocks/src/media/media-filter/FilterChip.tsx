import { Icon } from '@adobe/react-spectrum';
import { ActionButton, Tag } from '@geti-ai/ui';
import { BorderClose } from '@geti-ai/ui/icons';
import type { FilterChipProps } from './types';
import styles from './FilterChip.module.css';

export function FilterChip({ rule, label, onRemove }: FilterChipProps) {
    const removeId = `remove-rule-${rule.id}`;

    return (
        <Tag
            text={label}
            withDot={false}
            className={styles.chips}
            style={{
                height: 'var(--spectrum-global-dimension-size-300)',
                boxSizing: 'border-box',
            }}
            suffix={
                onRemove ? (
                    <ActionButton isQuiet aria-label={removeId} onPress={onRemove}>
                        <Icon size="XS">
                            <BorderClose />
                        </Icon>
                    </ActionButton>
                ) : null
            }
        />
    );
}
