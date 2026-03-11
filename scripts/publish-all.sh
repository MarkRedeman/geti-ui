#!/usr/bin/env bash
# publish-all.sh — Publish all @geti-ai workspace packages to npm.
#
# Called by semantic-release via @semantic-release/exec publishCmd.
# Packages are published sequentially in dependency order:
#   1. @geti-ai/ui          (no internal deps)
#   2. @geti-ai/smart-tools (no internal deps)
#   3. @geti-ai/charts      (depends on @geti-ai/ui)
#   4. @geti-ai/mcp         (no internal deps)

set -euo pipefail

echo "Publishing @geti-ai/ui ..."
npm publish --workspace=@geti-ai/ui

echo "Publishing @geti-ai/smart-tools ..."
npm publish --workspace=@geti-ai/smart-tools

echo "Publishing @geti-ai/charts ..."
npm publish --workspace=@geti-ai/charts

echo "Publishing @geti-ai/mcp ..."
npm publish --workspace=@geti-ai/mcp

echo "All packages published successfully."
