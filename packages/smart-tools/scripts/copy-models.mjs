import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

const modelDirs = [
    path.join(packageRoot, 'src/ritm/models'),
    path.join(packageRoot, 'src/segment-anything/models'),
];

const outputDirs = [
    path.join(packageRoot, 'dist/esm'),
    path.join(packageRoot, 'dist/cjs'),
];

for (const outputDir of outputDirs) {
    await mkdir(outputDir, { recursive: true });

    for (const modelDir of modelDirs) {
        const folderName = path.basename(modelDir);
        const parentName = path.basename(path.dirname(modelDir));
        const destination = path.join(outputDir, parentName, folderName);

        await mkdir(path.dirname(destination), { recursive: true });
        await cp(modelDir, destination, {
            recursive: true,
            filter: (source) => source.endsWith('.onnx') || !source.includes('.'),
        });
    }
}
