const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error ?? ''));

export class SegmentAnythingValidationError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = 'SegmentAnythingValidationError';
    }
}

export class SegmentAnythingOutputError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = 'SegmentAnythingOutputError';
    }
}

export class SessionRunTimeoutError extends Error {
    public waitUntilSafe: Promise<void>;

    public constructor(timeoutMs = 0, settled: Promise<void> = Promise.resolve()) {
        super(`Segment Anything session run timed out after ${timeoutMs}ms`);
        this.name = 'SessionRunTimeoutError';
        this.waitUntilSafe = settled;
    }
}

const BENIGN_ERROR_PATTERN =
    /invalid (?:input|shape|dimension)|shape (?:mismatch|error)|dimension (?:mismatch|error)|opencv|pre-process|post-process|missing output/i;

const CPU_FALLBACK_PATTERN =
    /webgpu|jsep|failed to run .*kernel|device lost|no available backend|initwasm|pthread_create/i;

export const shouldUseCpuFallback = (error: unknown): boolean => CPU_FALLBACK_PATTERN.test(errorMessage(error));

export const isFatalSessionError = (error: unknown): boolean => {
    if (error instanceof SegmentAnythingValidationError || error instanceof SegmentAnythingOutputError) return false;
    if (error instanceof SessionRunTimeoutError) return true;

    const message = errorMessage(error);
    if (BENIGN_ERROR_PATTERN.test(message)) return false;

    // Unknown ORT failures are treated as fatal because the shared runtime may
    // no longer be safe to reuse after a rejected run.
    return true;
};
