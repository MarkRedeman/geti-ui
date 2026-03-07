# Security

While these pacakges are mainly intended to be used at the frontend we will continue to take security seriously by taking a security first mindset.
Github Actions are checked by zizmor and all dependencies are automatically updated by renovate.


### security-scan.yml

```yaml
# Security scan workflow for the Geti project

# This workflow is triggered on schedule, workflow_dispatch, and pushes to develop and release branches.
# It performs comprehensive security scanning using multiple tools to identify vulnerabilities,
# secrets, configuration issues, and code quality problems across the entire codebase.
# It also scans GitHub Actions workflows for potential security issues.

# Key Features:
# - Scans GitHub Actions workflows for security vulnerabilities (Zizmor)
# - Performs static security analysis of Python code (Bandit)
# - Scans for vulnerabilities, secrets, and misconfigurations (Trivy)
# - Conducts semantic code analysis for security issues (Semgrep)

# Process Stages:
# 1. Scan GitHub Actions workflows with Zizmor
# 2. Analyze Python code security with Bandit
# 3. Perform filesystem security scan with Trivy
# 4. Run semantic security analysis with Semgrep
# 5. Scan container images (latest available version) with Trivy

# Security Tools:
# - Zizmor: GitHub Actions workflow security scanner
# - Bandit: Python security linter
# - Trivy: Vulnerability and misconfiguration scanner
# - Semgrep: Static analysis tool for finding bugs and security issues

name: "Security scan"

on:
  schedule:
    # Run security checks every day at 2 AM UTC
    - cron: "0 2 * * *"
  workflow_dispatch:
  push:
    branches:
      - main
      - releases/**
  pull_request:
    branches:
      - main
      - releases/**

permissions: {} # No permissions by default

jobs:
  zizmor-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write # Needed to upload the results to code-scanning dashboard
    steps:
      - &checkout
        name: Checkout code
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false

      - name: Run Zizmor scan
        uses: open-edge-platform/geti-ci/actions/zizmor@9b1ef60a8b2b802da428621e192c322960f4b3d5
        with:
          scan-scope: ${{ github.event_name == 'pull_request' && 'changed' || 'all' }}
          severity-level: ${{ github.event_name == 'pull_request' && 'MEDIUM' || 'LOW' }}
          confidence-level: ${{ github.event_name == 'pull_request' && 'MEDIUM' || 'LOW' }}
          fail-on-findings: ${{ github.event_name == 'pull_request' && 'true' || 'false' }} # reports only

  bandit-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write # Needed to upload the results to code-scanning dashboard
    steps:
      - *checkout

      - name: Run Bandit scan
        uses: open-edge-platform/geti-ci/actions/bandit@9b1ef60a8b2b802da428621e192c322960f4b3d5
        with:
          scan-scope: ${{ github.event_name == 'pull_request' && 'changed' || 'all' }}
          severity-level: ${{ github.event_name == 'pull_request' && 'MEDIUM' || 'LOW' }}
          confidence-level: ${{ github.event_name == 'pull_request' && 'MEDIUM' || 'LOW' }}
          config_file: ".github/bandit_config.yml"
          fail-on-findings: ${{ github.event_name == 'pull_request' && 'true' || 'false' }} # reports only

  trivy-scan:
    runs-on: ubuntu-latest
    if: github.event_name != 'pull_request'
    permissions:
      contents: read
      security-events: write # Needed to upload the results to code-scanning dashboard
    steps:
      - name: Checkout code
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false

      - name: Run Trivy scan
        uses: open-edge-platform/geti-ci/actions/trivy@9b1ef60a8b2b802da428621e192c322960f4b3d5
        with:
          scan_type: "fs"
          scan-scope: all
          severity: "LOW"
          scanners: "vuln,secret,config"
          format: "sarif"
          timeout: "15m"
          ignore_unfixed: "false"

  semgrep-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write # Needed to upload the results to code-scanning dashboard
    steps:
      - name: Checkout code
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false
          fetch-depth: 0

      - name: Run Semgrep scan
        uses: open-edge-platform/geti-ci/actions/semgrep@9b1ef60a8b2b802da428621e192c322960f4b3d5
        with:
          scan-scope: ${{ github.event_name == 'pull_request' && 'changed' || 'all' }}
          severity: ${{ github.event_name == 'pull_request' && 'HIGH' || 'LOW' }}
          fail-on-findings: ${{ github.event_name == 'pull_request' && 'true' || 'false' }} # reports only

  trivy-image-scan:
    if: github.event_name == 'schedule' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    strategy:
      matrix:
        ai-device: [cpu, cuda, xpu]
    steps:
      - name: Run container image scan (${{ matrix.ai-device }})
        uses: open-edge-platform/geti-ci/actions/trivy@9b1ef60a8b2b802da428621e192c322960f4b3d5
        with:
          artifact-name: "trivy-scan-container-${{ matrix.ai-device }}"
          scan_type: "image"
          scan_target: "ghcr.io/open-edge-platform/physical-ai-studio-${{ matrix.ai-device }}:main"
          scan-scope: all
          severity: "LOW"
          scanners: "vuln,secret,config"
          format: "table"
          timeout: "15m"
          ignore_unfixed: "true"
```

### renovate.yml

```yaml
# Dependencies Management Workflow
#
# This workflow automates the dependency management based on self-hosed Renovate
# ensure the project's dependencies remains up-to-date and security fixes are delivered regularly.
#
# Key Features:
# - Automated PR creation into pyproject.toml and uv.lock regeneration
# - Dry-run for debug purposes
# - Dependency dashboard (is available in GitHub issues) maintenance
#
# Process Stages:
#
# 1. Dependencies Management:
#    - Runs on a daily schedule.
#    - Identifies dependencies that may be updated based on .github/renovate.json5 configuration.
#    - Opens corresponding PRs with respect to schedule defined in Renovate config file.
#    - Updates Renovate Dependency dashboard that is available in GitHub issues.
#
# Required Secrets:
# - RENOVATE_APP_ID: application ID
# - RENOVATE_APP_PEM: application private key
#
# Example Usage:
# 1. Scheduled Run:
#    Automatically runs, daily
#
# 2. Manual Trigger:
#    workflow_dispatch:
#    inputs:
#      dry-run:
#        description: "Run Renovate in dry-run mode (no PR)"
#        required: false
#        default: false
#        type: boolean
#
# Note: Renovate maintains and updates Dependency dashboard that is available in GitHub issues.

name: Renovate
on:
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:
    inputs:
      dry-run:
        description: "Run Renovate in dry-run mode (no PR)"
        required: false
        default: false
        type: boolean

permissions: {}

jobs:
  renovate:
    permissions:
      contents: read
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false

      - name: Get token
        id: get-github-app-token
        uses: actions/create-github-app-token@29824e69f54612133e76f7eaac726eef6c875baf # v2.2.1
        with:
          app-id: ${{ secrets.RENOVATE_APP_ID }}
          private-key: ${{ secrets.RENOVATE_APP_PEM }}

      - name: Self-hosted Renovate
        uses: renovatebot/github-action@7b4b65bf31e07d4e3e51708d07700fb41bc03166 # v46.1.3
        with:
          configurationFile: .github/renovate.json5
          token: "${{ steps.get-github-app-token.outputs.token }}"
        env:
          LOG_LEVEL: ${{ github.event_name == 'workflow_dispatch' && 'debug' || 'info' }}
          # Dry run if the event is workflow_dispatch AND the dry-run input is true
          RENOVATE_DRY_RUN: ${{ (github.event_name == 'workflow_dispatch' && github.event.inputs.dry-run == 'true') && 'full' || null }}
          RENOVATE_PLATFORM: github
          RENOVATE_REPOSITORIES: ${{ github.repository }}
```

### renovate-config-validator.yml

```yaml
# Renovate configuration validator
#
# This workflow validates changes proposed into Renovate configuration file
# (.github/renovate.json5) and prevents non-valid configuration to be used by Renovate.
#
# Required Secrets:
# - None
#
# Automatically triggered on:
# - Pull requests to .github/renovate.json5.
#

name: Validate Renovate configuration

on:
  pull_request:
    paths:
      - ".github/renovate.json5"

permissions: {} # No permissions by default on workflow level

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.event.after }}
  cancel-in-progress: true

jobs:
  validate:
    runs-on: ubuntu-latest
    permissions:
      contents: read # to checkout code
    steps:
      - name: Checkout configuration
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false

      - name: Validate configuration
        run: |
          # renovate: datasource=docker
          export RENOVATE_IMAGE=ghcr.io/renovatebot/renovate:40.11
          docker run --rm --entrypoint "renovate-config-validator" \
          -v "${{ github.workspace }}/.github/renovate.json5":"/renovate.json5" \
          ${RENOVATE_IMAGE} "/renovate.json5"
```

## scorecards.yaml

```yaml
name: Scorecards supply-chain security

on:
  # For Branch-Protection check. Only the default branch is supported. See
  # https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection
  branch_protection_rule:
  schedule:
    # Run security checks every day at 2 AM UTC
    - cron: "0 2 * * *"
  workflow_dispatch:

permissions: {}

jobs:
  analysis:
    name: Scorecards analysis
    runs-on: ubuntu-latest
    permissions:
      # Needed to upload the results to code-scanning dashboard
      security-events: write
      # Needed to publish results and get a badge
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false

      - name: Run analysis
        uses: ossf/scorecard-action@4eaacf0543bb3f2c246792bd56e8cdeffafb205a # v2.4.3
        with:
          results_file: results.sarif
          results_format: sarif
          publish_results: true

      # Upload the results to GitHub's code scanning dashboard
      - name: Upload to code-scanning
        uses: github/codeql-action/upload-sarif@c793b717bc78562f491db7b0e93a3a178b099162 # v4.32.5
        with:
          sarif_file: results.sarif
```
