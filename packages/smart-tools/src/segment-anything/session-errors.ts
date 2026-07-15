export class SessionRunTimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`ortSession.run() did not complete within ${timeoutMs}ms`);
        this.name = 'SessionRunTimeoutError';
    }
}

export class SessionPoisonedError extends Error {
    constructor() {
        super('Session is poisoned after a previous unrecoverable failure. Call Session.reset() to revive it.');
        this.name = 'SessionPoisonedError';
    }
}
