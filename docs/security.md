# Security Architecture & Design

The Geti UI design system follows a **security-first mindset** to ensure the integrity of our component library and the safety of the applications that consume it. Our security architecture focuses on three main pillars: Automated Scanning, Dependency Management, and Supply Chain Security.

## 1. Automated Security Scanning

We use a multi-layered approach to static analysis and vulnerability detection, integrated directly into our CI/CD pipeline.

### GitHub Actions Security (Zizmor)
We use **Zizmor** to audit our GitHub Actions workflows. This identifies potential security risks in our CI/CD configuration, such as:
- Excessive permissions.
- Use of unpinned/unverified actions.
- Potential for command injection.

**Trigger:** Daily schedule, on push to `main`/`releases/**`, and on Pull Requests targeting those branches. On PRs, only changed workflows are scanned and the job fails on new findings (MEDIUM+ severity/confidence); daily/push runs scan all workflows at LOW severity without blocking.

### Filesystem & Vulnerability Scanning (Trivy)
**Trivy** is used to perform comprehensive scans of the repository filesystem. It detects:
- **Vulnerabilities (CVEs)** in project dependencies.
- **Exposed Secrets** (API keys, tokens) accidentally committed to the repo.
- **Misconfigurations** in project files.

**Trigger:** Daily schedule and on push to `main`/`releases/**` only (not on PRs).

### Semantic Code Analysis (Semgrep)
**Semgrep** provides advanced static analysis by looking for dangerous code patterns and known security anti-patterns. Unlike simple regex-based tools, Semgrep understands the semantics of the code.

**Trigger:** Daily schedule, on push to `main`/`releases/**`, and on Pull Requests targeting those branches. On PRs, only changed files are scanned and the job fails on HIGH+ severity findings; daily/push runs scan everything at LOW severity without blocking.

---

## 2. Dependency Management

Keeping dependencies up-to-date is a critical part of our security strategy.

### Automated Updates (Renovate)
We use a self-hosted **Renovate** bot to monitor our `package.json` and other dependency files.
- **Scheduled Updates:** Minor and patch updates are grouped and scheduled to minimize noise.
- **Security Fixes:** High-priority security updates are addressed immediately.
- **Configuration Validation:** Every change to `.github/renovate.json5` is validated by a dedicated workflow to ensure the bot continues to operate correctly.
- **GitHub Actions hardening:** Renovate is configured to pin and maintain GitHub Actions digests, reducing supply-chain risk from mutable action tags.

---

## 3. Supply Chain Security

We monitor the overall security health of our repository using industry-standard metrics.

### OSSF Scorecard
The **OSSF Scorecard** automatically assesses the repository against security best practices for open-source projects, including:
- Branch protection rules.
- Maintenance of dependencies.
- Use of signed commits.
- SAST tool usage.

**Trigger:** Daily schedule and on `branch_protection_rule` events (for the Branch Protection check). Results are uploaded to the GitHub Security Dashboard.

---

## 4. Reporting & Governance

### Security Dashboard
Results from all security scans (Zizmor, Trivy, Semgrep, Scorecard) are uploaded as **SARIF** files to the GitHub Code Scanning dashboard. This provides a single source of truth for the maintenance team to review and remediate security findings.

### Branch Protection
Security checks are intended to be mandatory for all Pull Requests. The recommended repository configuration requires:
- Successful completion of the `Security scan` workflow before merge.
- Passing `lint` and `type-check` checks.
- Approval from a maintainer before merging.

> **Note:** These requirements are enforced via GitHub branch-protection rules on the repository. Workflow files alone do not prevent merging; the rules must be configured in `Settings > Branches` to take effect.

### Release security considerations

`@geti-ui/smart-tools` uses a dedicated release workflow that builds OpenCV artifacts via Docker and caches build layers in GHCR.

Recommended controls:

- Scope workflow permissions to least privilege (`contents`, `packages`, `pull-requests` only when required).
- Keep OpenCV build definitions (`opencv-build.Dockerfile`, `opencv_js.config.py`) code-owner protected.
- Periodically rotate and audit npm/GitHub credentials used by release workflows.
- Prefer action pinning to commit SHAs for release and Docker-related workflows (automated via Renovate where applicable).
