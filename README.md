# Raghad Commerce Platform (RCP)

Version: 1.1.0  
Status: Active  
Owner: Product Architect  
Last Updated: 30-07-2026  

---

## Purpose

This repository is the single source of truth for the **Raghad World** e-commerce platform custom theme for Easy Orders. It hosts all project governance, business strategy, technical research, architectural decisions, design specifications, and theme code.

---

## Current Project Status

- **Current Phase:** Initialization / Strategy & Research
- **Current Sprint:** Sprint 2 (Research Infrastructure & Platform Research)
- **Research Status:** Easy Orders platform research completed through **RS-06**.
- **Implementation Status:** No code or theme implementation has started. All work remains strictly in the strategy and research phases.

---

## Documentation-First & Governance Principles

The project enforces a strict **Documentation-First Methodology**:
- **Strategy before Design**: Business objectives and brand trust drive all decisions.
- **Design before Code**: Complete UX/UI and component specifications before coding.
- **Documentation before Implementation**: No implementation begins without approved research and specifications.
- **Framework Freeze (DEC-0007)**: The governance and workflow frameworks are frozen to ensure stability.
- **Task Completion Protocol (TCP) & Repository Validation Gate**: Every task undergoes mandatory impact assessment, synchronization, and integrity checks.

---

## Core Navigation & Documentation Map

### Governance & Project Operations (`docs/project/`)
- [Project Context](docs/project/PROJECT_CONTEXT.md): Business vision, brand trust philosophy, and target audience.
- [Project Rules](docs/project/PROJECT_RULES.md): Non-negotiable principles for human and AI contributors.
- [Project Workflow](docs/project/PROJECT_WORKFLOW.md): Step-by-step feature lifecycle, Task Completion Protocol, and Repository Validation Gate.
- [Project State](docs/project/PROJECT_STATE.md): Active sprint, phase tracking, and completed research sessions.
- [Project Decisions](docs/project/PROJECT_DECISIONS.md): Canonical ledger of all approved decisions (DEC-0001 through DEC-0008).
- [Research Standards](docs/project/RESEARCH_STANDARDS.md): Governance rules, Definition of Research Done, and template standards.
- [AI Team Rules](docs/project/AI_TEAM_RULES.md): Execution checklists and role boundaries for AI assistants.
- [Documentation Standards](docs/project/DOCUMENTATION_STANDARDS.md): Standards for creating and maintaining project knowledge.

### Research & Knowledge Base (`research/`)
- [Research Index](research/INDEX.md): Central navigation for all research domains.
- [Knowledge Index](research/KNOWLEDGE_INDEX.md): Core Knowledge Management System (KMS) mapping reusable knowledge across sessions.
- [Executive Research Summary](research/SUMMARY.md): Architectural synthesis of Easy Orders platform research (RS-01A through RS-06).
- [Reference Library System (RLS)](research/reference/): Derived lookup documents (`THEME_VARIABLES_REFERENCE.md`, `EVENTS_REFERENCE.md`, `STANDARD_IDS_REFERENCE.md`, `LIQUID_OBJECTS_REFERENCE.md`).
- [Easy Orders Research Sessions](research/easyorders/): Approved research sessions (`RS-01A` through `RS-06`).

---

## Repository Structure

```text
raghad-commerce-platform
├── docs/                 # Governance, rules, workflow, state, and decisions
├── prompts/              # AI collaboration system and bootstrap rules
├── research/             # Knowledge base, research sessions, KMS, and Reference Library
│   ├── reference/        # Approved Reference Library lookup documents
│   ├── templates/        # SESSION_TEMPLATE v2.2.0
│   ├── easyorders/       # Easy Orders platform research sessions (RS-01A to RS-06)
│   ├── branding/         # Brand strategy research (Pending)
│   ├── competitors/      # Competitor analysis (Pending)
│   ├── market/           # Market research (Pending)
│   └── website-audit/    # UX/CRO Website Audit (Pending)
├── specs/                # Architectural and UI specifications (Scaffolded)
├── theme/                # Easy Orders Custom Theme source code (Scaffolded)
└── tools/                # Project tooling and scripts (Scaffolded)
```
