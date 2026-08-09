# Global Frozen Modules Registry

This document tracks all officially frozen production baseline modules across the Audit Toolkit ecosystem.

| Module | Version | Status | Freeze Date | Primary Contract |
| :--- | :---: | :---: | :---: | :--- |
| **AT-01 Evidence Collector** | `1.0.0` | Frozen | 2026-08-01 | Evidence Artifacts |
| **AT-02 Structured Metrics Analyzer** | `1.0.0` | Frozen | 2026-08-01 | `analysis.json` |
| **AT-03 Deterministic Rule Engine** | `1.0.0` | Frozen | 2026-08-01 | `rules.json` |
| **AT-04 Deterministic Finding Builder** | `1.0.0` | Frozen | 2026-08-01 | `findings.json` |
| **AT-05 Audit Context Builder** | `1.0.0` | Frozen | 2026-08-01 | `audit-package.json` |
| **AT-06 AI Report Builder** | `1.0.0` | Frozen | 2026-08-01 | `report.json` |
| **AT-07 Audit Comparator** | `1.0.0` | Frozen | 2026-08-01 | `comparison.json` |
| **AT-08 Specification Generator** | `1.0.0` | Frozen | 2026-08-01 | `specifications.json` |
| **AT-09 GitHub Task Generator** | `1.0.0` | Frozen | 2026-08-01 | `github-issues.json` |
| **AT-10 Recommendation Engine** | `2.0.0` | Frozen | 2026-08-01 | `recommendations.json` |
| **AT-11 AI Fix Planner** | `2.0.0` | Frozen | 2026-08-01 | `fix-plans.json` |
| **AT-12 Auto Fix Engine** | `2.0.0` | Frozen | 2026-08-01 | `patch-package.json` |
| **AT-13A Patch Applicator** | **`2.0.0`** | **Frozen** | **2026-08-02** | **`apply-result.json`** |
| **PSC-001 Product Service Contract** | **`1.0.1`** | **Frozen** | **2026-08-02** | **Product Service Contract Spec** |
| **PSC-002 Product Provider Contract** | **`1.0.1`** | **Frozen** | **2026-08-02** | **Product Provider Contract Spec** |

---

## Freeze Policy Enforcement

No further source-code modifications are permitted for any module marked as **Frozen**.

- **Allowed Exceptions**: Critical production bugs, security vulnerabilities, host compatibility hotfixes.
- **New Development**: Requires a new RFC, minor/major version bump, and new freeze declaration cycle.
