# Project Manifest (`docs/PROJECT_MANIFEST.md`)

**Project Name:** Raghad Commerce Platform (RCP) — رغد | Raghad  
**Primary Commercial Domain:** `raghadworld.com`  
**Current Version:** 2.4.2  
**Current Phase:** Visual Identity & Design System Execution  
**Current Status:** Active (Brand Strategy 100% Approved — Audit Score 92/100)  
**Last Updated:** 2026-08-09  
**Owner:** Product Architect & Business Owner  

---

## 1. Repository Purpose

This repository is the single source of truth (SSOT) for **رغد | Raghad** — an enterprise multi-pillar lifestyle brand (Raghad Kids, Raghad Home, Raghad Bridal) serving Egyptian women.

It houses:
1. Executive Governance, Project Rules, and AI Collaboration Protocols
2. Strategic Brand DNA, Approved Brand Book, and Locked Decisions
3. Architectural Decision Records (ADRs) and Decision Traceability
4. Research Database and Technical Platform Specifications (Easy Orders)
5. Custom Theme Implementation Code and Design Tokens

---

## 2. Directory & Information Architecture

```text
raghad-commerce-platform/
├── INDEX.md                      # Master repository navigation index (Layer 1)
├── SESSION_HANDOFF.md            # AI-optimized 60-second orientation
├── DOCUMENT_MAP.md               # Document relationship & ownership map
├── DECISION_TREE.md              # Visual map of all 29 strategic decisions
├── DEPENDENCIES.md               # Document dependency graph & impact analysis
├── AI_CONTEXT.md                 # AI system onboarding & protocol
├── README_FOR_AI.md              # AI operational manual
├── PROJECT_INDEX.md              # Detailed navigation map
├── README.md                     # Human-facing project entry point
├── CHANGELOG.md                  # Semantic versioning changelog
├── FREEZE_MODULE_PROMPT.md       # Release management freeze prompt template
│
├── docs/
│   ├── PROJECT_MANIFEST.md       # [THIS FILE] Canonical repository manifest
│   ├── CURRENT_STATE.md          # Real-time operational state & blockers
│   ├── TRACEABILITY.md           # Decision traceability matrix (Phase -> ADR -> Evidence)
│   ├── brand/                    # Brand Strategy & Brand Book v1.0 / v2.0
│   │   ├── 00_PROJECT_STATUS.md  # Workshop phase tracker
│   │   ├── 01_BRAND_BOOK.md      # Master Enterprise Brand Book (v2.0)
│   │   ├── 02_WORKSHOP_TRANSCRIPT.md # Historical Q&A transcript (Phases 1-19)
│   │   ├── 03_DECISIONS.md      # Locked Brand Decisions (BRAND-001..021)
│   │   ├── 04_OPEN_ITEMS.md     # Risk register & open assumptions
│   │   ├── 05_MASTER_REVIEW.md   # Independent QA audit scorecard (92/100)
│   │   ├── 06_BRAND_MEMORY.md    # Consolidated Brand DNA summary
│   │   ├── 07_SESSION_HANDOFF.md # Brand session continuity log
│   │   └── v1.0/                 # Canonical Brand Book versions archive (v1.0, v2.0)
│   ├── architecture/
│   │   └── adr/                  # Architecture Decision Records (ADR-001..006 Locked, ADR-007 Draft)
│   ├── change_requests/          # Change Request System (CR-001..)
│   ├── context/
│   │   └── AI_CONTEXT.md         # 2-Page concise AI onboarding context
│   ├── project/                  # Governance, workflow, rules, charter, glossary
│   ├── design/                   # Visual identity & design system specifications
│   └── archive/                  # Historical superseded documents archive
│
├── research/                     # Knowledge base & Research database
│   ├── easyorders/               # Easy Orders platform research (RS-01A..RS-06)
│   ├── reference/                # Reusable technical lookup reference library
│   ├── competitors/              # Competitor analysis database
│   ├── customer-interviews/      # Founder & customer interview transcripts
│   ├── market-data/              # Market research, pricing & demographic data
│   ├── personas/                 # Detailed customer persona profiles
│   ├── surveys/                  # Quantitative & qualitative surveys
│   ├── sources/                  # Raw evidence files & external documentation
│   ├── website-audit/            # UX/CRO site audit evidence
│   └── templates/                # Research session templates (v2.2.0)
│
├── specs/                        # Technical & UI specifications (scaffolded)
├── theme/                        # Easy Orders custom theme source code
└── tools/                        # Audit toolkits and automation scripts
```

---

## 3. Mandatory Reading Order

To prevent cognitive overload, contributors must read documentation in this exact order:

1. 📄 [`docs/context/AI_CONTEXT.md`](./context/AI_CONTEXT.md) *(or root `SESSION_HANDOFF.md`)* — 2-minute fast orientation
2. 📄 [`docs/CURRENT_STATE.md`](./CURRENT_STATE.md) — Active phase, sprint priorities, blockers
3. 📄 [`docs/project/PROJECT_RULES.md`](./project/PROJECT_RULES.md) — Non-negotiable operational principles
4. 📄 [`docs/brand/06_BRAND_MEMORY.md`](./brand/06_BRAND_MEMORY.md) — Consolidated Brand DNA
5. 📄 [`docs/brand/03_DECISIONS.md`](./brand/03_DECISIONS.md) — Locked brand decisions
6. 📄 [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) — Canonical Enterprise Brand Book

---

## 4. Document Priority & Authority Hierarchy

| Level | Document Type | Canonical Source | Authority Level |
| :---: | :--- | :--- | :--- |
| **Tier 1** | Brand Constitution | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) | **Immutable** (Founder approval required) |
| **Tier 1** | Locked Brand Ledger | [`docs/brand/03_DECISIONS.md`](./brand/03_DECISIONS.md) | **Immutable** (BRAND-001..021 locked) |
| **Tier 2** | Architecture Decisions | [`docs/architecture/adr/`](./architecture/adr/) | **Binding** (Requires Change Request CR to alter) |
| **Tier 2** | Project Governance | [`docs/project/PROJECT_RULES.md`](./project/PROJECT_RULES.md) | **Binding** |
| **Tier 3** | Operational State | [`docs/CURRENT_STATE.md`](./CURRENT_STATE.md) | **Living Document** (Updated per sprint) |
| **Tier 4** | Research Base | [`research/`](../research/) | **Informational** (Evidence base) |

---

## 5. Archive & Deprecation Policy

1. **Zero Information Loss:** Knowledge is never permanently deleted.
2. **Superceded Files:** When a file is superseded by a newer version, it is moved to `docs/archive/`.
3. **Archival Metadata Header:** Every archived file must contain a header banner indicating:
   - Date Archived
   - Superseded By (Link to active file)
   - Reason for Archival

---

## Related Documents

### Depends On
- [`INDEX.md`](../INDEX.md)
- [`DOCUMENT_MAP.md`](../DOCUMENT_MAP.md)

### Related
- [`docs/CURRENT_STATE.md`](./CURRENT_STATE.md)
- [`docs/TRACEABILITY.md`](./TRACEABILITY.md)

### Referenced By
- [`README.md`](../README.md)
- [`AI_CONTEXT.md`](../AI_CONTEXT.md)
