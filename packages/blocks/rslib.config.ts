import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    lib: [
        {
            format: 'esm',
            bundle: true,
            dts: {
                distPath: './dist/types',
            },
            output: {
                distPath: {
                    root: './dist/esm',
                },
            },
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
    ],
    output: {
        target: 'web',
    },
    plugins: [pluginReact()],
    tools: {
        rspack: {
            externals: [
                /^react$/,
                /^react-dom$/,
                /^react\/jsx-runtime$/,
                /^@geti-ai\/ui(?:\/.*)?$/,
                /^@react-aria(?:\/.*)?$/,
                /^react-aria-components(?:\/.*)?$/,
            ],
        },
    },
    source: {
        entry: {
            index: ['./src/index.ts'],
        },
        exclude: [/\.stories\.(ts|tsx)$/, /\.test\.(ts|tsx)$/, /\.md$/, /\/example\.tsx$/, '.*reference*'],
    },
});
