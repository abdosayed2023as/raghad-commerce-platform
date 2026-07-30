# Audit Toolkit Architecture Specification (AT-01..AT-06)

## 1. Overview

**Audit Toolkit V1** implements a 6-tier architectural pipeline:
1. **AT-01 — Audit Toolkit Collector V1**: Captures raw visual, performance, network, and console evidence artifacts.
2. **AT-02 — Structured Metrics Analyzer V1**: Parses raw evidence into a normalized machine-readable metrics document `analysis.json`.
3. **AT-03 — Deterministic Rule Engine V1**: Evaluates `analysis.json` metrics against centralized threshold definitions, generating `rules.json`.
4. **AT-04 — Finding Builder V1**: Converts `FAIL` and `SKIPPED` rules into traceable findings in `findings.json` using dynamic evidence ID generation (`EVD-{CATEGORY}-{VIEWPORT}-{SLUG}`).
5. **AT-05 — Audit Context Builder V1**: Assembles all previous outputs into a single package `audit-package.json`.
6. **AT-06 — AI Report Builder V1**: Consumes **ONLY** `audit-package.json` to produce a versioned audit report `report.json` with complete finding and evidence traceability.

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
```

---

## 3. Stabilization Specifications (AT-06.1)

1. **Dynamic Evidence ID Builder**: Evidence IDs (`EVD-PRF-DESKTOP-HOMEPAGE`, `EVD-CNS-HOMEPAGE`, `EVD-NET-HOMEPAGE`) and source artifact paths are generated dynamically by `src/utils/evidenceIdBuilder.js` based on page slug and category, eliminating hardcoded values.
2. **Single Source of Truth for Version**: All modules import `getToolkitVersion()` from `src/utils/version.js`, which reads `version` dynamically from `package.json`.
3. **Correct Rule Categories**: Rule categories strictly conform to `"Performance"`, `"Accessibility"`, `"Best Practices"`, `"SEO"`, `"Console"`, and `"Network"`.
4. **Contract Schema Versioning**: Every JSON contract output includes `schemaVersion: "1.0.0"`.
5. **AT Numbering Consistency**: AT numbers strictly match execution order across codebase, CLI logs, and documentation (`AT-01` through `AT-06`).
