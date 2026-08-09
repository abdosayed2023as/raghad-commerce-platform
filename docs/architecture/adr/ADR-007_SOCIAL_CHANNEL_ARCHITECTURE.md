# ADR-007: Social Media Channel Architecture

**Status:** Approved & Locked
**Approved Date:** 2026-08-09
**Date:** 2026-08-08
**Proposer:** Claude (Chief Brand Strategist / Quality Gate)
**Decision ID:** BRAND-020 (Derived — Channel Architecture Extension, not a new primary Brand Decision)

---

## Context

`BRAND-020` / `ADR-001` locks the Monolithic Branded House model at the domain, cart, and support-line layer (1 domain, 1 cart, 1 WhatsApp line), but does not explicitly address social media page structure. The business currently operates one Facebook Page (~1,500 followers, built around Raghad Kids content) plus Instagram and WhatsApp via Meta Conversion Ads. As Home and Bridal launch, a decision is needed on whether each pillar gets its own Facebook Page or all three share one master-brand Page.

## Decision

Adopt a **single, unified Facebook Page** for **رغد | Raghad** as the master brand identity. Do not create separate Facebook Pages per pillar (Kids / Home / Bridal) at this stage. Pillar-level audience targeting is achieved through ad-set/custom-audience segmentation within one Meta Business Manager account, not through separate Pages.

## Rationale

1. **Consistency with BRAND-020:** Extends the same capital-efficiency and trust-transfer logic already locked for domain/cart/support to the social layer — one brand, one place to build equity.
2. **Preserves existing equity:** The current ~1,500-follower Page already carries built-up trust; splitting into three new Pages abandons that rather than compounding it.
3. **Resource stage fit:** At current team size, three Pages means three content calendars and three community-management queues for a business not yet generating the content or ad volume to justify it.
4. **Targeting doesn't require separate Pages:** Meta ad-set-level audience segmentation delivers pillar-specific targeting without page fragmentation.

## Consequences

### Positive
- Single source of social proof and reviews compounds instead of fragmenting across three nascent pages.
- One ad account and one content team, consistent with the capital-efficiency rationale in `ADR-001`.
- Preserves the existing ~1,500-follower audience rather than starting from zero on new pages.

### Negative / Accepted Trade-offs
- Mixed-topic content (e.g., bridal trousseau alongside infant safety content) may reduce Meta's page-level topical relevance signal, potentially suppressing organic reach and raising CPM versus topically focused pages.
- The existing Kids-focused audience may disengage from bridal-specific content; this should be monitored via unfollow/engagement-rate tracking after Home/Bridal content begins.
- Bridal (once-in-a-lifetime purchase) and Kids (recurring purchase) have structurally different content cadences that a shared feed cannot serve with equal visibility by default.

## Reversal Triggers (from future re-evaluation, not part of this decision)

This decision should be revisited, not treated as permanent, if any of the following occur:
- Ad performance data shows materially worse CTR/CPM from mixed-pillar content versus a controlled single-pillar-page test.
- Home or Bridal individually reaches a scale where dedicated community management no longer competes with the other pillars for capacity.
- Team size grows to support a dedicated social lead per pillar.
- Website UX testing (Open Item `A-002`) shows customers experience the multi-pillar *site* as incoherent — an early signal the same risk applies to social.

## Related Documents

- **Parent Decision:** [`docs/brand/03_DECISIONS.md`](../../brand/03_DECISIONS.md) (BRAND-020)
- **Parent ADR:** [`ADR-001_BRANDED_HOUSE.md`](./ADR-001_BRANDED_HOUSE.md)
- **Change Request:** [`docs/change_requests/CR-001_SOCIAL_CHANNEL_ARCHITECTURE.md`](../../change_requests/CR-001_SOCIAL_CHANNEL_ARCHITECTURE.md)
- **Traceability:** [`docs/TRACEABILITY.md`](../../TRACEABILITY.md)
