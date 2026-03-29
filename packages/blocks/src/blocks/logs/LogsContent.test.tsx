import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { LogsContent } from './LogsContent';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const infoLog = {
    record: {
        time: { timestamp: 1773405572.175342, repr: '2026-03-13 13:39:32.175342+01:00' },
        level: { name: 'INFO', no: 20, icon: 'ℹ️' },
        module: 'httptools_impl',
        function: 'send',
        line: 483,
        message: 'GET /api/projects/... 200',
    },
};

const errorLog = {
    record: {
        time: { timestamp: 1773405573.175342, repr: '2026-03-13 13:39:33.175342+01:00' },
        level: { name: 'ERROR', no: 40, icon: '❌' },
        module: 'worker',
        function: 'run',
        line: 55,
        message: 'Task failed with timeout',
    },
};

const debugLog = {
    record: {
        time: { timestamp: 1773405574.0, repr: '2026-03-13 13:39:34.000000+01:00' },
        level: { name: 'DEBUG', no: 10, icon: '🐛' },
        module: 'scheduler',
        function: 'dispatch',
        line: 120,
        message: 'Dispatching job payload',
        name: 'AppLogger',
    },
    text: 'raw debug text',
};

const logs = [infoLog, errorLog];

// ---------------------------------------------------------------------------
// Clipboard mock helpers
// ---------------------------------------------------------------------------

let clipboardMock: { writeText: ReturnType<typeof rstest.fn> };

function mockClipboard() {
    clipboardMock = { writeText: rstest.fn().mockResolvedValue(undefined) };
    Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: clipboardMock,
    });
}

function restoreClipboard() {
    Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: undefined,
    });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderLogs(props: Partial<React.ComponentProps<typeof LogsContent>> = {}) {
    return render(
        <ThemeProvider>
            <LogsContent logs={logs} {...props} />
        </ThemeProvider>
    );
}

// ---------------------------------------------------------------------------
// 1. Renders logs and filters section (baseline)
// ---------------------------------------------------------------------------

describe('LogsContent', () => {
    it('renders logs and filters section', () => {
        renderLogs();

        expect(screen.getByPlaceholderText('Search logs...')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Filter by log level' })).toBeTruthy();
        expect(screen.getByText('GET /api/projects/... 200')).toBeTruthy();
        expect(screen.getByText('Task failed with timeout')).toBeTruthy();
    });

    // -----------------------------------------------------------------------
    // 2. Search filtering — case-insensitive, covers message/module/function/text
    // -----------------------------------------------------------------------

    describe('search filtering', () => {
        it('filters by message text (case-insensitive)', async () => {
            renderLogs();

            const search = screen.getByRole('searchbox', { name: /search logs/i });
            await userEvent.type(search, 'TASK FAILED');

            await waitFor(() => {
                expect(screen.queryByText('GET /api/projects/... 200')).toBeNull();
                expect(screen.getByText('Task failed with timeout')).toBeTruthy();
            });
        });

        it('filters by module name', async () => {
            renderLogs();

            const search = screen.getByRole('searchbox', { name: /search logs/i });
            await userEvent.type(search, 'HTTPTOOLS');

            await waitFor(() => {
                expect(screen.getByText('GET /api/projects/... 200')).toBeTruthy();
                expect(screen.queryByText('Task failed with timeout')).toBeNull();
            });
        });

        it('filters by function name', async () => {
            renderLogs();

            const search = screen.getByRole('searchbox', { name: /search logs/i });
            await userEvent.type(search, 'RUN');

            await waitFor(() => {
                expect(screen.queryByText('GET /api/projects/... 200')).toBeNull();
                expect(screen.getByText('Task failed with timeout')).toBeTruthy();
            });
        });

        it('filters by log text field', async () => {
            renderLogs({ logs: [infoLog, debugLog] });

            const search = screen.getByRole('searchbox', { name: /search logs/i });
            await userEvent.type(search, 'raw debug');

            await waitFor(() => {
                expect(screen.queryByText('GET /api/projects/... 200')).toBeNull();
                expect(screen.getByText('Dispatching job payload')).toBeTruthy();
            });
        });

        it('shows all logs when search is cleared', async () => {
            renderLogs();

            const search = screen.getByRole('searchbox', { name: /search logs/i });
            await userEvent.type(search, 'timeout');

            await waitFor(() => expect(screen.queryByText('GET /api/projects/... 200')).toBeNull());

            await userEvent.clear(search);

            await waitFor(() => {
                expect(screen.getByText('GET /api/projects/... 200')).toBeTruthy();
                expect(screen.getByText('Task failed with timeout')).toBeTruthy();
            });
        });
    });

    // -----------------------------------------------------------------------
    // 3. Level filtering through filter UI interactions
    // -----------------------------------------------------------------------

    describe('level filtering', () => {
        it('deselecting a level hides its log entries', async () => {
            renderLogs();

            // Open the filter popover
            await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));

            // Uncheck INFO
            const infoCheckbox = await screen.findByRole('checkbox', { name: 'INFO' });
            await userEvent.click(infoCheckbox);

            await waitFor(() => {
                expect(screen.queryByText('GET /api/projects/... 200')).toBeNull();
                expect(screen.getByText('Task failed with timeout')).toBeTruthy();
            });
        });

        it('deselecting all levels shows no-match state', async () => {
            renderLogs();

            await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));

            // Click "None" to deselect all
            await userEvent.click(await screen.findByRole('button', { name: 'None' }));

            await waitFor(() => {
                expect(screen.getByText('No logs match the current filters')).toBeTruthy();
            });
        });

        it('re-selecting a level restores its entries', async () => {
            renderLogs();

            await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));

            // Uncheck ERROR
            const errorCheckbox = await screen.findByRole('checkbox', { name: 'ERROR' });
            await userEvent.click(errorCheckbox);

            await waitFor(() => expect(screen.queryByText('Task failed with timeout')).toBeNull());

            // Re-check ERROR
            await userEvent.click(errorCheckbox);

            await waitFor(() => {
                expect(screen.getByText('Task failed with timeout')).toBeTruthy();
            });
        });
    });

    // -----------------------------------------------------------------------
    // 4. Empty state when logs=[] and not loading
    // -----------------------------------------------------------------------

    describe('empty state', () => {
        it('shows default empty state text when logs is empty and not loading', () => {
            renderLogs({ logs: [] });

            expect(screen.getByText('No logs available')).toBeTruthy();
        });

        it('shows custom emptyStateText when provided', () => {
            renderLogs({ logs: [], emptyStateText: 'Nothing to see here' });

            expect(screen.getByText('Nothing to see here')).toBeTruthy();
        });
    });

    // -----------------------------------------------------------------------
    // 5. Loading text when isLoading=true and logs=[]
    // -----------------------------------------------------------------------

    describe('loading state', () => {
        it('shows loading text when isLoading is true and logs is empty', () => {
            renderLogs({ logs: [], isLoading: true });

            expect(screen.getByText('Loading logs...')).toBeTruthy();
        });

        it('shows custom loadingText when provided', () => {
            renderLogs({ logs: [], isLoading: true, loadingText: 'Fetching data...' });

            expect(screen.getByText('Fetching data...')).toBeTruthy();
        });

        it('does not show empty-state text when isLoading is true', () => {
            renderLogs({ logs: [], isLoading: true });

            expect(screen.queryByText('No logs available')).toBeNull();
        });
    });

    // -----------------------------------------------------------------------
    // 6. No-match state when filters exclude all logs
    // -----------------------------------------------------------------------

    describe('no-match state', () => {
        it('shows no-match message when availableLevels excludes all present levels', () => {
            // availableLevels forces filter to TRACE only, but no log has TRACE
            renderLogs({ availableLevels: ['TRACE'] });

            expect(screen.getByText('No logs match the current filters')).toBeTruthy();
        });

        it('does not show empty-state or loading text for no-match condition', () => {
            renderLogs({ availableLevels: ['TRACE'] });

            expect(screen.queryByText('No logs available')).toBeNull();
            expect(screen.queryByText('Loading logs...')).toBeNull();
        });
    });

    // -----------------------------------------------------------------------
    // 7. showFilters=false hides filter UI
    // -----------------------------------------------------------------------

    describe('showFilters prop', () => {
        it('hides search field and filter button when showFilters is false', () => {
            renderLogs({ showFilters: false });

            expect(screen.queryByPlaceholderText('Search logs...')).toBeNull();
            expect(screen.queryByRole('button', { name: 'Filter by log level' })).toBeNull();
        });

        it('still renders log entries when showFilters is false', () => {
            renderLogs({ showFilters: false });

            expect(screen.getByText('GET /api/projects/... 200')).toBeTruthy();
            expect(screen.getByText('Task failed with timeout')).toBeTruthy();
        });
    });

    // -----------------------------------------------------------------------
    // 8. Copy path — navigator.clipboard.writeText called with correct format
    // -----------------------------------------------------------------------

    describe('copy to clipboard', () => {
        beforeEach(() => mockClipboard());
        afterEach(() => restoreClipboard());

        it('calls navigator.clipboard.writeText when copy button is pressed', async () => {
            renderLogs();

            await userEvent.click(screen.getByRole('button', { name: /copy logs to clipboard/i }));

            await waitFor(() => {
                expect(clipboardMock.writeText).toHaveBeenCalledOnce();
            });
        });

        it('clipboard text contains ISO timestamp, level, source, and message', async () => {
            renderLogs({ logs: [infoLog] });

            await userEvent.click(screen.getByRole('button', { name: /copy logs to clipboard/i }));

            await waitFor(() => {
                const [text] = clipboardMock.writeText.mock.calls[0] as [string];

                // ISO timestamp from the log's epoch
                const expectedTs = new Date(infoLog.record.time.timestamp * 1000).toISOString();
                expect(text).toContain(expectedTs);

                // Level name padded
                expect(text).toContain('INFO');

                // source: module:function:line
                expect(text).toContain('httptools_impl:send:483');

                // message
                expect(text).toContain('GET /api/projects/... 200');
            });
        });

        it('clipboard text has one line per log entry', async () => {
            renderLogs({ logs: [infoLog, errorLog] });

            await userEvent.click(screen.getByRole('button', { name: /copy logs to clipboard/i }));

            await waitFor(() => {
                const [text] = clipboardMock.writeText.mock.calls[0] as [string];
                const lines = text.split('\n');
                expect(lines).toHaveLength(2);
            });
        });

        it('copy button is disabled (and clipboard is not called) when no logs are visible', async () => {
            // Use availableLevels to produce zero filtered results
            renderLogs({ availableLevels: ['TRACE'] });

            const copyButton = screen.getByRole('button', { name: /copy logs to clipboard/i });
            expect(copyButton.hasAttribute('disabled')).toBe(true);

            await userEvent.click(copyButton);
            expect(clipboardMock.writeText).not.toHaveBeenCalled();
        });

        it('only copies currently-filtered logs (not all logs)', async () => {
            renderLogs();

            // Open filter popover and deselect INFO
            await userEvent.click(screen.getByRole('button', { name: /filter by log level/i }));
            await userEvent.click(await screen.findByRole('checkbox', { name: 'INFO' }));

            await waitFor(() => expect(screen.queryByText('GET /api/projects/... 200')).toBeNull());

            // Close the popover so the copy button is no longer hidden behind aria-hidden
            await userEvent.keyboard('{Escape}');

            await waitFor(() => expect(screen.getByRole('button', { name: /copy logs to clipboard/i })).toBeTruthy());

            await userEvent.click(screen.getByRole('button', { name: /copy logs to clipboard/i }));

            await waitFor(() => {
                const [text] = clipboardMock.writeText.mock.calls[0] as [string];
                expect(text).not.toContain('GET /api/projects');
                expect(text).toContain('Task failed with timeout');
            });
        });
    });
});
