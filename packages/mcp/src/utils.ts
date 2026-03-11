import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ContentSource } from './types.js';

/**
 * Safely convert any error value to a readable string.
 */
export function errorToString(err: unknown): string {
  if (
    err &&
    typeof err === 'object' &&
    'stack' in err &&
    typeof (err as Error).stack === 'string'
  ) {
    return (err as Error).stack!;
  }
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as Error).message === 'string'
  ) {
    return (err as Error).message;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Resolve the `dist/data/` directory where bundled docs are stored.
 * Works both when running from source and from a compiled dist/ directory.
 */
export function resolveDataDir(): string {
  const thisFile = fileURLToPath(import.meta.url);
  const thisDir = path.dirname(thisFile);

  // When bundled, the entry is at dist/index.js and data is at dist/data/
  const candidate = path.resolve(thisDir, 'data');
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  // Fallback: try relative to package root (for dev with unbundled source)
  const packageRoot = path.resolve(thisDir, '..');
  const fallback = path.resolve(packageRoot, 'dist', 'data');
  if (fs.existsSync(fallback)) {
    return fallback;
  }

  return candidate; // Return the expected path even if it doesn't exist yet
}

/**
 * Determine the content source based on environment variables.
 *
 * Priority:
 * 1. DOCS_BASE_URL → remote HTTP
 * 2. DOCS_DIR → local filesystem directory
 * 3. Default → bundled data in dist/data/
 */
export function resolveContentSource(): ContentSource {
  const remoteUrl = process.env.DOCS_BASE_URL;
  if (remoteUrl) {
    // Strip trailing slash
    return { type: 'remote', baseUrl: remoteUrl.replace(/\/+$/, '') };
  }

  const localDir = process.env.DOCS_DIR;
  if (localDir) {
    return { type: 'local', dir: path.resolve(localDir) };
  }

  return { type: 'bundled' };
}

/**
 * Fetch text from a URL with a timeout.
 */
export async function fetchText(
  url: string,
  timeoutMs = 15_000,
): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  // .unref() prevents the timer from keeping the process alive
  if (typeof timer === 'object' && 'unref' in timer) {
    (timer as NodeJS.Timeout).unref();
  }
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}
