export class SessionRunTimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`ortSession.run() did not complete within ${timeoutMs}ms`);
        this.name = 'SessionRunTimeoutError';
    }
}

export class SessionPoisonedError extends Error {
    /**
     * `cause` carries the failure that poisoned the session. Queued calls are
     * rejected with this error instead of the original one, so recovery logic
     * must walk the cause chain to see *why* the session died (e.g. a WebGPU
     * stall) rather than only seeing "poisoned".
     */
    constructor(options?: { cause?: unknown }) {
        super('Session is not usable (poisoned or reset). Call Session.reset() to recreate it.', options);
        this.name = 'SessionPoisonedError';
    }
}
