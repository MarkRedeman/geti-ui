import fs from 'node:fs/promises';
import path from 'node:path';
import type { ContentSource } from './types.js';
import { fetchText, resolveContentSource, resolveDataDir } from './utils.js';

/** Resolved content source, determined once at first read. */
let source: ContentSource | undefined;

/** Resolved base directory for bundled or local sources. */
let baseDir: string | undefined;

function getSource(): ContentSource {
  if (!source) {
    source = resolveContentSource();
  }
  return source;
}

function getBaseDir(): string {
  if (!baseDir) {
    const s = getSource();
    if (s.type === 'local') {
      baseDir = s.dir;
    } else if (s.type === 'bundled') {
      baseDir = resolveDataDir();
    } else {
      throw new Error('getBaseDir() called for remote source');
    }
  }
  return baseDir;
}

/**
 * Read a documentation file by its relative path (e.g. "llms.txt" or "components/ui/Button.md").
 *
 * Content is resolved from:
 * 1. `DOCS_BASE_URL` → HTTP fetch
 * 2. `DOCS_DIR` → local filesystem
 * 3. Default → bundled `dist/data/`
 */
export async function readContent(relativePath: string): Promise<string> {
  const s = getSource();

  if (s.type === 'remote') {
    const url = `${s.baseUrl}/${relativePath}`;
    return fetchText(url);
  }

  const fullPath = path.join(getBaseDir(), relativePath);
  return fs.readFile(fullPath, 'utf-8');
}

/**
 * List all `.md` files available in the content source directory.
 * Only supported for bundled and local sources.
 * Returns paths relative to the data directory.
 */
export async function listContentFiles(subdir?: string): Promise<string[]> {
  const s = getSource();

  if (s.type === 'remote') {
    // For remote sources, we rely on llms.txt for the file listing
    return [];
  }

  const dir = subdir ? path.join(getBaseDir(), subdir) : getBaseDir();
  return collectMarkdownFiles(dir, getBaseDir());
}

async function collectMarkdownFiles(
  dir: string,
  rootDir: string,
): Promise<string[]> {
  const results: string[] = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await collectMarkdownFiles(full, rootDir);
      results.push(...sub);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(path.relative(rootDir, full));
    }
  }
  return results;
}
