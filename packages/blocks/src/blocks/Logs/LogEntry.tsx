import { Text, Tooltip, TooltipTrigger, View, Flex } from '@geti-ai/ui';
import { DEFAULT_LOG_LEVEL_COLORS, type LogEntryData } from './types';
import styles from './log-viewer.module.css';

export interface LogEntryProps {
    entry: LogEntryData;
    levelColors?: Record<string, string>;
}

function formatAbsoluteTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

function formatRelativeTime(timestamp: number): string {
    const now = Date.now() / 1000;
    const diff = Math.max(0, now - timestamp);
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const hasStructuredContent = (value: string): boolean => {
    return value.includes('\n') || /[┏┓┗┛┃━┣┫┳┻╋│─├┤┬┴┼]/.test(value);
};

const LogLevelText = ({ level, color }: { level: string; color: string }) => {
    return (
        <Text UNSAFE_className={styles.levelTextOnly} UNSAFE_style={{ color }}>
            {level}
        </Text>
    );
};

const LogTimestamp = ({ timestamp, repr }: { timestamp: number; repr?: string }) => {
    const absoluteTime = formatAbsoluteTime(timestamp);
    const relativeTime = formatRelativeTime(timestamp);

    return (
        <TooltipTrigger delay={300}>
            <View UNSAFE_className={styles.timestamp}>
                <Text UNSAFE_className={styles.timestampText}>{absoluteTime}</Text>
            </View>
            <Tooltip>
                <Text>{repr ?? absoluteTime}</Text>
                <Text UNSAFE_style={{ display: 'block', opacity: 0.7 }}>{relativeTime}</Text>
            </Tooltip>
        </TooltipTrigger>
    );
};

const LogSource = ({ moduleName, func, line, fallback }: { moduleName?: string; func?: string; line?: number; fallback?: string }) => {
    const sourceShort = [moduleName, func].filter(Boolean).join(':') || fallback || 'unknown';
    const sourceLong = [moduleName, func, line].filter((v) => v !== undefined && v !== '').join(':');

    return (
        <TooltipTrigger delay={300}>
            <View UNSAFE_className={styles.source}>
                <Text UNSAFE_className={styles.sourceText}>{sourceShort}</Text>
            </View>
            <Tooltip>
                <Text>{sourceLong || sourceShort}</Text>
            </Tooltip>
        </TooltipTrigger>
    );
};

const LogMessage = ({ message, color }: { message: string; color: string }) => {
    if (hasStructuredContent(message)) {
        return (
            <View UNSAFE_className={styles.messagePreformatted}>
                <pre className={styles.messagePre} style={{ color }}>
                    {message}
                </pre>
            </View>
        );
    }

    return (
        <View UNSAFE_className={styles.message}>
            <Text UNSAFE_className={styles.messageText} UNSAFE_style={{ color }}>
                {message}
            </Text>
        </View>
    );
};

export function LogEntry({ entry, levelColors = DEFAULT_LOG_LEVEL_COLORS }: LogEntryProps) {
    const { record } = entry;
    const level = String(record.level.name).toUpperCase();
    const color = levelColors[level] ?? levelColors.INFO ?? 'var(--spectrum-global-color-gray-800)';

    return (
        <Flex UNSAFE_className={styles.logEntry} gap="size-75" alignItems="start">
            <LogTimestamp timestamp={record.time.timestamp} repr={record.time.repr} />
            <LogLevelText level={level} color={color} />
            <LogSource moduleName={record.module} func={record.function} line={record.line} fallback={record.name} />
            <LogMessage message={record.message} color={color} />
        </Flex>
    );
}
