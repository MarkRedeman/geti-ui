import { useMemo, useState } from 'react';
import { ActionButton, Checkbox, Flex, Icon, SearchField, Text, Tooltip, TooltipTrigger, View } from '@geti-ai/ui';
import { Copy } from '@geti-ai/ui/icons';
import { LogLevelDropdown } from './LogLevelDropdown';
import styles from './LogsFilters.module.css';
import type { LogFilters } from './types';

export interface LogsFiltersProps {
    filters: LogFilters;
    onFiltersChange: (filters: LogFilters) => void;
    allLevels?: string[];
    autoScroll: boolean;
    onAutoScrollChange: (value: boolean) => void;
    totalCount: number;
    filteredCount: number;
    onCopy: () => Promise<void>;
}

export function LogsFilters({
    filters,
    onFiltersChange,
    allLevels,
    autoScroll,
    onAutoScrollChange,
    totalCount,
    filteredCount,
    onCopy,
}: LogsFiltersProps) {
    const normalizedLevels = useMemo(
        () => (allLevels ?? Array.from(filters.levels)).map((level) => String(level).toUpperCase()),
        [allLevels, filters.levels]
    );
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const toggleLevel = (level: string, checked: boolean) => {
        const next = new Set(filters.levels);
        if (checked) {
            next.add(level);
        } else {
            next.delete(level);
        }
        onFiltersChange({ ...filters, levels: next });
    };

    const selectAll = () => onFiltersChange({ ...filters, levels: new Set(normalizedLevels) });
    const clearAll = () => onFiltersChange({ ...filters, levels: new Set() });

    const handleSearchChange = (value: string) => onFiltersChange({ ...filters, searchQuery: value });
    const handleClearSearch = () => onFiltersChange({ ...filters, searchQuery: '' });

    const handleCopyLogs = async () => {
        if (filteredCount === 0) {
            return;
        }

        try {
            await onCopy();
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to copy logs:', error);
        }
    };

    return (
        <View UNSAFE_className={styles.filtersContainer}>
            <Flex direction="row" alignItems="center" gap="size-100" wrap="wrap">
                <View UNSAFE_className={styles.searchContainer}>
                    <SearchField
                        aria-label="Search logs"
                        placeholder="Search logs..."
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                        onClear={handleClearSearch}
                        width="100%"
                    />
                </View>

                <LogLevelDropdown
                    levels={normalizedLevels}
                    selectedLevels={filters.levels}
                    onLevelChange={toggleLevel}
                    onSelectAll={selectAll}
                    onClearAll={clearAll}
                />

                <Checkbox isSelected={autoScroll} onChange={onAutoScrollChange} UNSAFE_className={styles.autoScroll}>
                    Auto-scroll
                </Checkbox>

                <TooltipTrigger delay={250}>
                    <ActionButton
                        aria-label="Copy logs to clipboard"
                        onPress={handleCopyLogs}
                        isDisabled={filteredCount === 0}
                    >
                        <Icon marginStart="size-150" marginEnd="size-50">
                            <Copy />
                        </Icon>
                        <Text>{copyStatus === 'copied' ? 'Copied!' : 'Copy'}</Text>
                    </ActionButton>
                    <Tooltip>Copy {filteredCount} logs to clipboard</Tooltip>
                </TooltipTrigger>

                <Text UNSAFE_className={styles.statsText}>
                    {filteredCount} / {totalCount}
                </Text>
            </Flex>
        </View>
    );
}
