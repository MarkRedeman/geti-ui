/**
 * bundle-docs.mjs
 *
 * Pre-build script that copies documentation output from `documentation/doc_build/`
 * into `dist/data/` so the published npm package ships with all docs bundled.
 *
 * Copies:
 * - llms.txt → dist/data/llms.txt
 * - llms-full.txt → dist/data/llms-full.txt
 * - **\/*.md → dist/data/**\/*.md (preserving directory structure)
 * - .well-known/skills/* → dist/data/.well-known/skills/* (preserving structure)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(packageRoot, '..', '..');
const docBuild = path.resolve(repoRoot, 'documentation', 'doc_build');
const outDir = path.resolve(packageRoot, 'dist', 'data');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyFile(src, dest) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

function copyFilesByPredicate(srcDir, destDir, rootSrc, shouldCopy) {
    if (!fs.existsSync(srcDir)) return;

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        if (entry.isDirectory()) {
            copyFilesByPredicate(srcPath, destDir, rootSrc, shouldCopy);
        } else if (entry.isFile() && shouldCopy(srcPath)) {
            const relPath = path.relative(rootSrc, srcPath);
            const destPath = path.join(destDir, relPath);
            copyFile(srcPath, destPath);
        }
    }
}

function copyDirectory(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return 0;

    let copied = 0;
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copied += copyDirectory(srcPath, destPath);
        } else if (entry.isFile()) {
            copyFile(srcPath, destPath);
            copied += 1;
        }
    }

    return copied;
}

// --- Main ---

if (!fs.existsSync(docBuild)) {
    if (process.env.CI) {
        console.error(`Error: ${docBuild} does not exist. Run "npm run docs:build" first to generate documentation.`);
        process.exit(1);
    }

    console.warn(`Warning: ${docBuild} does not exist. Run "npm run docs:build" first to generate documentation.`);
    console.warn('Skipping doc bundling - the MCP server will not have bundled data.');
    process.exit(0);
}

ensureDir(outDir);

let fileCount = 0;

// Copy llms.txt
const llmsTxt = path.join(docBuild, 'llms.txt');
if (fs.existsSync(llmsTxt)) {
    copyFile(llmsTxt, path.join(outDir, 'llms.txt'));
    fileCount++;
    console.log('  copied llms.txt');
}

// Copy llms-full.txt
const llmsFullTxt = path.join(docBuild, 'llms-full.txt');
if (fs.existsSync(llmsFullTxt)) {
    copyFile(llmsFullTxt, path.join(outDir, 'llms-full.txt'));
    fileCount++;
    console.log('  copied llms-full.txt');
}

// Copy all .md files preserving directory structure
copyFilesByPredicate(docBuild, outDir, docBuild, (srcPath) => srcPath.endsWith('.md'));
const mdFiles = countFilesByPredicate(docBuild, (srcPath) => srcPath.endsWith('.md'));
fileCount += mdFiles;
console.log(`  copied ${mdFiles} markdown files`);

// Copy generated skills endpoint artifacts when available
const skillsSrcDir = path.join(docBuild, '.well-known', 'skills');
const skillsOutDir = path.join(outDir, '.well-known', 'skills');
const skillsFiles = copyDirectory(skillsSrcDir, skillsOutDir);
if (skillsFiles > 0) {
    fileCount += skillsFiles;
    console.log(`  copied ${skillsFiles} skills endpoint files`);
} else {
    console.log('  no skills endpoint files found');
}

console.log(`bundle-docs: ${fileCount} files → dist/data/`);

function countFilesByPredicate(dir, shouldCount) {
    let count = 0;
    if (!fs.existsSync(dir)) return 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            count += countFilesByPredicate(path.join(dir, entry.name), shouldCount);
        } else if (entry.isFile() && shouldCount(path.join(dir, entry.name))) {
            count++;
        }
    }
    return count;
}
