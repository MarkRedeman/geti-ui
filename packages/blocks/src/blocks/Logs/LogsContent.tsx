import { useEffect, useMemo, useRef, useState } from 'react';
import { Flex, Text, View, VirtualizedListLayout } from '@geti-ai/ui';
import { LogEntry } from './LogEntry';
import { LogsFilters } from './LogsFilters';
import { DEFAULT_LOG_FILTERS, DEFAULT_LOG_LEVEL_COLORS, type LogEntryData, type LogFilters } from './types';

import styles from './log-viewer.module.css';

export interface LogsContentProps {
    logs: LogEntryData[];
    isLoading?: boolean;
    levelColors?: Record<string, string>;
    availableLevels?: string[];
    showFilters?: boolean;
    emptyStateText?: string;
    loadingText?: string;
}

interface VirtualizedLogItem {
    id: string;
    entry: LogEntryData;
}

const normalize = (value: string): string => value.toUpperCase();

function inferLevels(logs: LogEntryData[]): string[] {
    const levels = new Set<string>();
    logs.forEach((log) => levels.add(normalize(String(log.record.level.name))));
    return Array.from(levels).sort((a, b) => a.localeCompare(b));
}

function filterLogs(logs: LogEntryData[], filters: LogFilters): LogEntryData[] {
    const normalizedQuery = filters.searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
        const level = normalize(String(log.record.level.name));
        if (!filters.levels.has(level)) {
            return false;
        }

        if (filters.startTime !== null && log.record.time.timestamp < filters.startTime) {
            return false;
        }
        if (filters.endTime !== null && log.record.time.timestamp > filters.endTime) {
            return false;
        }

        if (!normalizedQuery) {
            return true;
        }

        const haystack = [
            log.record.message,
            log.record.module ?? '',
            log.record.function ?? '',
            log.record.name ?? '',
            log.text ?? '',
        ]
            .join(' ')
            .toLowerCase();

        return haystack.includes(normalizedQuery);
    });
}

function toClipboardLines(logs: LogEntryData[]): string {
    return logs
        .map((entry) => {
            const ts = new Date(entry.record.time.timestamp * 1000).toISOString();
            const level = normalize(String(entry.record.level.name)).padEnd(8, ' ');
            const source = [entry.record.module, entry.record.function, entry.record.line]
                .filter((v) => v !== undefined && v !== '')
                .join(':');
            return `[${ts}] ${level} ${source} - ${entry.record.message}`;
        })
        .join('\n');
}

export function LogsContent({
    logs,
    isLoading = false,
    levelColors = DEFAULT_LOG_LEVEL_COLORS,
    availableLevels,
    showFilters = true,
    emptyStateText = 'No logs available',
    loadingText = 'Loading logs...',
}: LogsContentProps) {
    const inferredLevels = useMemo(() => availableLevels?.map(normalize) ?? inferLevels(logs), [availableLevels, logs]);

    const [filters, setFilters] = useState<LogFilters>(() => ({
        ...DEFAULT_LOG_FILTERS,
        levels: new Set(inferredLevels.length > 0 ? inferredLevels : DEFAULT_LOG_FILTERS.levels),
    }));
    const [autoScroll, setAutoScroll] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setFilters((current) => {
            const next = new Set(Array.from(current.levels).filter((lvl) => inferredLevels.includes(lvl)));
            if (next.size === 0) {
                inferredLevels.forEach((level) => next.add(level));
            }
            return { ...current, levels: next };
        });
    }, [inferredLevels]);

    const filtered = useMemo(() => filterLogs(logs, filters), [logs, filters]);

    const virtualizedLogs = useMemo<VirtualizedLogItem[]>(
        () =>
            filtered.map((entry, index) => ({
                id: `${entry.record.time.timestamp}-${entry.record.module ?? 'm'}-${entry.record.function ?? 'f'}-${
                    entry.record.line ?? 'l'
                }-${index}`,
                entry,
            })),
        [filtered]
    );

    useEffect(() => {
        if (!autoScroll || !containerRef.current) {
            return;
        }

        const listBox = containerRef.current.querySelector('[role="listbox"]') as HTMLDivElement | null;
        if (listBox) {
            listBox.scrollTop = listBox.scrollHeight;
        }
    }, [autoScroll, virtualizedLogs.length]);

    const copyLogs = async () => {
        if (!navigator?.clipboard || filtered.length === 0) {
            return;
        }
        await navigator.clipboard.writeText(toClipboardLines(filtered));
    };

    return (
        <View UNSAFE_className={styles.logViewer}>
            {showFilters ? (
                <LogsFilters
                    allLevels={inferredLevels}
                    filters={filters}
                    onFiltersChange={setFilters}
                    autoScroll={autoScroll}
                    onAutoScrollChange={setAutoScroll}
                    totalCount={logs.length}
                    filteredCount={filtered.length}
                    onCopy={copyLogs}
                />
            ) : null}

            <div className={styles.logsContainer} ref={containerRef}>
                {filtered.length === 0 ? (
                    <Flex alignItems="center" justifyContent="center" UNSAFE_style={{ height: '100%', minHeight: 180 }}>
                        <Text>
                            {isLoading
                                ? loadingText
                                : logs.length === 0
                                  ? emptyStateText
                                  : 'No logs match the current filters'}
                        </Text>
                    </Flex>
                ) : (
                    <View UNSAFE_className={styles.logsInner}>
                        <VirtualizedListLayout
                            items={virtualizedLogs}
                            ariaLabel="Log entries"
                            layoutOptions={{ estimatedRowHeight: 36 }}
                            containerHeight="100%"
                            idFormatter={(item: VirtualizedLogItem) => item.id}
                            textValueFormatter={(item: VirtualizedLogItem) => item.entry.record.message}
                            renderItem={(item: VirtualizedLogItem) => (
                                <LogEntry entry={item.entry} levelColors={levelColors} />
                            )}
                        />
                    </View>
                )}
            </div>
        </View>
    );
}
