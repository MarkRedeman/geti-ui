import { ActionButton, Dialog, DialogTrigger, Text, View } from '@geti-ai/ui';
import { Filter } from '@geti-ai/ui/icons';
import { DEFAULT_LOG_LEVEL_COLORS } from './types';
import { Icon } from '@adobe/react-spectrum';

import styles from './log-viewer.module.css';

type LogLevelName = string;

const getLevelColor = (level: string) => DEFAULT_LOG_LEVEL_COLORS[level] ?? 'var(--spectrum-global-color-gray-600)';

const LevelCheckboxItem = ({
    level,
    isSelected,
    onChange,
}: {
    level: LogLevelName;
    isSelected: boolean;
    onChange: (level: LogLevelName, selected: boolean) => void;
}) => {
    const color = getLevelColor(level);

    return (
        <label className={styles.levelMenuItem}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onChange(level, e.target.checked)}
                className={styles.levelMenuCheckbox}
            />
            <span className={styles.levelMenuDot} style={{ backgroundColor: color }} />
            <span className={styles.levelMenuLabel}>{level}</span>
        </label>
    );
};

export interface LogLevelDropdownProps {
    levels: string[];
    selectedLevels: Set<string>;
    onLevelChange: (level: string, selected: boolean) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

export function LogLevelDropdown({
    levels,
    selectedLevels,
    onLevelChange,
    onSelectAll,
    onClearAll,
}: LogLevelDropdownProps) {
    const selectedCount = selectedLevels.size;
    const totalCount = levels.length;
    const allSelected = selectedCount === totalCount;
    const noneSelected = selectedCount === 0;

    return (
        <DialogTrigger type="popover">
            <ActionButton aria-label="Filter by log level">
                <Icon marginStart="size-100">
                    <Filter />
                </Icon>
                <Text>
                    Levels{' '}
                    <span className={styles.levelBadgeCount}>
                        {selectedCount}/{totalCount}
                    </span>
                </Text>
            </ActionButton>

            <Dialog width="auto" UNSAFE_className={styles.levelDropdownDialog} UNSAFE_style={{ padding: 0 }}>
                <View UNSAFE_className={styles.levelPopoverContent}>
                    {levels.map((level) => (
                        <LevelCheckboxItem
                            key={level}
                            level={level as LogLevelName}
                            isSelected={selectedLevels.has(level)}
                            onChange={onLevelChange}
                        />
                    ))}

                    <div className={styles.levelPopoverActions}>
                        <button
                            type="button"
                            onClick={onSelectAll}
                            disabled={allSelected}
                            className={styles.levelQuickButton}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={onClearAll}
                            disabled={noneSelected}
                            className={styles.levelQuickButton}
                        >
                            None
                        </button>
                    </div>
                </View>
            </Dialog>
        </DialogTrigger>
    );
}
