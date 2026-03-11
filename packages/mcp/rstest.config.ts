import { defineConfig } from '@rstest/core';

export default defineConfig({
    testEnvironment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
});
