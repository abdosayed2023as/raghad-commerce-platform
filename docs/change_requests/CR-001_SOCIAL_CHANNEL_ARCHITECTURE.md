# CR-001: Social Media Channel Architecture

**CR Identifier:** CR-001
**Title:** Unified vs. Per-Pillar Facebook Page Strategy
**Target Document / Decision:** `docs/architecture/adr/ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md` / BRAND-020 (extension)
**Proposer Role:** Chief Brand Strategist / Quality Gate (Claude)
**Date Submitted:** 2026-08-08
**Status:** Implemented

---

## 1. Problem Statement & Context

BRAND-020 locks domain/cart/support-line unification but is silent on social media channel structure. As Raghad Home and Raghad Bridal move toward launch, the team needs an explicit, documented answer to whether each pillar gets a dedicated Facebook Page or all three operate under one master-brand Page — before content and ad operations begin, since switching later is costly (lost page history and social proof).

## 2. Proposed Change

Add `ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md`, recommending one unified Facebook Page for رغد | Raghad, with pillar-level differentiation handled through content categorization and Meta ad-set targeting rather than separate Pages. Full analysis in ADR-007.

## 3. Impact Assessment

- **Brand Strategy Impact:** Extends BRAND-020's Branded House logic to a channel it didn't explicitly cover. Does not alter any locked brand decision content.
- **Technical Architecture Impact:** None — no theme, domain, or cart changes.
- **Operational & Cost Impact:** Keeps community management and ad spend consolidated under one team/one budget at current team size, versus fragmenting across three Pages.
- **Risk Assessment:** Primary risk is reduced organic reach from mixed-topic content on one Page (Meta's topical relevance signal); mitigated by content categorization and monitored via engagement-rate tracking. See ADR-007 "Reversal Triggers" for when to revisit.

## 4. Decision & Approval Record

- **Reviewer:** Business Owner
- **Decision Verdict:** Approved
- **Approval Date:** 2026-08-09
- **Notes & Conditions:** None specified.

---

## Related Documents

- **Affected ADR:** [`docs/architecture/adr/ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md`](../architecture/adr/ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md)
- **Traceability Matrix:** [`docs/brand/03_DECISIONS.md`](../brand/03_DECISIONS.md)
