> **⚠️ ARCHIVED — 2026-08-10 (v2.5.0 meta-documentation consolidation).**
> This document is preserved for historical reference and is NO LONGER MAINTAINED.
> Canonical sources: navigation → `README.md` · AI entry → `AI_CONTEXT.md` ·
> state → `docs/CURRENT_STATE.md` · decisions → `docs/brand/03_DECISIONS.md` and
> `docs/project/PROJECT_DECISIONS.md`.

# DECISION_TREE.md — Raghad Commerce Platform: Strategic Decision Map

**Version:** 1.0.0  
**Last Updated:** 2026-08-03  
**Owner:** Product Architect

> Visual map of all strategic decisions made across the project. Decisions are grouped by domain and linked to their canonical source documents.

---

## 1. Brand Strategy Decision Tree (BRAND-001 to BRAND-021)

All 21 brand decisions are **LOCKED & IMMUTABLE**. Canonical source: [`docs/brand/03_DECISIONS.md`](./docs/brand/03_DECISIONS.md)

```
Business Foundation
│
├── BRAND-001: Zero-Based Rebrand
│   └── Rationale: Original technical draft scored 24/100 — unusable as brand foundation
│
├── BRAND-002: Multi-Pillar Strategy (Kids + Home + Bridal)
│   └── Rationale: Direct import moat in Mit El-Khouli → higher LTV, lower CAC
│
└── BRAND-003: Strict Founder Curation Right
    └── Rationale: Protect brand equity; Neoflam quality tier as baseline standard

Brand Purpose & Strategy
│
├── BRAND-005: Brand Purpose Approved
│   └── Outcome: "Safe haven eliminating online deception for Egyptian women"
│
├── BRAND-006: Brand Vision Approved (7-Year)
│   └── Outcome: "#1 trusted e-commerce + showrooms; Golden Standard of Transparency"
│
└── BRAND-007: Brand Mission Approved
    └── Outcome: "Practical curation + HD Real Photos + Pre-shipment QC"

Audience & Customer Psychology
│
├── BRAND-009: Dual-Persona Target Approved
│   ├── Persona 1: Young Mother (20–30 yrs) → Raghad Kids
│   └── Persona 2: Bride-to-be + Her Mother (18–27 yrs) → Raghad Bridal/Home
│
├── BRAND-008: Core Values Framework (4 Pillars)
│   ├── 1. Absolute Transparency
│   ├── 2. Full Accountability
│   ├── 3. Expert Curation
│   └── 4. Safety & Peace of Mind
│
└── BRAND-010: Risk Reversal Conversion Framework
    ├── Step 1: 100% Pre-payment Doorstep Inspection
    ├── Step 2: HD Real Video Clips (10-sec, unedited)
    └── Step 3: Free 48-Hour Replacement Guarantee

Competitive Positioning
│
├── BRAND-011: Competitive Counter-Strike Matrix
│   ├── vs. Drop-shippers (Amazon/Noon/Tajir) → Pre-payment inspection
│   ├── vs. AI-visual stores (Raya Store) → HD Real product videos
│   └── vs. Discount outlets (Raneen) → Expert curation (Neoflam standard)
│
├── BRAND-012: Positioning Statements
│   ├── Word-of-Mouth: "The only place you buy with your eyes closed"
│   └── Corporate: "Egypt's #1 platform for authentic product guarantee + curated quality"
│
└── BRAND-014: Unique Value Proposition (3-Pillar UVP)
    ├── Pillar 1: Expert Curation (Neoflam/Chicco quality standard)
    ├── Pillar 2: Fair Pricing (direct factory sourcing from Mit El-Khouli)
    └── Pillar 3: Zero-Risk Experience (inspection + HD video + free replacement)

Brand Identity & Voice
│
├── BRAND-013: Master Brand Name & Tagline
│   ├── Name: رغد | Raghad
│   └── Tagline: "رغد... هتشتري وأنتي مغمضة"
│
├── BRAND-015: Brand Archetype
│   └── "The Wise Older Sister" (الأخت الكبرى الخبيرة والموثوقة)
│
├── BRAND-016: Brand Voice & Linguistic Rules
│   ├── Warm + Refined + Honest + Contemporary Egyptian
│   ├── ✅ DO: Respectful terms ("نورتينا", "بيتك وزوجيتك")
│   └── ❌ DON'T: Cheap urgency, fake discounts, AI-generated images
│
├── BRAND-017: Conversational Origin Story (3-paragraph Egyptian narrative)
│
├── BRAND-018: Sub-Pillar Messaging Headlines
│   ├── Raghad Kids: "لأن أمان طفلك مش مجال للتجربة"
│   ├── Raghad Home: "بيتك شيك وخامته تعيش العمر"
│   └── Raghad Bridal: "تجهيز بيتك من غير ما تلفي ولا تحتاري"
│
└── BRAND-004: Real Product Media Mandate
    └── Zero AI-generated visuals. 100% real photography & unedited HD video.

Brand Architecture & Identity
│
├── BRAND-019: Naming & Domain Strategy
│   ├── Primary Domain: raghadworld.com
│   └── Country TLD: raghad.eg (pending commercial register)
│
├── BRAND-020: Monolithic Branded House Model
│   └── 1 master brand / 1 domain / 1 cart / 1 WhatsApp support
│
└── BRAND-021: Identity Strategy & Visual Directives
    ├── Primary: #D48C80 (Warm Terracotta)
    ├── Secondary: #2C2230 (Slate Plum)
    ├── Surface: #FAFAFA (Warm Silk White)
    ├── Trust: #10B981 (Forest Emerald)
    ├── Deposit Alert: #F59E0B (Amber Gold)
    └── Typography: Cairo (Google Fonts) — Bold 700/800 headings, Medium 500 body
```

---

## 2. Project & Technical Decision Tree (TECH/OPS-0001 to 0008)

All 8 governance decisions are **APPROVED & IMPLEMENTED**. Canonical source: [`docs/project/PROJECT_DECISIONS.md`](./docs/project/PROJECT_DECISIONS.md)

```
Architecture Decisions
│
├── TECH-0001: Repository Architecture RFC v2 Implementation
│   └── Outcome: State/decisions/ADR template structure approved
│
├── TECH-0005: Knowledge Management System (KMS)
│   └── Outcome: KNOWLEDGE_INDEX.md governs all research session tracking
│
├── TECH-0006: Reference Library System (RLS)
│   └── Outcome: Reusable reference documents in research/reference/
│
└── ADR-007: Social Media Channel Architecture
    └── Outcome: Unified Facebook Page recommended over per-pillar pages

Governance Decisions
│
├── OPS-0002: Foundation Refinement After External Review
├── OPS-0003: Sprint 2 Research Governance Update
├── OPS-0004: Sprint 2 Template & Standards Enhancement
├── OPS-0007: Governance Finalization & Framework Freeze
│   └── Rule: No new governance layers without demonstrated operational problem
│
└── OPS-0008: Sprint 2 Framework Refinement v2.2
    └── Outcome: SESSION_TEMPLATE v2.2.0 & RESEARCH_STANDARDS refined
```

---

## 3. Decision Status Legend

| Symbol | Meaning |
| :--- | :--- |
| 🔒 **LOCKED** | Immutable. No change without explicit Business Owner instruction. |
| ✅ **APPROVED** | Approved and implemented. |
| 🔵 **ACTIVE** | Currently being executed. |
| ⏳ **PENDING** | Awaiting future phase. |
| ⚠️ **MONITORED** | Open assumption or risk under active monitoring. |

---

## 4. Decision Authority Map

| Decision Type | Who Can Propose | Who Must Approve |
| :--- | :--- | :--- |
| Brand strategy (BRAND-XXX) | Any team member | Business Owner (Founder) |
| Technical architecture (TECH-XXX) | Product Architect | Business Owner |
| Governance (OPS-XXX) | Product Architect | Business Owner |
| Design system (DESIGN-XXX) | Designer / Product Architect | Business Owner |
| Research standards (OPS-XXX) | Documentation Owner | Product Architect |
