# Logo & Visual Mark Guidelines (`LOGO_GUIDELINES.md`)

**Status:** Approved & Locked — 2026-08-10  
**Category:** Visual Identity  
**Assets:** [`docs/design/logo/`](./logo/)  
**Canonical Brand References:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md), [`docs/brand/06_BRAND_MEMORY.md`](../brand/06_BRAND_MEMORY.md), BRAND-013 · BRAND-020 · BRAND-021

---

## 1. Approved System

The master identity is a **combination mark**:

1. **Seal** — terracotta circle with white رغد (standalone mark for avatars, favicon, packaging stamp).
2. **Wordmark** — plum رغد with a circular terracotta Ghain dot.
3. **Lockups** — stacked and horizontal (seal + wordmark + Latin `RAGHAD` caption).

Letterforms are derived from shaped **Cairo** glyph outlines (SIL OFL). The Ghain square dot is replaced by a perfect circle. Seal word fills **70%** of the inner ring diameter.

**Do not** create separate logos for Raghad Kids / Home / Bridal (BRAND-020).

## 2. Primary Colors in the Mark

| Token | Hex | Use in logo |
| :--- | :--- | :--- |
| Warm Terracotta | `#D48C80` | Seal fill; wordmark Ghain accent |
| Slate Plum | `#2C2230` | Wordmark letters; Latin caption |
| White | `#FFFFFF` | Seal letters and inner ring |

## 3. Clear Space

Minimum clear space around any lockup or seal = **height of the Ghain accent dot** on all four sides. Do not place competing graphics, text, or photography edges inside this zone.

## 4. Minimum Sizes

| Asset | Minimum |
| :--- | :--- |
| Seal (digital) | 24px diameter (favicon absolute floor: 16px) |
| Seal (print) | 12mm diameter |
| Wordmark (digital) | 80px wide |
| Horizontal lockup | 160px wide |
| Stacked lockup | 100px wide |

## 5. Approved Variants

| Variant | When to use | Path |
| :--- | :--- | :--- |
| Full color seal | Default avatar, stamp, favicon | `logo/masters/raghad-seal.svg` |
| Full color wordmark | Headers where seal is already shown, or text-led contexts | `logo/masters/raghad-wordmark.svg` |
| Stacked lockup | Profile covers, packaging, brand boards | `logo/masters/raghad-lockup-stacked.svg` |
| Horizontal lockup | Site header, email, wide banners | `logo/masters/raghad-lockup-horizontal.svg` |
| Seal plum / black | One-color print, engraving | `logo/mono/` |
| Seal white-knockout | Dark backgrounds | `logo/mono/raghad-seal-white-knockout.svg` |
| Wordmark white | Dark backgrounds | `logo/mono/raghad-wordmark-white.svg` |

## 6. Do Not

- Stretch, rotate, or recolor outside the approved palette.
- Add shadows, gradients, outlines, or 3D effects.
- Place the tagline inside the logo artwork.
- Replace رغد with "عالم رغد" / "Raghad World" in any mark (ADR-002).
- Use archived exploration files under `docs/archive/logo-exploration-pre-approval/`.

## 7. Live Site Note

`raghadkids.com` currently displays superseded "عالم رغد" branding. Deploy this approved system to the live header and social avatars when the Owner schedules the swap (domain migration to `raghadworld.com` remains separate and deferred).

## Related

- Production folder: [`docs/design/logo/`](./logo/)
- Design brief & pipeline history: [`docs/design/logo-concepts/LOGO_DESIGN_BRIEF.md`](./logo-concepts/LOGO_DESIGN_BRIEF.md)
- Rebuild script: `tools/logo-pipeline/export-final.js`
