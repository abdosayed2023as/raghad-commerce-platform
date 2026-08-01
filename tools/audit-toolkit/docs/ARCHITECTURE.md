# Audit Toolkit Architecture Specification (AT-01..AT-09)

## 1. Overview

**Audit Toolkit V1** implements a 9-tier architectural pipeline:
1. **AT-01 — Audit Toolkit Collector V1**: Captures raw visual, performance, network, and console evidence artifacts.
2. **AT-02 — Structured Metrics Analyzer V1**: Parses raw evidence into a normalized machine-readable metrics document `analysis.json`.
3. **AT-03 — Deterministic Rule Engine V1**: Evaluates `analysis.json` metrics against centralized threshold definitions, generating `rules.json`.
4. **AT-04 — Finding Builder V1**: Converts `FAIL` and `SKIPPED` rules into traceable findings in `findings.json` using dynamic evidence ID generation (`EVD-{CATEGORY}-{VIEWPORT}-{SLUG}`).
5. **AT-05 — Audit Context Builder V1**: Assembles all previous outputs into a single package `audit-package.json`.
6. **AT-06 — AI Report Builder V1**: Consumes **ONLY** `audit-package.json` to produce a versioned audit report `report.json` with complete finding and evidence traceability.
7. **AT-07 — Audit Comparator V1**: Standalone module consuming **ONLY** structured contracts (`audit-package.json`, `report.json`) across baseline and target runs to generate deterministic `comparison.json`.
8. **AT-08 — Specification Generator V1**: Converts recommendations from `report.json` into deterministic, machine-readable developer specifications `specifications.json`.
9. **AT-09 — GitHub Task Generator V1**: Converts developer specifications from `specifications.json` into deterministic GitHub issue payloads `github-issues.json` preserving complete `Specification → Finding → Evidence` traceability.

---

## 2. Tiered Data Pipeline

```text
+-------------------------------------------------------+
|                    RAW EVIDENCE                       |  AT-01 Collector V1
|  (Screenshots, HAR, Console Logs, Lighthouse Reports) |
+-------------------------------------------------------+
                           │
                           ▼
+-------------------------------------------------------+
|                 STRUCTURED METRICS                    |  AT-02 Metrics Analyzer V1
|                   (analysis.json)                     |
+-------------------------------------------------------+
                           │
                           ▼
+-------------------------------------------------------+
|                 DETERMINISTIC RULES                   |  AT-03 Rule Engine V1
|                    (rules.json)                       |
+-------------------------------------------------------+
                           │
                           ▼
+-------------------------------------------------------+
|                 STRUCTURED FINDINGS                   |  AT-04 Finding Builder V1
|                   (findings.json)                     |
+-------------------------------------------------------+
                           │
                           ▼
+-------------------------------------------------------+
|                   CONTEXT PACKAGE                     |  AT-05 Context Builder V1
|                 (audit-package.json)                  |
+-------------------------------------------------------+
                           │
                           ▼ (ONLY Input Contract for AI)
+-------------------------------------------------------+
|                 AI REPORT BUILDER                     |  AT-06 AI Report Builder V1
|                   (report.json)                       |  (Provider-Independent)
+-------------------------------------------------------+
                           │
                           ▼ (ONLY Input Contract for Specs)
+-------------------------------------------------------+
|              SPECIFICATION GENERATOR                  |  AT-08 Specification Generator V1
|                (specifications.json)                  |  (Machine-Readable Developer Specs)
+-------------------------------------------------------+
                           │
                           ▼ (ONLY Input Contract for GitHub Tasks)
+-------------------------------------------------------+
|              GITHUB TASK GENERATOR                    |  AT-09 GitHub Task Generator V1
|               (github-issues.json)                    |  (Deterministic Issue Payloads)
+-------------------------------------------------------+

+-------------------------------------------------------+
|                 AUDIT COMPARATOR                      |  AT-07 Audit Comparator V1
|                 (comparison.json)                     |  (Standalone Execution)
+-------------------------------------------------------+
```

---

## 3. GitHub Task Generator Layer (AT-09)

- **Input Isolation**: Reads **ONLY** `specifications.json`. Does not access raw evidence, Lighthouse JSON, HAR, logs, or intermediate findings directly.
- **Provider Independence**: Operates without GitHub API calls, authentication tokens, or `gh` CLI dependencies. Prepares offline, deterministic JSON payloads.
- **Deterministic Issue Body Formatting**: Enforces structured markdown sections (`## Summary`, `## Problem`, `## Expected Result`, `## Acceptance Criteria`, `## Traceability`).
- **Label Resolution**: Maps priority levels (`Critical` → `critical`, `High` → `high`, etc.) and domains (`performance`, `accessibility`, `seo`, `console`, `network`, `best-practices`) automatically.
- **Issue Identity**: Every generated GitHub issue contains a canonical `fingerprint` property (`Rule ID` + `::` + `Target Page Slug` + `::` + `Viewport`).
  ```text
  Issue Identity
        │
        ▼
   Fingerprint
        │
        ▼
  GitHub Synchronizer (future)
  ```
- **Output Location**: Writes `context/github-issues.json` (`schemaVersion: "1.0.0"`).
