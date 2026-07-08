import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

const modelDirs = [path.join(packageRoot, 'src/ritm/models'), path.join(packageRoot, 'src/segment-anything/models')];

const outputDirs = [path.join(packageRoot, 'dist/esm'), path.join(packageRoot, 'dist/cjs')];

for (const outputDir of outputDirs) {
    await mkdir(outputDir, { recursive: true });

    for (const modelDir of modelDirs) {
        // Flatten: copy each model dir's contents directly into outputDir so the
        // .onnx files land beside the bundled chunk (dist/esm/segment-anything.js,
        // dist/esm/ritm.js), matching `new URL('./x.onnx', import.meta.url)`.
        await cp(modelDir, outputDir, {
            recursive: true,
            filter: (source) => source.endsWith('.onnx') || !path.basename(source).includes('.'),
        });
    }
}
