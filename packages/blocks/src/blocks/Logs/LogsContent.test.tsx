import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { LogsContent } from './LogsContent';

const logs = [
    {
        record: {
            time: { timestamp: 1773405572.175342, repr: '2026-03-13 13:39:32.175342+01:00' },
            level: { name: 'INFO', no: 20, icon: 'ℹ️' },
            module: 'httptools_impl',
            function: 'send',
            line: 483,
            message: 'GET /api/projects/... 200',
        },
    },
    {
        record: {
            time: { timestamp: 1773405573.175342, repr: '2026-03-13 13:39:33.175342+01:00' },
            level: { name: 'ERROR', no: 40, icon: '❌' },
            module: 'worker',
            function: 'run',
            line: 55,
            message: 'Task failed with timeout',
        },
    },
];

describe('LogsContent', () => {
    it('renders logs and filters section', () => {
        render(
            <ThemeProvider>
                <LogsContent logs={logs} />
            </ThemeProvider>
        );

        expect(screen.getByPlaceholderText('Search logs...')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Filter by log level' })).toBeTruthy();
        expect(screen.getByText('GET /api/projects/... 200')).toBeTruthy();
        expect(screen.getByText('Task failed with timeout')).toBeTruthy();
    });
});
