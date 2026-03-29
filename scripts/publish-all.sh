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

echo "Publishing @geti-ui/ui ..."
npm publish --provenance --access public --workspace=@geti-ui/ui

echo "Publishing @geti-ui/blocks ..."
npm publish --provenance --access public --workspace=@geti-ui/blocks

echo "Publishing @geti-ui/smart-tools ..."
npm publish --provenance --access public --workspace=@geti-ui/smart-tools

echo "Publishing @geti-ui/charts ..."
npm publish --provenance --access public --workspace=@geti-ui/charts

echo "Publishing @geti-ui/mcp ..."
npm publish --provenance --access public --workspace=@geti-ui/mcp

echo "All packages published successfully."
