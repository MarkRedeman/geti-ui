import { defineConfig } from '@rstest/core';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

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
            resolve: {
                alias: {
                    react: require.resolve('react'),
                    'react-dom': require.resolve('react-dom'),
                    'react-dom/client': require.resolve('react-dom/client'),
                    'react-dom/test-utils': require.resolve('react-dom/test-utils'),
                    'react/jsx-runtime': require.resolve('react/jsx-runtime'),
                    'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
                },
            },
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
