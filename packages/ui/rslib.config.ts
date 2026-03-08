import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

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
    plugins: [
        pluginReact(),
        pluginSvgr({
            svgrOptions: {
                exportType: 'named',
            },
        }),
    ],
    source: {
        entry: {
            index: ['./src/index.ts'],
            icons: ['./src/entries/icons.ts'],
            'assets/images': ['./src/entries/assets-images.ts'],
            'assets/domains': ['./src/entries/assets-domains.ts'],
            'assets/primary-tools': ['./src/entries/assets-primary-tools.ts'],
            assets: ['./src/entries/assets.ts'],
        },
        exclude: [/\.stories\.(ts|tsx)$/, /\.test\.(ts|tsx)$/, /\.md$/],
    },
});
