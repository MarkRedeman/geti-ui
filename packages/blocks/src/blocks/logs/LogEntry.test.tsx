import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { LogEntry } from './LogEntry';

const makeEntry = (message: string, level = 'INFO') => ({
    record: {
        time: { timestamp: 1773405572.175342, repr: '2026-03-13 13:39:32.175342+01:00' },
        level: { name: level, no: 20, icon: 'ℹ️' },
        module: 'worker',
        function: 'run',
        line: 55,
        message,
        name: 'fallback.source',
    },
});

describe('LogEntry', () => {
    it('renders level and message', () => {
        render(
            <ThemeProvider>
                <LogEntry entry={makeEntry('Task failed with timeout')} />
            </ThemeProvider>
        );

        expect(screen.getByText('INFO')).toBeTruthy();
        expect(screen.getByText('Task failed with timeout')).toBeTruthy();
    });

    it('renders preformatted block for multiline message', () => {
        render(
            <ThemeProvider>
                <LogEntry entry={makeEntry('line 1\nline 2')} />
            </ThemeProvider>
        );

        expect(document.querySelector('pre')).toBeTruthy();
    });

    it('renders source as module:function', () => {
        render(
            <ThemeProvider>
                <LogEntry entry={makeEntry('hello')} />
            </ThemeProvider>
        );

        expect(screen.getByText('worker:run')).toBeTruthy();
    });
});
