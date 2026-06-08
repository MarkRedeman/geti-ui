import { defineConfig } from '@rslint/core';

export default defineConfig([
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        ignores: ['src/test/**', '**/*.test.ts', '**/*.test.tsx'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
        plugins: ['@typescript-eslint'],
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            'one-var': 'off',
            'no-bitwise': 'off',
        },
    },
]);
