#!/usr/bin/env bash
# publish-all.sh — Publish all @geti-ai workspace packages to npm.
#
# Called by semantic-release via @semantic-release/exec publishCmd.
# Packages are published sequentially in dependency order:
#   1. @geti-ai/ui          (no internal deps)
#   2. @geti-ai/blocks      (depends on @geti-ai/ui)
#   3. @geti-ai/smart-tools (no internal deps)
#   4. @geti-ai/charts      (depends on @geti-ai/ui)
#   5. @geti-ai/mcp         (no internal deps)

set -euo pipefail

echo "Publishing @geti-ai/ui ..."
npm publish --provenance --access public --workspace=@geti-ai/ui

echo "Publishing @geti-ai/blocks ..."
npm publish --provenance --access public --workspace=@geti-ai/blocks

echo "Publishing @geti-ai/smart-tools ..."
npm publish --provenance --access public --workspace=@geti-ai/smart-tools

echo "Publishing @geti-ai/charts ..."
npm publish --provenance --access public --workspace=@geti-ai/charts

echo "Publishing @geti-ai/mcp ..."
npm publish --provenance --access public --workspace=@geti-ai/mcp

echo "All packages published successfully."
