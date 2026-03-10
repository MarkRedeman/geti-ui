import { defineConfig } from '@rstest/core';

export default defineConfig({
    testEnvironment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    tools: {
        swc: {
            jsc: {
                transform: {
                    react: {
                        runtime: 'automatic',
                    },
                },
            },
        },
        rspack: {
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: 'null-loader',
                    },
                ],
            },
        },
    },
} as Parameters<typeof defineConfig>[0]);
