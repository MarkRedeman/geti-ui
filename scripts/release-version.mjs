#!/usr/bin/env node

/**
 * Release version script — determines the next version using git-cliff
 * and updates all publishable package.json files.
 *
 * Usage:
 *   node scripts/release-version.mjs [--check]
 *
 * Flags:
 *   --check   Only check if a bump is needed; don't modify files.
 *             Exits 0 and prints the next version, or prints "skip".
 *
 * Without --check:
 *   - Updates all 5 publishable package.json files with the new version
 *   - Generates CHANGELOG.md via git-cliff
 *   - Prints the new version to stdout
 *
 * Environment:
 *   GITHUB_OUTPUT  — if set, writes version= and should_release= to it
 *                    (for use as a GitHub Actions step output)
 */

import { execSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PUBLISHABLE_WORKSPACES = [
    '@geti-ai/ui',
    '@geti-ai/blocks',
    '@geti-ai/charts',
    '@geti-ai/smart-tools',
    '@geti-ai/mcp',
];

function run(cmd, opts = {}) {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', ...opts }).trim();
}

function getCurrentVersion() {
    const pkgPath = resolve(ROOT, 'packages/ui/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.version;
}

function getNextVersion() {
    try {
        return run('git cliff --bumped-version');
    } catch (err) {
        // git-cliff returns the current version if no bump is needed,
        // or may fail if there are no conventional commits since last tag.
        console.error('git-cliff --bumped-version failed:', err.message);
        return null;
    }
}

function setGitHubOutput(key, value) {
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
        appendFileSync(outputFile, `${key}=${value}\n`);
    }
}

function main() {
    const checkOnly = process.argv.includes('--check');

    const currentVersion = getCurrentVersion();
    const nextVersion = getNextVersion();

    // Normalize: strip leading 'v' if present (git-cliff may include it)
    const normalizedNext = nextVersion?.replace(/^v/, '') ?? null;

    if (!normalizedNext || normalizedNext === currentVersion) {
        console.log('skip');
        setGitHubOutput('version', '');
        setGitHubOutput('should_release', 'false');
        process.exit(0);
    }

    console.log(normalizedNext);
    setGitHubOutput('version', normalizedNext);
    setGitHubOutput('should_release', 'true');

    if (checkOnly) {
        process.exit(0);
    }

    // Update all publishable package.json versions
    const workspaceFlags = PUBLISHABLE_WORKSPACES.map(
        (w) => `--workspace=${w}`,
    ).join(' ');
    run(
        `npm version ${normalizedNext} --no-git-tag-version ${workspaceFlags}`,
    );

    // Generate CHANGELOG.md
    run('git cliff --bump -o CHANGELOG.md');

    console.error(
        `Updated ${PUBLISHABLE_WORKSPACES.length} packages to v${normalizedNext}`,
    );
}

main();
