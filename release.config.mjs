/**
 * Semantic-release configuration for the geti-ui monorepo.
 *
 * All five packages (@geti-ui/ui, @geti-ui/blocks, @geti-ui/smart-tools,
 * @geti-ui/charts, @geti-ui/mcp) share a single version number. On every
 * push to `main`,
 * semantic-release analyses conventional commits since the last tag and:
 *
 *   1. Determines the next version bump (patch / minor / major)
 *   2. Generates release notes
 *   3. Writes CHANGELOG.md
 *   4. Updates every workspace package.json to the new version
 *   5. Publishes all five packages to npm (via scripts/publish-all.sh)
 *   6. Commits the changed files back to main
 *   7. Creates a GitHub Release with the generated notes
 *
 * Tag format: v0.1.0, v0.2.0, v1.0.0, ...
 */

const WORKSPACES = [
    'packages/ui',
    'packages/blocks',
    'packages/smart-tools',
    'packages/charts',
    'packages/mcp',
];

const versionCmd = WORKSPACES.map(
    (ws) => `npm version --no-git-tag-version \${nextRelease.version} --workspace=${ws}`,
).join(' && ');

export default {
    branches: ['main'],
    tagFormat: 'v${version}',
    plugins: [
        // 1. Analyse commits to decide bump level
        '@semantic-release/commit-analyzer',

        // 2. Generate human-readable release notes
        '@semantic-release/release-notes-generator',

        // 3. Write / append CHANGELOG.md in repo root
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],

        // 4. Prepare: bump versions in all workspace package.json files
        //    Publish: run the publish script that publishes all workspaces
        [
            '@semantic-release/exec',
            {
                prepareCmd: versionCmd,
                publishCmd: 'bash scripts/publish-all.sh',
            },
        ],

        // 5. Commit updated package.json files + CHANGELOG.md back to main
        //    The default message includes [skip ci] to avoid re-triggering the workflow
        [
            '@semantic-release/git',
            {
                assets: [
                    'CHANGELOG.md',
                    'packages/ui/package.json',
                    'packages/blocks/package.json',
                    'packages/smart-tools/package.json',
                    'packages/charts/package.json',
                    'packages/mcp/package.json',
                ],
                message:
                    'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],

        // 6. Create a GitHub Release with the generated notes
        '@semantic-release/github',
    ],
};
