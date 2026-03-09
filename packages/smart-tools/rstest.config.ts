import { defineConfig } from '@rstest/core';

export default defineConfig({
    testEnvironment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.test.ts'],
} as Parameters<typeof defineConfig>[0]);
