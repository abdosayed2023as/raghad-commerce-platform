# DEPENDENCIES.md — Raghad Commerce Platform: Document Dependency Graph

**Version:** 1.0.0  
**Last Updated:** 2026-08-03  
**Owner:** Documentation Owner

> This document defines which documents depend on which, enabling safe updates without breaking information chains.

---

## 1. Reading: Document Dependency Levels

Documents are organized in layers. Each layer depends on the layers above it.

```
┌─────────────────────────────────────────────┐
│  LAYER 0 — BRAND DNA (IMMUTABLE FOUNDATION) │
│                                             │
│  docs/brand/01_BRAND_BOOK.md               │  ← Master Authority
│  docs/brand/03_DECISIONS.md               │  ← Decision Registry
└────────────────────┬────────────────────────┘
                     │ feeds
┌────────────────────▼────────────────────────┐
│  LAYER 1 — PROJECT GOVERNANCE               │
│                                             │
│  docs/project/PROJECT_CONTEXT.md           │  ← Business Context
│  docs/project/PROJECT_RULES.md             │  ← Non-negotiables
│  docs/project/PROJECT_WORKFLOW.md          │  ← Process
│  docs/project/PROJECT_DECISIONS.md         │  ← Technical Decisions
└────────────────────┬────────────────────────┘
                     │ feeds
┌────────────────────▼────────────────────────┐
│  LAYER 2 — LIVE STATE & NAVIGATION          │
│                                             │
│  docs/project/PROJECT_STATE.md             │  ← Current Sprint
│  docs/project/ROADMAP.md                   │  ← Phase Map
│  docs/brand/00_PROJECT_STATUS.md           │  ← Brand Workshop Status
│  CHANGELOG.md                              │  ← Version History
└────────────────────┬────────────────────────┘
                     │ feeds
┌────────────────────▼────────────────────────┐
│  LAYER 3 — ONBOARDING & NAVIGATION          │
│                                             │
│  AI_CONTEXT.md                             │  ← AI Entry Point
│  README_FOR_AI.md                          │  ← AI Manual
│  README.md                                 │  ← Human Entry
│  INDEX.md                                  │  ← Master Navigation
│  PROJECT_INDEX.md                          │  ← Detailed Navigation
│  SESSION_HANDOFF.md                        │  ← Continuity
└────────────────────┬────────────────────────┘
                     │ feeds
┌────────────────────▼────────────────────────┐
│  LAYER 4 — DESIGN SPECIFICATIONS           │
│                                             │
│  docs/design/DESIGN_SYSTEM.md             │  ← Master Design Spec
│  docs/design/COLOR_SYSTEM.md              │
│  docs/design/TYPOGRAPHY.md                │
│  docs/design/LOGO_GUIDELINES.md           │
│  docs/design/ICONOGRAPHY.md               │
│  docs/design/UI_COMPONENTS.md             │
└────────────────────┬────────────────────────┘
                     │ feeds
┌────────────────────▼────────────────────────┐
│  LAYER 5 — RESEARCH & KNOWLEDGE             │
│                                             │
│  research/easyorders/* (RS-01A to RS-06)   │
│  research/reference/*                      │
│  research/website-audit/*                  │
└────────────────────┬────────────────────────┘
                     │ feeds
┌────────────────────▼────────────────────────┐
│  LAYER 6 — IMPLEMENTATION (PENDING)         │
│                                             │
│  theme/                                    │
│  specs/                                    │
└─────────────────────────────────────────────┘
```

---

## 2. Impact Analysis: "If This File Changes, What Breaks?"

| File Changed | Files That Need Updating | Severity |
| :--- | :--- | :--- |
| `docs/brand/01_BRAND_BOOK.md` | `06_BRAND_MEMORY.md`, `docs/design/*`, `PROJECT_CONTEXT.md`, `AI_CONTEXT.md`, `README.md` | 🔴 Critical |
| `docs/brand/03_DECISIONS.md` | `AI_CONTEXT.md`, `README_FOR_AI.md`, `docs/brand/06_BRAND_MEMORY.md` | 🟠 High |
| `docs/project/PROJECT_STATE.md` | `README.md`, `AI_CONTEXT.md`, `SESSION_HANDOFF.md`, `docs/project/PROJECT_CHARTER.md` | 🟡 Medium |
| `docs/project/PROJECT_RULES.md` | `docs/project/PROJECT_WORKFLOW.md`, `docs/project/AI_TEAM_RULES.md` | 🟡 Medium |
| `docs/project/PROJECT_WORKFLOW.md` | `docs/project/AI_TEAM_RULES.md`, `README_FOR_AI.md` | 🟡 Medium |
| `CHANGELOG.md` | No downstream files — it is a terminal log | 🟢 Low |
| `research/easyorders/*.md` | `research/KNOWLEDGE_INDEX.md`, `research/SUMMARY.md` | 🟡 Medium |
| `docs/design/COLOR_SYSTEM.md` | `docs/design/DESIGN_SYSTEM.md`, `docs/design/UI_COMPONENTS.md` | 🟡 Medium |

---

## 3. Document Lifecycle: Who Updates What

| Document | Updated By | Trigger |
| :--- | :--- | :--- |
| `PROJECT_STATE.md` | Product Architect | Every phase transition or milestone completion |
| `CHANGELOG.md` | Any contributor | Every significant task completion (per TCP) |
| `docs/brand/04_OPEN_ITEMS.md` | Product Architect / Business Owner | When new risks or assumptions are identified |
| `docs/project/PROJECT_DECISIONS.md` | Product Architect | When a new technical/governance RFC is approved |
| `docs/brand/03_DECISIONS.md` | Business Owner only | When a brand decision is made or changed |
| `docs/brand/01_BRAND_BOOK.md` | Business Owner approval required | Major brand evolution only |
| `research/KNOWLEDGE_INDEX.md` | Research session contributor | After every completed research session |
| `SESSION_HANDOFF.md` | Any AI session at close | Before ending any productive work session |
| `ROADMAP.md` | Product Architect | Phase completions and additions |

---

## 4. Documents That Must Never Be Modified Without Business Owner Approval

> [!CAUTION]
> The following documents are **LOCKED**. Modification requires explicit written instruction from the Business Owner.

- `docs/brand/01_BRAND_BOOK.md` — Brand Constitution
- `docs/brand/03_DECISIONS.md` — Locked Decision Registry (BRAND-001 to BRAND-021)
- `docs/brand/02_WORKSHOP_TRANSCRIPT.md` — Historical record (immutable by definition)
- `docs/brand/05_MASTER_REVIEW.md` — QA audit record

---

## 5. Merge / Archive Policy

When a document is superseded:

1. **Never delete** — move to `docs/archive/`
2. **Add a banner** at the top of the archived file linking to its active replacement
3. **Update** `CHANGELOG.md` with the archival event
4. **Update** `DOCUMENT_MAP.md` archive registry
5. **Fix** all cross-references in dependent documents
