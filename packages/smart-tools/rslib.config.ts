import { defineConfig } from '@rslib/core';

const sharedEntry = {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
    types: './src/shared/index.ts',
    ritm: './src/ritm/index.ts',
    'segment-anything': './src/segment-anything/index.ts',
};

export default defineConfig({
    source: {
        assetsInclude: /\.onnx$/,
        exclude: [/\.test\.(ts|tsx)$/, /\/test\//],
    },
    lib: [
        {
            format: 'esm',
            bundle: true,
            source: { entry: sharedEntry },
            output: {
                distPath: {
                    root: './dist/esm',
                },
                externals: [/opencv\.js/],
            },
            dts: false,
        },
        {
            format: 'cjs',
            bundle: true,
            source: { entry: sharedEntry },
            output: {
                distPath: {
                    root: './dist/cjs',
                },
                externals: [/opencv\.js/],
            },
            dts: false,
        },
        {
            format: 'esm',
            bundle: false,
            source: { entry: { index: './src/index.ts' } },
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
    tools: {
        rspack(_, { addRules }) {
            addRules([
                {
                    test: /\.onnx$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/model/[name][ext]',
                        importMode: 'preserve',
                    },
                },
            ]);
        },
    },
});
