# FinBridge security review and hardening

Owner-approved work date: **Friday, 20 November 2026 — Europe/Berlin**. This is checklist item **19 / SEC**, assigned to that date's existing FinBridge Release QA run. The date schedules the work; it does not guarantee that all account-dependent changes or production deployments can be completed that day.

Sunday 15 November's Cloudflare operations and wider accessibility/performance checks remain scheduled. Use their verified findings as input rather than repeating completed checks. Hosting/domain review remains on 22 November; this security assignment does not authorize migration or DNS changes.

## Work and completion evidence

| ID | Pending work | Completion evidence |
|---|---|---|
| SEC01 | Review backup/import schemas, size limits and every path that renders stored or imported values. Tighten validation and context-appropriate escaping. | Safe, malformed and malicious local test fixtures cover each fix; saved data and normal workflows remain usable. No private visitor records or exploit demonstrations against users. |
| SEC02 | Introduce a compatible Content Security Policy and review applicable security headers. Account for GitHub Pages header constraints and required AI/feedback/analytics resources. | Verify the delivered HTML/headers and relevant live flows. Record protections the current host cannot enforce; do not describe an unsupported meta directive as active. |
| SEC03 | Review third-party script/module dependencies, version pinning, integrity checks or reviewed local copies, update process and licensing. | Record each dependency and its trust/update mechanism; validate integrity where supported and preserve required service behaviour. Cache-version hashes alone do not establish dependency integrity. |
| SEC04 | Review Worker request validation, actual body-size limits before parsing, consistent rate-limit requirements and failed/missing-binding behaviour. | Focused mocked/local tests exercise invalid, oversized, unconfigured and rate-limited requests. Deployed controls require separate authenticated verification; source readiness alone is insufficient. |
| SEC05 | Review repository protection, publishing automation, secret/dependency scanning, MFA and least-privilege service/token permissions. | Verify available settings without revealing secret values. Prepare a compatible branch/review workflow; identify owner-required settings or access. Do not silently break scheduled publishing or claim inaccessible controls were checked. |
| SEC06 | Run focused security regressions and non-disruptive publication checks; update the existing pending list with verified outcomes. | Every fix records scope, evidence, deployment status and unresolved limitations. Preserve existing financial/reference tests. No security certification or claim of absolute safety. |

## Boundaries and release rules

- Review and fix source-level security issues within the existing application and services. Treat this date's assignment as the narrow exception to the daily QA task's usual report-only rule.
- Never put secrets, raw visitor records, precise location records or private feedback into public code, plans or issue bodies. Use synthetic/local fixtures and report remediation categories rather than public exploit payloads.
- Do not change credentials, MFA, collaborators, access permissions, account ownership, domains, DNS or hosting automatically. Prepare concrete owner actions where required. Do not weaken an existing security protection to make a test pass.
- Check the latest `main` SHA and all relevant Pages activity immediately before **every commit**. Require a successful deployment of the previous latest head and no queued, requested, waiting, pending or in-progress Pages run. Stop when state is unknown.
- Preserve concurrent edits with an expected-head guard. Combine related tested fixes, then verify deployment and relevant live flows before another commit. Do not create trigger commits or cancel/retry workflows.
- Deploying website files does not deploy Workers. If authenticated Cloudflare access or settings permissions are unavailable, leave the affected work explicitly blocked/pending and report the exact missing verification.
- Mark each SEC item complete only when its own acceptance evidence exists. Retain incomplete items after the scheduled session and report whether a follow-up is needed.

## Starting assessment

The 13 November passive review found baseline input/anti-spam controls, local financial processing and selected validation/retention tests, alongside work needed on browser policy, imported/stored rendering, dependencies, consistent backend limits and repository protection. The 64-check functional/reference suite is useful regression coverage; it is not a full security audit or penetration test.
