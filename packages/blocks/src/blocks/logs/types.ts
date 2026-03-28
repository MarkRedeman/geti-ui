export type LogLevelName = 'TRACE' | 'DEBUG' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'CRITICAL';

export const LOG_LEVELS: LogLevelName[] = ['TRACE', 'DEBUG', 'INFO', 'SUCCESS', 'WARNING', 'ERROR', 'CRITICAL'];

export interface LogLevel {
    name: LogLevelName | string;
    no?: number;
    icon?: string;
}

export interface LogTime {
    repr?: string;
    timestamp: number;
}

export interface LogRecord {
    elapsed?: { repr: string; seconds: number };
    exception?: unknown;
    extra?: Record<string, unknown>;
    file?: LogFile;
    time: LogTime;
    level: LogLevel;
    module?: string;
    function?: string;
    line?: number;
    message: string;
    name?: string;
    process?: LogProcess;
    thread?: LogThread;
}

export interface LogProcess {
    id: number;
    name: string;
}

export interface LogThread {
    id: number;
    name: string;
}

export interface LogFile {
    name: string;
    path: string;
}

export interface LogSource {
    id: string;
    name: string;
    type: 'application' | 'worker' | 'job';
    created_at?: string | null;
}

export interface LogEntryData {
    text?: string;
    record: LogRecord;
}

export interface LogEntry {
    text: string;
    record: LogRecord;
}

export interface LogFilters {
    levels: Set<string>;
    searchQuery: string;
    startTime: number | null;
    endTime: number | null;
}

export type LogsFiltersState = LogFilters;

export const DEFAULT_LOG_FILTERS: LogFilters = {
    levels: new Set(LOG_LEVELS),
    searchQuery: '',
    startTime: null,
    endTime: null,
};

export const DEFAULT_LOG_LEVEL_COLORS: Record<string, string> = {
    TRACE: 'var(--spectrum-global-color-gray-600)',
    DEBUG: 'var(--spectrum-global-color-gray-600)',
    INFO: '#ffffff',
    SUCCESS: '#4ade80',
    WARNING: 'var(--spectrum-global-color-orange-600)',
    ERROR: 'var(--spectrum-global-color-red-600)',
    CRITICAL: 'var(--spectrum-global-color-magenta-600)',
};
