# Raghad Commerce Platform (RCP)

Version: 2.5.0
Status: Active
Owner: Product Architect
Last Updated: 2026-08-10

---

## Purpose

This repository is the single source of truth for the **رغد | Raghad** e-commerce platform — a curated multi-pillar lifestyle brand (Kids, Home, Bridal) for Egyptian women, built on the Easy Orders platform.

It hosts all project governance, brand strategy, technical research, architectural decisions, design specifications, and (eventually) theme source code.

---

## Current Project Status

- **Current Phase:** Visual Identity & Design System Execution
- **Brand Strategy:** ✅ 100% Completed (19/19 phases approved — Audit Score: 92/100)
- **Platform Research:** ✅ Completed (RS-01A through RS-06)
- **Live Store:** [`raghadkids.com`](https://raghadkids.com) — operational on Easy Orders (see [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md) §2)
- **Implementation Status:** No theme code has been written in this repository yet.
- **Real-time operational state:** [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)

---

## Brand Identity Quick Reference

| Attribute | Value |
| :--- | :--- |
| **Master Brand Name** | رغد \| Raghad |
| **Domain** | `raghadworld.com` |
| **Tagline** | *"رغد... هتشتري وأنتي مغمضة"* |
| **Pillars** | Raghad Kids · Raghad Home · Raghad Bridal |
| **Architecture** | Monolithic Branded House |
| **Primary Color** | `#D48C80` (Warm Terracotta) |
| **Secondary Color** | `#2C2230` (Slate Plum) |
| **Archetype** | The Wise Older Sister (الأخت الكبرى الخبيرة) |

---

## Documentation-First & Governance Principles

- **Strategy before Design** → **Design before Code** → **Documentation before Implementation**
- **Evidence over Opinions**: Every decision is backed by research and founder validation.
- **Framework Freeze (DEC-0007)**: Governance frameworks are frozen for stability.
- **Task Completion Protocol (TCP) & Repository Validation Gate**: Every task requires impact assessment and integrity check.

---

## Core Navigation

### Brand Strategy (`docs/brand/`)


The complete brand strategy DNA — fully approved, founder-validated, audit score 92/100.

| File | Purpose |
| :--- | :--- |
| [`00_PROJECT_STATUS.md`](docs/brand/00_PROJECT_STATUS.md) | Workshop completion status & phase milestones |
| [`01_BRAND_BOOK.md`](docs/brand/01_BRAND_BOOK.md) | **Enterprise Brand Book** — official master reference |
| [`02_WORKSHOP_TRANSCRIPT.md`](docs/brand/02_WORKSHOP_TRANSCRIPT.md) | Full Q&A transcript for all 19 phases |
| [`03_DECISIONS.md`](docs/brand/03_DECISIONS.md) | Locked brand decisions (BRAND-001 to BRAND-021) |
| [`04_OPEN_ITEMS.md`](docs/brand/04_OPEN_ITEMS.md) | Active assumptions, risks, open questions |
| [`05_MASTER_REVIEW.md`](docs/brand/05_MASTER_REVIEW.md) | Independent QA audit scorecard |
| [`06_BRAND_MEMORY.md`](docs/brand/06_BRAND_MEMORY.md) | Permanent brand DNA summary (best quick-read) |
| [`07_SESSION_HANDOFF.md`](docs/brand/07_SESSION_HANDOFF.md) | Session continuity & next-step guide |

### Governance & Project Operations (`docs/project/`)

| File | Purpose |
| :--- | :--- |
| [`PROJECT_CONTEXT.md`](docs/project/PROJECT_CONTEXT.md) | Business vision, philosophy, target audience |
| [`PROJECT_STATE.md`](docs/project/PROJECT_STATE.md) | Sprint governance summary (defers to [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)) |
| [`PROJECT_DECISIONS.md`](docs/project/PROJECT_DECISIONS.md) | Infrastructure/governance decisions (DEC-0001–DEC-0008) |
| [`PROJECT_RULES.md`](docs/project/PROJECT_RULES.md) | Non-negotiable principles for all contributors |
| [`PROJECT_WORKFLOW.md`](docs/project/PROJECT_WORKFLOW.md) | Feature lifecycle & Task Completion Protocol |
| [`RESEARCH_STANDARDS.md`](docs/project/RESEARCH_STANDARDS.md) | Research governance rules & Definition of Done |
| [`AI_TEAM_RULES.md`](docs/project/AI_TEAM_RULES.md) | AI assistant roles, checklists, boundaries |
| [`DOCUMENTATION_STANDARDS.md`](docs/project/DOCUMENTATION_STANDARDS.md) | Documentation creation & maintenance standards |

### Research & Knowledge Base (`research/`)

| Location | Purpose |
| :--- | :--- |
| [`research/INDEX.md`](research/INDEX.md) | Central navigation for all research domains |
| [`research/KNOWLEDGE_INDEX.md`](research/KNOWLEDGE_INDEX.md) | Knowledge Management System (KMS) |
| [`research/SUMMARY.md`](research/SUMMARY.md) | Synthesis of Easy Orders platform research |
| [`research/reference/`](research/reference/) | Reusable lookup: theme vars, events, Liquid objects |
| [`research/easyorders/`](research/easyorders/) | Approved research sessions (RS-01A through RS-06) |
| [`research/branding/`](research/branding/) | Brand research (pending) |
| [`research/competitors/`](research/competitors/) | Competitor analysis (pending) |
| [`research/market/`](research/market/) | Market research (pending) |
| [`research/website-audit/`](research/website-audit/) | UX/CRO website audit evidence |

---

## Repository Structure

```text
raghad-commerce-platform/
├── AI_CONTEXT.md               # AI system entry point & protocol
├── README_FOR_AI.md            # AI execution manual
├── README.md                   # [This file] Human-facing overview
├── CHANGELOG.md                # Semantic version history
├── FREEZE_MODULE_PROMPT.md     # Release management freeze prompt template
├── docs/
│   ├── brand/              # Complete brand strategy (8 canonical files)
│   ├── project/            # Governance, workflow, rules, state, decisions
│   ├── design/             # Visual identity & design system specs (scaffolded)
│   └── archive/            # Historical archive (preserved, never deleted)
├── research/               # Platform research, KMS, Reference Library
│   ├── easyorders/         # Easy Orders research sessions (RS-01A to RS-06)
│   ├── reference/          # Approved Reference Library lookup documents
│   ├── templates/          # SESSION_TEMPLATE v2.2.0
│   ├── branding/           # Brand research (pending)
│   ├── competitors/        # Competitor analysis (pending)
│   ├── market/             # Market research (pending)
│   └── website-audit/      # UX/CRO audit evidence
├── specs/                  # Architectural & UI specifications (scaffolded)
├── theme/                  # Easy Orders Custom Theme source code (scaffolded)
└── tools/                  # Project tooling and scripts (scaffolded)
```

---

## Archive Policy

The `docs/archive/` directory preserves all historical documents that have been superseded by newer, consolidated versions. Nothing is ever permanently deleted — it is archived with context.

---

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a version history of project changes.
