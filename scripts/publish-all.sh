#!/usr/bin/env bash
# publish-all.sh - Publish all @geti-ui workspace packages to npm.
#
# Called by semantic-release via @semantic-release/exec publishCmd.
# Packages are published sequentially in dependency order:
#   1. @geti-ui/ui          (no internal deps)
#   2. @geti-ui/blocks      (depends on @geti-ui/ui)
#   3. @geti-ui/smart-tools (no internal deps)
#   4. @geti-ui/charts      (depends on @geti-ui/ui)
#   5. @geti-ui/mcp         (no internal deps)

set -euo pipefail

# Force npm binary from the active Node toolchain (avoids local node_modules/.bin/npm)
NPM_BIN="${NPM_BIN:-$(dirname "$(command -v node)")/npm}"

echo "Publishing with npm $(${NPM_BIN} --version) at ${NPM_BIN}"

echo "Publishing @geti-ui/ui ..."
"${NPM_BIN}" publish --provenance --access public --workspace=@geti-ui/ui

echo "Publishing @geti-ui/blocks ..."
"${NPM_BIN}" publish --provenance --access public --workspace=@geti-ui/blocks

echo "Publishing @geti-ui/smart-tools ..."
"${NPM_BIN}" publish --provenance --access public --workspace=@geti-ui/smart-tools

echo "Publishing @geti-ui/charts ..."
"${NPM_BIN}" publish --provenance --access public --workspace=@geti-ui/charts

echo "Publishing @geti-ui/mcp ..."
"${NPM_BIN}" publish --provenance --access public --workspace=@geti-ui/mcp

echo "All packages published successfully."
