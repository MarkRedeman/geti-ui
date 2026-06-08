import { defineConfig } from '@rslint/core';

export default defineConfig([
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['src/test/**', '**/*.stories.tsx'],
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
