# CR-002: Brand Book Secondary Color Hex Typo Correction

**CR Identifier:** CR-002
**Title:** Brand Book Secondary Color Hex Typo Correction
**Target Document / Decision:** `docs/brand/01_BRAND_BOOK.md` §15 / BRAND-021
**Proposer Role:** Chief Brand Strategist / Quality Gate (Claude)
**Date Submitted:** 2026-08-09
**Status:** Approved & Implemented

---

## 1. Problem Statement & Context

`docs/brand/01_BRAND_BOOK.md` §15 currently contains two conflicting hex values on a single line for the Secondary color defined under BRAND-021:

> `#2C2C30` / `#2C2230` (Premium Slate Plum)

All 17 other references to this color across the repository (`DECISION_TREE.md`, `docs/TRACEABILITY.md`, `docs/design/COLOR_SYSTEM.md`, `docs/brand/06_BRAND_MEMORY.md`, etc.) already converge on `#2C2230`, confirming that `#2C2C30` is a transcription error introduced at the source document level — not an open or undecided choice. The two values are visually distinct colors (different green channel: `0x22` vs `0x2C`) so the discrepancy is a factual error, not a stylistic variant.

---

## 2. Proposed Change

Replace the conflicting line in `docs/brand/01_BRAND_BOOK.md` §15:

**Before:**
```
`#2C2C30` / `#2C2230` (Premium Slate Plum)
```

**After:**
```
`#2C2230` (Premium Slate Plum)
```

This aligns the Brand Book source with every downstream reference already in effect across the repository.

---

## 3. Impact Assessment

- **Brand Strategy Impact:** None — this corrects the master document to match the already-approved and already-deployed `#2C2230` value. It does not alter any locked brand decision; BRAND-021 already specifies `#2C2230` as the intended secondary color.
- **Technical Architecture Impact:** None — no theme code, ADR, or Liquid template references `#2C2C30`. The erroneous value has not propagated into implementation files.
- **Operational & Cost Impact:** None.
- **Risk Assessment:** Low. Rejecting this fix leaves the canonical Brand Book contradicting every other document in the repository, creating a latent risk that a future implementer picks up `#2C2C30` from the source document rather than the correct `#2C2230`.

---

## 4. Decision & Approval Record

- **Reviewer:** Business Owner
- **Decision Verdict:** Approved
- **Approval Date:** 2026-08-09
- **Notes & Conditions:** Approved by Business Owner. Applied to 01_BRAND_BOOK.md §15.

---

## Related Documents

- **Affected Document:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md) §15
- **Related Brand Decision:** [`docs/brand/03_DECISIONS.md`](../brand/03_DECISIONS.md) (BRAND-021)
- **Traceability Matrix:** [`docs/brand/03_DECISIONS.md`](../brand/03_DECISIONS.md)
