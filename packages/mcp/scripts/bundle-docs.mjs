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

/**
 * Recursively copy all .md files from src to dest, preserving directory structure.
 */
function copyMarkdownFiles(srcDir, destDir, rootSrc) {
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      copyMarkdownFiles(srcPath, destDir, rootSrc);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relPath = path.relative(rootSrc, srcPath);
      const destPath = path.join(destDir, relPath);
      copyFile(srcPath, destPath);
    }
  }
}

// --- Main ---

if (!fs.existsSync(docBuild)) {
  console.warn(
    `Warning: ${docBuild} does not exist. Run "npm run docs:build" first to generate documentation.`,
  );
  console.warn('Skipping doc bundling — the MCP server will not have bundled data.');
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
copyMarkdownFiles(docBuild, outDir, docBuild);
const mdFiles = countMdFiles(outDir);
fileCount += mdFiles;
console.log(`  copied ${mdFiles} markdown files`);

console.log(`bundle-docs: ${fileCount} files → dist/data/`);

function countMdFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countMdFiles(path.join(dir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      count++;
    }
  }
  return count;
}
