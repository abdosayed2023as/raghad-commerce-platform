# AI System Context & Protocol (`AI_CONTEXT.md`)

**Repository:** Raghad Commerce Platform (`raghad-commerce-platform`)  
**Master Brand:** رغد | Raghad  
**Primary Domain:** `raghadworld.com`  
**Current Version:** 2.2.0  
**Last Updated:** 2026-08-03  

---

## 1. Executive Project Overview

**Raghad Commerce Platform (RCP)** is the enterprise e-commerce platform for **رغد | Raghad** — a premium, high-trust Egyptian lifestyle brand spanning three core pillars:
1. **👶 رغد كيدز (Raghad Kids):** Newborn care & infant gear (0–3 years).
2. **🏠 رغد هوم (Raghad Home):** Premium cookware (Neoflam standard) & home organization.
3. **👰 رغد العروسة (Raghad Bridal):** Trousseau bundles & wedding prep essentials.

The business model leverages a direct factory supply moat in **Mit El-Khouli Abdalla (Damietta)** for lowest market COGS, paired with a 3-step Risk Reversal conversion framework (**100% Pre-payment inspection + HD Real Video Clips + Free 48-hr replacement guarantee**).

---

## 2. Current Project Phase & Active Priorities

- **Current Active Phase:** **Visual Identity & Design System Execution**
- **Completed Phases:**
  - ✅ **Platform Research:** Easy Orders platform architecture (RS-01A through RS-06).
  - ✅ **Brand Strategy Discovery:** 19/19 phases 100% approved by founder (Audit Score: 92/100).
  - ✅ **Repository Architecture Refactor:** Single Source of Truth architecture enforced.
- **Current Active Priorities:**
  1. Generate Logo & Visual Identity Design Tokens (Colors, Typography, UI Components).
  2. Create design specifications in `docs/design/`.
  3. Prepare Easy Orders custom theme specifications before coding.

---

## 3. Mandatory Reading Order for New AI Sessions

Any AI assistant or contributor joining this project MUST consume documents in this strict sequence:

1. 📄 [`AI_CONTEXT.md`](./AI_CONTEXT.md) *(This file — instant onboarding)*
2. 📄 [`README_FOR_AI.md`](./README_FOR_AI.md) *(AI execution guidelines & rules)*
3. 📄 [`docs/project/PROJECT_STATE.md`](./docs/project/PROJECT_STATE.md) *(Current sprint & roadmap)*
4. 📄 [`docs/project/PROJECT_RULES.md`](./docs/project/PROJECT_RULES.md) *(Non-negotiable engineering & business rules)*
5. 📄 [`docs/brand/06_BRAND_MEMORY.md`](./docs/brand/06_BRAND_MEMORY.md) *(Consolidated Brand DNA & Memory)*
6. 📄 [`docs/brand/03_DECISIONS.md`](./docs/brand/03_DECISIONS.md) *(Locked brand strategy decisions DEC-001..021)*
7. 📄 [`docs/brand/01_BRAND_BOOK.md`](./docs/brand/01_BRAND_BOOK.md) *(Official Enterprise Brand Book)*

---

## 4. Locked Decisions & Core DNA (DO NOT ALTER)

The following core decisions are **LOCKED and IMMUTABLE**. No AI assistant may modify or challenge these without explicit written instruction from the Business Owner:

| ID | Topic | Locked Value | Canonical Owner |
| :--- | :--- | :--- | :--- |
| **BRAND-011** | Master Brand Name | **رغد \| Raghad** | [`docs/brand/03_DECISIONS.md`](./docs/brand/03_DECISIONS.md) |
| **BRAND-011** | Main Tagline | *"رغد... هتشتري وأنتي مغمضة"* | [`docs/brand/01_BRAND_BOOK.md`](./docs/brand/01_BRAND_BOOK.md) |
| **BRAND-017** | Commercial Domain | `raghadworld.com` (Country TLD: `raghad.eg`) | [`docs/brand/06_BRAND_MEMORY.md`](./docs/brand/06_BRAND_MEMORY.md) |
| **BRAND-018** | Architecture Model | Monolithic Branded House (1 site, 1 cart, 3 pillars) | [`docs/brand/01_BRAND_BOOK.md`](./docs/brand/01_BRAND_BOOK.md) |
| **BRAND-013** | Brand Archetype | The Wise Older Sister (الأخت الكبرى الخبيرة) | [`docs/brand/06_BRAND_MEMORY.md`](./docs/brand/06_BRAND_MEMORY.md) |
| **BRAND-004** | Media Mandate | 100% Real product photo & HD video clips (Zero AI deception) | [`docs/brand/03_DECISIONS.md`](./docs/brand/03_DECISIONS.md) |
| **BRAND-010** | Risk Reversal | Pre-payment physical doorstep inspection guarantee | [`docs/brand/01_BRAND_BOOK.md`](./docs/brand/01_BRAND_BOOK.md) |

---

## 5. Things an AI Assistant Must NEVER Do

> [!CAUTION]
> **Strict Boundaries for AI Execution:**
> 1. **NEVER modify approved brand decisions, vision, mission, core values, or voice.**
> 2. **NEVER fabricate user answers, workshop results, or test outcomes.**
> 3. **NEVER delete historical knowledge** — archive superseded files in `docs/archive/`.
> 4. **NEVER introduce duplicate files or conflicting definitions of the same concept.**
> 5. **NEVER start writing frontend code or liquid templates** before design specifications are written and approved.

---

## 6. Repository Architecture Overview

```text
raghad-commerce-platform/
├── INDEX.md                    # Master repository navigation (START HERE)
├── SESSION_HANDOFF.md          # AI-optimized 60-second project orientation
├── DOCUMENT_MAP.md             # Document relationship & ownership map
├── DECISION_TREE.md            # Visual map of all strategic decisions
├── DEPENDENCIES.md             # Document dependency graph
├── AI_CONTEXT.md               # [THIS FILE] AI onboarding & core protocol
├── README_FOR_AI.md            # AI execution guidelines, reading order & policies
├── PROJECT_INDEX.md            # Complete navigation map for all repository docs
├── README.md                   # Human-facing project overview
├── CHANGELOG.md                # Semantic versioning changelog
├── docs/
│   ├── brand/                  # Authoritative brand strategy (8 canonical files)
│   ├── project/                # Project governance, rules, state & decisions
│   ├── design/                 # Visual identity & design system specifications (scaffolded)
│   └── archive/                # Historical archive (preserved, never deleted)
├── research/                   # Platform research, KMS & Reference Library (RLS)
├── specs/                      # Architectural & UI specs (scaffolded)
└── theme/                      # Easy Orders custom theme code (scaffolded)
```
