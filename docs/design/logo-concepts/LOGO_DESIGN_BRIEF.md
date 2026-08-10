# رغد | Raghad — Logo Design Brief

**Version:** 1.2
**Date:** 2026-08-10
**Status:** Locked — Production logo system approved by Business Owner (2026-08-10). Assets: `docs/design/logo/`
**Owner:** Project Director / Chief Brand Strategist
**Canonical sources:** [`docs/brand/01_BRAND_BOOK.md`](../../brand/01_BRAND_BOOK.md) · [`docs/brand/06_BRAND_MEMORY.md`](../../brand/06_BRAND_MEMORY.md) · [`docs/brand/03_DECISIONS.md`](../../brand/03_DECISIONS.md)

> **Part A** is a complete brief for a human designer and can be sent as-is.
> **Part B** defines the approved AI production workflow and its quality gates.
> In any conflict between this brief and the Brand Book, the Brand Book wins.

---

# PART A — Designer Brief

## 1. The Brand in Three Sentences

**رغد | Raghad** is a premium Egyptian e-commerce brand for women, spanning three pillars: newborn care (رغد كيدز), premium home & cookware (رغد هوم), and bridal trousseau (رغد العروسة). Its entire identity is built on **anti-deception**: 100% real product photography, full doorstep inspection before payment, and free 48-hour replacement — summarized in the tagline *"رغد... هتشتري وأنتي مغمضة"* ("you can buy with your eyes closed"). The brand speaks as **"الأخت الكبرى الخبيرة"** — the wise older sister: warm, refined, candid, protective, never pushy.

The word **رغد** itself means *ease, comfort, and abundance of living* — the name is a promise.

## 2. The Assignment

Design the master logo system for رغد | Raghad. The Arabic wordmark is the hero; a Latin support element ("Raghad") is secondary. The logo will replace an existing mark on a live store, so it must ship production-ready.

## 3. Locked Decisions the Logo Must Respect (non-negotiable)

| Constraint | Source |
| :--- | :--- |
| Master brand name is **رغد \| Raghad** — never "Raghad World" / "عالم رغد" in any brand expression | BRAND-013, ADR-002 |
| One master logo only — the three pillars (Kids / Home / Bridal) get **no separate logos**; they are differentiated typographically and with accent tints | BRAND-020, ADR-001 |
| Primary color **#D48C80** (Warm Terracotta), secondary **#2C2230** (Slate Plum), canvas **#FAFAFA** | BRAND-021 |
| Brand typeface for supporting text is **Cairo** (Google Fonts) | BRAND-021 |
| Soft-modern geometry: the UI system uses 12px card radius / 30px button radius — the mark should feel native to that world (rounded, soft, no sharp aggression) | Brand Book §15 |
| Personality: warm, premium, trustworthy, feminine, Egyptian — never cheap, loud, discount-flavored, or childish | BRAND-015, BRAND-016 |

## 4. Arabic Letterform Specification

The wordmark is the three-letter word **رغد**:

- **ر** (Reh) — isolated form; it does **not** connect to the following letter.
- **غـ** (Ghain, initial form) — carries a single dot above; connects forward.
- **ـد** (Dal, final form) — receives the connection from Ghain.

So the word renders visually as **ر + غد** (a standalone Reh followed by the joined Ghain–Dal pair). Any rendering that joins all three letters, drops or duplicates the Ghain dot, or uses wrong positional forms is defective and will be rejected.

## 5. Concept Directions Explored

Three AI concept studies and all Stage 3 drafts are archived at [`docs/archive/logo-exploration-pre-approval/`](../../archive/logo-exploration-pre-approval/).

| Direction explored | Outcome |
| :--- | :--- |
| **الاحتضان (The Embrace)** | Explored; not selected for production |
| **الوضوح (Modern Clarity)** | Selected (geometric letterforms + circular Ghain accent) |
| **الخاتم (The Seal)** | Selected (seal architecture) |

**Locked direction:** Seal architecture × geometric Cairo-derived wordmark with circular terracotta Ghain accent. Seal word scale **70%** of inner ring diameter. Production masters: [`docs/design/logo/`](../logo/).

## 6. Deliverables

1. **Primary lockup** — Arabic wordmark + mark, full color
2. **Horizontal and stacked variants**
3. **Standalone mark** (seal/icon) — must be legible at 16px favicon size and inside a circular social avatar crop
4. **Latin support lockup** — "Raghad" (for contexts requiring Latin; subordinate, never the hero)
5. **Monochrome versions** — one-color plum, one-color white (reversed), pure black
6. **Clear-space and minimum-size rules**
7. **File formats** — source vectors (SVG + AI/Figma), transparent PNGs at 1x/2x/4x

## 7. Usage Contexts (design for these, in this order)

1. Easy Orders storefront header (mobile-first — most traffic is mobile)
2. Facebook / Instagram / WhatsApp circular avatars
3. Product photography watermark (subtle)
4. Packaging and inspection-seal sticker
5. Meta ad creatives
6. Favicon

## 8. What to Avoid

- Hearts, infinity swooshes, generic "family" clip-art, shopping carts, storefront icons
- Gradients, 3D bevels, drop shadows — flat and confident only
- Anything that reads "discount store," "baby shop," or "tech startup"
- Gold-foil luxury clichés — the brand is warm-premium, not ostentatious
- The tagline inside the logo lockup (a separate tagline lockup may be offered as an extra, but the master logo stands alone)
- Latin-first compositions — Arabic leads, always

## 9. Evaluation Criteria & Process

A submission passes when: the Arabic is anatomically correct (§4); the mark survives 16px and monochrome; it feels warm and premium on #FAFAFA; the standalone mark is recognizable without the wordmark; and it would make a 26-year-old Egyptian mother feel *"دي علامة أثق فيها"* rather than "this is another online shop."

Review flow: Director review (this document's owner) → Business Owner approval → only then production files. Two revision rounds are assumed.

---

# PART B — AI Production Workflow (v1.1)

## Principle

Raster image AI remains **exploration-only** — that rule stands. What changed in v1.1: production no longer requires a human designer to redraw the mark. The final logo is built as **native vectors derived from the shaped glyph outlines of Cairo**, the locked brand typeface (SIL Open Font License — modifying outlines for a logo is permitted; modified glyphs may not be redistributed as a font).

Because the letterforms are inherited from a professionally designed Arabic typeface, the §4 anatomy failure catalogue is eliminated *by construction* rather than gambled against per-generation. **Auto-tracing raster AI output into vectors is forbidden at every stage.**

## Production Pipeline & Gates

| Stage | Work | Output | Gate (who approves) |
| :--- | :--- | :--- | :--- |
| **1. Raster exploration** | Image-model concept studies (prompts in Appendix) | Direction candidates | Director shortlist — ✅ complete |
| **2. Direction lock** | Business Owner selects a direction | Locked creative direction | **Business Owner** — ✅ Version A (concepts 2 × 3), 2026-08-10 |
| **3. Vector construction** | Extract shaped outlines of رغد from Cairo; circular Ghain dot; seal @ 70% fill; assemble lockups | Masters via `tools/logo-pipeline` | Director technical review — ✅ |
| **4. Letterform & taste gate** | Verify §4 anatomy; judge brand feel against archetype | Approved master mark | **Business Owner** — ✅ 2026-08-10 |
| **5. Production export** | Programmatic export from approved masters | Full package under `docs/design/logo/` | Director QA — ✅ complete |

## Workflow Rules

1. Never auto-trace raster output — vectors are constructed, not converted.
2. Every candidate passes the §4 anatomy check **before** any taste discussion.
3. Master vectors live in `docs/design/logo/masters/`; all production assets are exported from masters via `export-final.js`, never recreated by hand or by image models.
4. Raster prompts (Appendix) may be used for further exploration only — never for production input.
5. Ownership note: a constructed vector mark produced under documented human direction provides materially stronger trademark and copyright footing than raw AI-generated imagery.

---

## Appendix — Raster Exploration Prompts (non-production)

**Verify the Arabic every single time.** Image models frequently break Arabic script. Check every output against §4. Discard anything with malformed letters, regardless of how attractive it is. Generate in batches, shortlist by direction — don't chase a single perfect generation.

## Master Prompt Template

> Premium minimalist logo design presentation on a clean white background. [MARK DESCRIPTION]. Arabic wordmark of the word "رغد" (three Arabic letters: Reh — standalone, then Ghain joined to Dal, with a single dot above the Ghain), rendered in [STYLE] in [COLOR]. Below or beside it, a small thin modern sans-serif caption "Raghad" in dark plum #2C2230. Flat vector logo style, warm premium trustworthy feminine brand identity for an Egyptian family lifestyle e-commerce brand, generous white space, centered composition, no mockups, no shadows, no gradients, no other elements.

## Direction Prompts

**Direction 1 — الاحتضان (The Embrace):**
> …soft rounded flowing Arabic calligraphy in warm terracotta #D48C80, the tail curve of the final letter sweeping gently beneath the whole word like a protective embracing arc…

**Direction 2 — الوضوح (Modern Clarity):**
> …clean contemporary geometric rounded Kufi-inspired letterforms in dark slate plum #2C2230, with the single dot of the Ghain drawn as a perfect circle in warm terracotta #D48C80 as the only accent…

**Direction 3 — الخاتم (The Seal):**
> …a soft circular seal badge filled with warm terracotta #D48C80 containing the compact word "رغد" in white rounded calligraphy, evoking an elegant quality-inspection stamp, placed beside the full wordmark in dark slate plum #2C2230…

**Recommended hybrid (Seal × Embrace):**
> …a soft circular terracotta #D48C80 seal containing "رغد" in white flowing rounded calligraphy whose final curve embraces the letters, beside a larger plum #2C2230 calligraphic wordmark "رغد" with a thin "Raghad" caption beneath…

## Negative Guidance (append or use as negative prompt where supported)

> no photorealism, no 3D, no gradients, no shadows, no gold foil, no hearts, no shopping carts, no storefront icons, no children illustrations, no English-first composition, no busy backgrounds, no mockup scenes, no watermark text

## Post-Generation Checklist

- [ ] رغد reads correctly (Reh standalone; Ghain–Dal joined; one dot above Ghain)
- [ ] Works cropped to a circle (avatar test)
- [ ] Still legible scaled to 16px (favicon test)
- [ ] Survives one-color conversion mentally (monochrome test)
- [ ] Feels like "the wise older sister," not a discount store or a tech app
