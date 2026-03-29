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

echo "--- Publish debug context ---"
echo "node: $(node --version)"
echo "npm: $(npm --version)"
echo "registry: $(npm config get registry)"
echo "GITHUB_ACTIONS=${GITHUB_ACTIONS:-}"
echo "GITHUB_REPOSITORY=${GITHUB_REPOSITORY:-}"
echo "GITHUB_REF=${GITHUB_REF:-}"
echo "GITHUB_WORKFLOW=${GITHUB_WORKFLOW:-}"
echo "ACTIONS_ID_TOKEN_REQUEST_URL present: $([ -n "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" ] && echo yes || echo no)"
echo "ACTIONS_ID_TOKEN_REQUEST_TOKEN present: $([ -n "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ] && echo yes || echo no)"
echo "NODE_AUTH_TOKEN present: $([ -n "${NODE_AUTH_TOKEN:-}" ] && echo yes || echo no)"

echo "npm whoami (non-fatal):"
if npm whoami >/tmp/npm-whoami.out 2>/tmp/npm-whoami.err; then
	cat /tmp/npm-whoami.out
else
	echo "whoami failed (expected with OIDC-only auth in some contexts):"
	sed -E 's/(token=)[^[:space:]]+/\1***REDACTED***/g' /tmp/npm-whoami.err
fi

echo "npm config (sanitized):"
npm config list --json | node -e '
  const fs = require("node:fs");
  const input = fs.readFileSync(0, "utf8");
  const data = JSON.parse(input);
  const mask = (obj) => {
    if (Array.isArray(obj)) return obj.map(mask);
    if (obj && typeof obj === "object") {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        if (/(token|auth|password|_auth|otp|secret|key)/i.test(k)) {
          out[k] = "***REDACTED***";
        } else {
          out[k] = mask(v);
        }
      }
      return out;
    }
    return obj;
  };
  process.stdout.write(JSON.stringify(mask(data), null, 2) + "\n");
'

if [ -n "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" ] && [ -n "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]; then
	echo "Requesting OIDC token for npm audience (debug claims only)..."
	OIDC_URL="${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=npm:registry.npmjs.org"
	OIDC_RESPONSE=$(curl -sSf -H "Authorization: bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}" "$OIDC_URL")
	OIDC_TOKEN=$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.value || "")' "$OIDC_RESPONSE")

	if [ -n "$OIDC_TOKEN" ]; then
		node -e '
      const token = process.argv[1];
      const payloadB64 = token.split(".")[1];
      const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
      const keys = ["iss", "aud", "sub", "repository", "repository_owner", "workflow_ref", "job_workflow_ref", "ref", "environment"];
      const out = {};
      for (const k of keys) out[k] = payload[k] ?? null;
      console.log("OIDC claims:");
      console.log(JSON.stringify(out, null, 2));
    ' "$OIDC_TOKEN"
	else
		echo "OIDC token request returned empty value"
	fi
else
	echo "OIDC request env vars are missing"
fi
echo "--- End publish debug context ---"

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
