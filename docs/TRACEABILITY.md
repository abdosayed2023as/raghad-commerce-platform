# Strategic Decision Traceability Matrix (`docs/TRACEABILITY.md`)

**Version:** 1.0.0  
**Last Updated:** 2026-08-03  
**Owner:** Product Architect & Business Owner  

> This matrix provides 100% end-to-end traceability for every strategic decision in the project — mapping decisions back to their origin phase, founder evidence, canonical documentation, and related Architecture Decision Records (ADRs).

---

## 1. Brand Strategy Decision Matrix (BRAND-001 to BRAND-021)

| Decision ID | Decision Title | Origin Phase | Empirical Evidence & Founder Rationale | Supporting Document | Related ADR | Status |
| :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| **BRAND-001** | Zero-Based Rebrand | Phase 01 | Legacy technical draft scored 24/100; failed brand purpose audit | [`docs/brand/05_MASTER_REVIEW.md`](./brand/05_MASTER_REVIEW.md) | - | Locked |
| **BRAND-002** | Multi-Pillar Model (Kids, Home, Bridal) | Phase 01 | Sourcing partnership in Mit El-Khouli (Damietta) lowers COGS and boosts LTV | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §9 | [`ADR-001`](./architecture/adr/ADR-001_BRANDED_HOUSE.md) | Locked |
| **BRAND-003** | Strict Founder Curation Right | Phase 01 | Founder veto right prevents cheap general reseller perception (Neoflam standard) | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §3 | - | Locked |
| **BRAND-004** | 100% Real Product Media Mandate | Phase 02 | Deceptive AI mockups & filters erode customer trust in Egyptian e-commerce | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §3 | [`ADR-005`](./architecture/adr/ADR-005_PHOTOGRAPHY_POLICY.md) | Locked |
| **BRAND-005** | Strategic Brand Purpose Approved | Phase 03 | Need safe haven eliminating online fear of scams for Egyptian women | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §1 | - | Locked |
| **BRAND-006** | 7-Year Strategic Vision Approved | Phase 04 | Goal to become #1 trusted platform + omnichannel experience showrooms | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §2 | [`ADR-006`](./architecture/adr/ADR-006_OMNICHANNEL_STRATEGY.md) | Locked |
| **BRAND-007** | Operational Mission Approved | Phase 05 | Commitments across Practical Curation, HD Real Photos, and Pre-shipment QC | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §3 | - | Locked |
| **BRAND-008** | Core Values Framework Approved | Phase 06 | 4 non-negotiables: Transparency, Accountability, Curation, Peace of Mind | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §4 | - | Locked |
| **BRAND-009** | Dual Target Personas Approved | Phase 07 | Young Mother (20-30) & Bride with Mother (18-27) lifecycle purchasing dynamics | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §5 | - | Locked |
| **BRAND-010** | Risk Reversal Conversion Framework | Phase 08 | 3-step shield: Pre-payment doorstep inspection, HD videos, 48hr replacement | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §6 | [`ADR-004`](./architecture/adr/ADR-004_TAGLINE.md) | Locked |
| **BRAND-011** | Competitive Counter-Strike Matrix | Phase 09 | Vulnerability analysis vs Amazon/Noon, Raya Store, and Raneen | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §7 | - | Locked |
| **BRAND-012** | Positioning Statements Approved | Phase 10 | Word-of-mouth: *"اشتري وأنتي مغمضة"* / Corporate: Egypt's #1 trusted platform | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §8 | - | Locked |
| **BRAND-013** | Master Brand Name & Tagline | Phase 11 | Name "رغد | Raghad" & Tagline *"رغد... هتشتري وأنتي مغمضة"* | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §10 | [`ADR-002`](./architecture/adr/ADR-002_BRAND_NAME.md), [`ADR-004`](./architecture/adr/ADR-004_TAGLINE.md) | Locked |
| **BRAND-014** | Unique Value Proposition (UVP) | Phase 12 | Formula: [Curation + Sourcing Moat + Risk Reversal] | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §11 | - | Locked |
| **BRAND-015** | Brand Archetype Approved | Phase 13 | "The Wise Older Sister" (الأخت الكبرى الخبيرة والموثوقة) | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §12 | - | Locked |
| **BRAND-016** | Brand Voice & Linguistic Rules | Phase 14 | Warm, Refined, Honest, Contemporary Egyptian Arabic (*عامية فاخرة*) | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §12 | - | Locked |
| **BRAND-017** | Origin Story Approved | Phase 15 | 3-paragraph conversational Egyptian storytelling narrative | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §13 | - | Locked |
| **BRAND-018** | Sub-Pillar Messaging Headlines | Phase 16 | Campaign headlines & copy angles for Kids, Home, and Bridal | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §14 | - | Locked |
| **BRAND-019** | Domain Strategy Approved | Phase 17 | Primary domain `raghadworld.com` & TLD `raghad.eg` | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §1 | [`ADR-003`](./architecture/adr/ADR-003_DOMAIN.md) | Locked |
| **BRAND-020** | Monolithic Branded House Model | Phase 18 | 1 master brand, 1 domain, 1 cart, 1 WhatsApp line | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §9 | [`ADR-001`](./architecture/adr/ADR-001_BRANDED_HOUSE.md) | Locked |
| **BRAND-021** | Identity Strategy & Visual Directives | Phase 19 | Primary `#D48C80`, Secondary `#2C2230`, Canvas `#FAFAFA`, Font Cairo | [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md) §15 | - | Locked |

---

## 2. Project Governance & Technical Decisions (TECH/OPS-0001 to 0008)

| Decision ID | Category | Title | Supporting Document | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TECH-0001** | Architecture | Repository Architecture RFC v2 Implementation | [`docs/project/PROJECT_DECISIONS.md`](./project/PROJECT_DECISIONS.md) | Approved |
| **OPS-0002** | Governance | Foundation Refinement After External Review | [`docs/project/PROJECT_DECISIONS.md`](./project/PROJECT_DECISIONS.md) | Approved |
| **OPS-0003** | Governance | Sprint 2 Research Governance Update | [`docs/project/PROJECT_DECISIONS.md`](./project/PROJECT_DECISIONS.md) | Approved |
| **OPS-0004** | Standards | Sprint 2 Template & Standards Enhancement | [`docs/project/PROJECT_DECISIONS.md`](./project/PROJECT_DECISIONS.md) | Approved |
| **TECH-0005** | Knowledge | Knowledge Management System (KMS) | [`research/KNOWLEDGE_INDEX.md`](../research/KNOWLEDGE_INDEX.md) | Approved |
| **TECH-0006** | Architecture | Reference Library System (RLS) | [`research/reference/`](../research/reference/) | Approved |
| **OPS-0007** | Governance | Governance Finalization & Framework Freeze | [`docs/project/PROJECT_RULES.md`](./project/PROJECT_RULES.md) | Approved |
| **OPS-0008** | Standards | Framework Refinement v2.2 | [`research/templates/`](../research/templates/) | Approved |
| **ADR-007** | Brand/Channel | Social Media Channel Architecture | [`docs/architecture/adr/ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md`](./architecture/adr/ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md) | Locked |

---

## Related Documents

- **Brand Book:** [`docs/brand/01_BRAND_BOOK.md`](./brand/01_BRAND_BOOK.md)
- **Decision Trees:** [`DECISION_TREE.md`](../DECISION_TREE.md)
- **Architecture Records:** [`docs/architecture/adr/`](./architecture/adr/)
