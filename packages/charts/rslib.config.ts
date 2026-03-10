import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    lib: [
        {
            format: 'esm',
            bundle: true,
            output: {
                distPath: {
                    root: './dist/esm',
                },
            },
            dts: false,
        },
        {
            format: 'cjs',
            bundle: true,
            output: {
                distPath: {
                    root: './dist/cjs',
                },
            },
            dts: false,
        },
        {
            format: 'esm',
            bundle: false,
            dts: {
                distPath: './dist/types',
            },
            output: {
                distPath: {
                    root: './dist/types',
                },
            },
        },
    ],
    output: {
        target: 'web',
    },
    plugins: [pluginReact()],
    tools: {
        rspack: {
            externals: {
                react: 'react',
                'react-dom': 'react-dom',
                'react/jsx-runtime': 'react/jsx-runtime',
                recharts: 'recharts',
            },
        },
    },
    source: {
        entry: {
            index: ['./src/index.ts'],
            primitives: ['./src/entries/primitives.ts'],
        },
        exclude: [/\.stories\.(ts|tsx)$/, /\.test\.(ts|tsx)$/, /\.md$/],
    },
});
