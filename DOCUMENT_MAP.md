# DOCUMENT_MAP.md — Raghad Commerce Platform: Document Relationship Map

**Version:** 1.0.0  
**Last Updated:** 2026-08-03  
**Owner:** Documentation Owner

> This document shows how every file in the repository relates to every other file — ownership hierarchies, dependency chains, and information flow.

---

## 1. Information Ownership Hierarchy

Each fact has exactly **one owner document**. All other references must link to the owner, never duplicate.

| Fact Domain | Canonical Owner | Secondary References |
| :--- | :--- | :--- |
| **Current Project Phase & Sprint** | `docs/project/PROJECT_STATE.md` | `README.md`, `AI_CONTEXT.md`, `SESSION_HANDOFF.md`, `docs/project/PROJECT_CHARTER.md` |
| **Master Brand Guidelines (full)** | `docs/brand/01_BRAND_BOOK.md` | All other brand files (cross-reference only) |
| **Brand DNA Quick Reference** | `docs/brand/06_BRAND_MEMORY.md` | `AI_CONTEXT.md`, `README.md`, `docs/project/PROJECT_CONTEXT.md` |
| **Locked Brand Decisions** | `docs/brand/03_DECISIONS.md` | `AI_CONTEXT.md`, `README_FOR_AI.md`, `docs/brand/06_BRAND_MEMORY.md` |
| **Project & Technical Decisions** | `docs/project/PROJECT_DECISIONS.md` | `CHANGELOG.md`, `docs/project/PROJECT_STATE.md` |
| **Non-Negotiable Project Rules** | `docs/project/PROJECT_RULES.md` | `docs/project/PROJECT_WORKFLOW.md`, `AI_CONTEXT.md` |
| **Feature Lifecycle & Workflow** | `docs/project/PROJECT_WORKFLOW.md` | `docs/project/AI_TEAM_RULES.md`, `CHANGELOG.md` |
| **Business Context & Philosophy** | `docs/project/PROJECT_CONTEXT.md` | `docs/project/PROJECT_CHARTER.md`, `docs/project/PROJECT_RULES.md` |
| **Design Tokens & Color** | `docs/design/COLOR_SYSTEM.md` | `docs/brand/01_BRAND_BOOK.md` §15, `docs/brand/06_BRAND_MEMORY.md` §7 |
| **Design System (full)** | `docs/design/DESIGN_SYSTEM.md` | All `docs/design/` files |
| **Platform Research** | `research/easyorders/` (RS-01A to RS-06) | `research/SUMMARY.md`, `research/KNOWLEDGE_INDEX.md` |
| **Reusable Reference Lookups** | `research/reference/` | Any implementation session |
| **All Business & Brand Terms** | `docs/project/GLOSSARY.md` | `docs/project/DOCUMENTATION_STANDARDS.md` |
| **Version History** | `CHANGELOG.md` | `README.md`, `PROJECT_INDEX.md` |
| **AI Entry Protocol** | `AI_CONTEXT.md` | `PROJECT_INDEX.md`, `SESSION_HANDOFF.md` |

---

## 2. Document Dependency Graph

```
README.md
  └─ reads from → PROJECT_STATE.md (current phase)
  └─ reads from → 01_BRAND_BOOK.md (brand identity)
  └─ reads from → CHANGELOG.md (version history)

AI_CONTEXT.md
  └─ reads from → PROJECT_STATE.md
  └─ reads from → PROJECT_RULES.md
  └─ reads from → 06_BRAND_MEMORY.md
  └─ reads from → 03_DECISIONS.md
  └─ points to → 01_BRAND_BOOK.md

SESSION_HANDOFF.md (root)
  └─ synthesizes → PROJECT_STATE.md
  └─ synthesizes → 07_SESSION_HANDOFF.md (brand)
  └─ synthesizes → 04_OPEN_ITEMS.md
  └─ synthesizes → ROADMAP.md

PROJECT_CHARTER.md
  └─ delegates to → PROJECT_CONTEXT.md (business context)
  └─ delegates to → PROJECT_STATE.md (current state)
  └─ delegates to → 01_BRAND_BOOK.md (brand)

PROJECT_RULES.md
  └─ depends on → PROJECT_CONTEXT.md
  └─ delegates to → AI_TEAM_RULES.md
  └─ delegates to → DOCUMENTATION_STANDARDS.md

PROJECT_WORKFLOW.md
  └─ depends on → PROJECT_CONTEXT.md
  └─ depends on → PROJECT_RULES.md
  └─ references → DOCUMENTATION_STANDARDS.md

01_BRAND_BOOK.md
  └─ is the authority for → 06_BRAND_MEMORY.md (summary)
  └─ is the authority for → 03_DECISIONS.md (decision log)
  └─ is the authority for → docs/design/* (visual specs)
  └─ is evidenced by → 02_WORKSHOP_TRANSCRIPT.md
  └─ was audited by → 05_MASTER_REVIEW.md

research/KNOWLEDGE_INDEX.md
  └─ indexes → research/easyorders/*
  └─ indexes → research/reference/*
  └─ is navigated via → research/INDEX.md
  └─ is summarized in → research/SUMMARY.md
```

---

## 3. What Lives Where — Anti-Duplication Rules

| Information | ✅ Only Lives In | ❌ Should NEVER Be Duplicated In |
| :--- | :--- | :--- |
| Vision Statement (Arabic) | `01_BRAND_BOOK.md` §2 | Any other file should cross-reference, not copy |
| Mission Statement (Arabic) | `01_BRAND_BOOK.md` §3 | Same as above |
| Tagline & Sub-Promise | `01_BRAND_BOOK.md` §10 | Can be quoted in summary docs with attribution |
| Core Values (4 pillars) | `01_BRAND_BOOK.md` §4 | Same as above |
| Target Personas | `01_BRAND_BOOK.md` §5 | `06_BRAND_MEMORY.md` §4 is the approved summary |
| Risk Reversal Framework | `01_BRAND_BOOK.md` §6 | `06_BRAND_MEMORY.md` §4 is the approved summary |
| Color Hex Values | `01_BRAND_BOOK.md` §15 + `COLOR_SYSTEM.md` | Never paste raw hex values elsewhere |
| Decision IDs (BRAND-XXX) | `03_DECISIONS.md` | `AI_CONTEXT.md` references, never re-defines |
| Decision IDs (TECH/OPS-XXX) | `PROJECT_DECISIONS.md` | `PROJECT_STATE.md` references only |
| Current Sprint Status | `PROJECT_STATE.md` | All other docs must link, not copy |
| Workflow stages | `PROJECT_WORKFLOW.md` | `AI_TEAM_RULES.md` references via link |

---

## 4. Documents That Should Always Be Read Together

| Primary Document | Always Pair With |
| :--- | :--- |
| `AI_CONTEXT.md` | `README_FOR_AI.md` + `PROJECT_STATE.md` |
| `01_BRAND_BOOK.md` | `03_DECISIONS.md` + `06_BRAND_MEMORY.md` |
| `PROJECT_RULES.md` | `PROJECT_WORKFLOW.md` + `AI_TEAM_RULES.md` |
| `PROJECT_STATE.md` | `ROADMAP.md` + `CHANGELOG.md` |
| Any research session | `research/KNOWLEDGE_INDEX.md` + `research/SUMMARY.md` |
| Any design spec | `01_BRAND_BOOK.md` §15 + `COLOR_SYSTEM.md` |

---

## 5. Archive Document Registry

| Archived File | Superseded By | Reason Archived |
| :--- | :--- | :--- |
| `docs/archive/BRAND_BOOK_v1.0_SUPERSEDED.md` | `docs/brand/01_BRAND_BOOK.md` | Pre-workshop draft (score 24/100). Old name "عالم رغد \| Raghad World". |
| `docs/archive/MASTER_REVIEW_ROOT_DUPLICATE.md` | `docs/brand/05_MASTER_REVIEW.md` | Was at repository root — exact duplicate. |
| `docs/archive/brand-workshop-pre-refactor/*.md` | `docs/brand/` (8 canonical files) | 35 stub/phase/session files from pre-refactor state. All content preserved in canonical files. |
