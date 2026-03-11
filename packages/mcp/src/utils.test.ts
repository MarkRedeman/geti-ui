import { errorToString } from './utils';

describe('errorToString', () => {
    test('returns stack trace from Error objects', () => {
        const err = new Error('test error');
        const result = errorToString(err);

        expect(result).toContain('test error');
        expect(result).toContain('Error:');
    });

    test('returns message from Error-like objects without stack', () => {
        const err = { message: 'custom error' };
        const result = errorToString(err);

        expect(result).toBe('custom error');
    });

    test('JSON-stringifies plain objects', () => {
        const result = errorToString({ code: 42 });

        expect(result).toBe('{"code":42}');
    });

    test('converts strings directly', () => {
        expect(errorToString('plain string')).toBe('"plain string"');
    });

    test('converts null and undefined', () => {
        expect(errorToString(null)).toBe('null');
        expect(errorToString(undefined)).toBe('undefined');
    });

    test('converts numbers', () => {
        expect(errorToString(404)).toBe('404');
    });

    test('handles circular references gracefully', () => {
        const obj: Record<string, unknown> = {};
        obj.self = obj;

        // JSON.stringify will throw, so it falls back to String()
        const result = errorToString(obj);
        expect(result).toBe('[object Object]');
    });
});
