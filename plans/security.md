# Security

While these packages are mainly intended to be used at the frontend, we take security seriously with a security-first mindset.

## Implemented Security Features

- **GitHub Actions Security**: Scanned by **Zizmor** to identify workflow vulnerabilities.
- **Dependency Management**: Automatically updated by **Renovate** with configuration validation.
- **Vulnerability Scanning**: **Trivy** performs filesystem scans for vulnerabilities, secrets, and misconfigurations.
- **Static Analysis**: **Semgrep** conducts semantic code analysis for security issues.
- **Supply Chain Security**: **OSSF Scorecard** provides automated analysis of project security health.

## Security Workflows

The following workflows are located in `.github/workflows/`:

- `security-scan.yml`: Daily comprehensive scans (Zizmor, Trivy, Semgrep).
- `renovate.yml`: Daily dependency updates using self-hosted Renovate.
- `renovate-config-validator.yml`: Validates changes to `.github/renovate.json5`.
- `scorecards.yml`: Daily supply-chain security analysis.

## Security Scanning Details

### Zizmor
Scans GitHub Actions workflows for security vulnerabilities. Triggered on schedule and pull requests (fails on findings in PRs).

### Trivy
Performs filesystem (fs) security scans for vulnerabilities, secrets, and misconfigurations.

### Semgrep
Static analysis tool for finding bugs and security issues using semantic patterns.

### OSSF Scorecard
Assesses the repository against security best practices for open-source projects.

