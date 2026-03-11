import { defineConfig } from '@rslib/core';

export default defineConfig({
    lib: [
        {
            format: 'esm',
            bundle: true,
            output: {
                distPath: { root: './dist' },
            },
            dts: false,
            banner: {
                js: '#!/usr/bin/env node',
            },
        },
    ],
    output: {
        target: 'node',
        externals: [/^@modelcontextprotocol\//, /^node:/],
    },
    source: {
        entry: {
            index: './src/index.ts',
        },
    },
});
