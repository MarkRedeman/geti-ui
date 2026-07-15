export class SessionRunTimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`ortSession.run() did not complete within ${timeoutMs}ms`);
        this.name = 'SessionRunTimeoutError';
    }
}

export class SessionPoisonedError extends Error {
    constructor() {
        super('Session is not usable (poisoned or reset). Call Session.reset() to recreate it.');
        this.name = 'SessionPoisonedError';
    }
}
