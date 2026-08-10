# UI Component Specifications (`UI_COMPONENTS.md`)

**Status:** Approved — Pending Business Owner sign-off  
**Version:** 1.0.0  
**Date:** 2026-08-10  
**Category:** Component Architecture & Theme Specs  
**Canonical Brand References:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md) · BRAND-004 · BRAND-010 · BRAND-020  
**Tokens:** [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md) · [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) · [`LOGO_GUIDELINES.md`](./LOGO_GUIDELINES.md) · [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

> Components implement the brand. The **Trust Shield** is not a footer badge — it is a primary PDP conversion system.

---

## 0. Hard Rules (from locked decisions)

| Rule | Source |
| :--- | :--- |
| Mobile-first | PROJECT_RULES |
| Real product media only — no AI product imagery | BRAND-004 |
| Risk reversal visible before pay CTA | BRAND-010 |
| One brand, one cart, three pillars — no competing logos | BRAND-020 |
| No glassmorphism, no fake urgency, no dark patterns | PROJECT_RULES + Brand Voice |
| Footer / dark bands use `#2C2230` — **never** `#0F172A` | COLOR_SYSTEM |
| Radii: cards `12px` · buttons/badges `30px` | Brand Book §15 |
| Shadow: `0 4px 20px rgba(0,0,0,0.05)` only | Brand Book §15 |

---

## 1. Trust Shield (Primary PDP System)

**Purpose:** Make the three-step risk reversal impossible to miss before add-to-cart.

### Placement (mandatory order on PDP)

1. Product media (photo + real 10s video)
2. Product name + price
3. **Trust Shield** ← here, above the primary CTA
4. Primary CTA (Add to cart / Buy)
5. Description / details

### Structure

Three equal items in one horizontal row on desktop; stacked or 3-column compact on mobile.

| Slot | Arabic label (locked tone) | Icon intent | Color |
| :--- | :--- | :--- | :--- |
| 1 | معاينة كاملة قبل الدفع | Package open / eye-check | Trust fill |
| 2 | فيديو حقيقي 100% | Play on real frame | Trust fill |
| 3 | استبدال مجاني خلال 48 ساعة | Swap / shield | Trust fill |

### Spec

| Property | Value |
| :--- | :--- |
| Container | `--color-surface` or `--color-trust-soft` wash; radius `12px`; padding `12px 14px` |
| Item chip | Optional: `--color-trust` fill + `--color-on-accent` text; radius `30px` |
| Label | `--text-badge` (12px / 700) |
| Icon | 20px; same color as text |
| Gap | 8px mobile · 12px desktop |
| Behavior | Static (not a carousel). Tappable item may open a short explainer sheet — optional later |

### Do not

- Move the shield below the fold or into the footer only.
- Replace copy with generic “ثقة” / “جودة” without the three concrete promises.
- Use white text on emerald chips.

---

## 2. Buttons

### 2.1 Primary CTA

| State | Background | Text | Notes |
| :--- | :--- | :--- | :--- |
| Default | `--color-brand` | `--color-on-accent` | Radius `30px`; `--text-button` / 700 |
| Hover | `--color-brand-hover` | `--color-on-accent` | |
| Pressed | `--color-brand-pressed` | `--color-on-accent` | |
| Disabled | `--color-brand-soft` | `--color-ink-subtle` | No hover lift |
| Min height | 48px | — | Thumb-friendly mobile |

Full width on mobile PDP sticky bar; auto width (≥160px) in desktop grids.

### 2.2 Secondary CTA

| State | Background | Text | Border |
| :--- | :--- | :--- | :--- |
| Default | `--color-surface` | `--color-ink` | `1.5px solid --color-border-strong` |
| Hover | `--color-surface-muted` | `--color-ink` | same |
| Radius / type | `30px` · `--text-button` / 700 | | |

### 2.3 Text / tertiary

Plum text, underline on hover. No fake “button look.” Used for “تفاصيل أكثر”, policy links.

### 2.4 Forbidden button patterns

- Countdown urgency CTAs
- “آخر قطعة!!!” false scarcity
- Pulsing glow / gradient fills

---

## 3. Product Card (PLP / Home grids)

| Element | Spec |
| :--- | :--- |
| Layout | Mobile 2-col · Desktop 3–4 col (theme grid) |
| Surface | `--color-surface`; radius `12px`; shadow Brand Book soft |
| Image | 1:1 or 4:5; real photo only; lazy-load |
| Video cue | Small play badge if clip exists — does not replace photo |
| Title | `--text-h4` / 700 · max 2 lines · ellipsis |
| Price | `--text-price` / 800 |
| Compare-at | `--text-price-sm` / 500 · muted · strikethrough |
| Trust micro | Optional single line under price: `معاينة قبل الدفع` · `--text-caption` |
| CTA | Secondary or primary text link — avoid double primary CTAs fighting the PDP |

### Do not

- Glass overlays on images
- Pill-cluster promo stickers on the image (discount bursts, “جديد!!”)
- AI lifestyle composites as the main image

---

## 4. Product Detail Page (PDP)

### 4.1 Media

- Primary: real stills (gallery)
- Required when available: **unedited ≤10s** real clip (BRAND-004)
- Poster frame = real photo, not a generated thumbnail

### 4.2 Buy stack (sticky on mobile)

Order from top of sticky region:

1. Price (and variant selectors if any)
2. Trust Shield (compact)
3. Primary CTA
4. Secondary: WhatsApp ask (optional) — secondary style only

Sticky bar: `--color-surface`; top border `--color-border`; safe-area padding bottom.

### 4.3 Content blocks below

- Description (Wise Older Sister tone — warm Egyptian, not hype)
- Specs / materials
- Shipping & inspection explainer (can deep-link from Trust Shield)

---

## 5. Header & Navigation

| Element | Spec |
| :--- | :--- |
| Background | `--color-surface` or `--color-canvas`; **solid** — no blur/glass |
| Logo | Horizontal lockup desktop · Seal mobile — see [`logo/README.md`](./logo/README.md) |
| Nav | Pillars as text links: كيدز · هوم · العروسة — not separate logos |
| Icons | Cart, search — plum ink; badge count on terracotta with on-accent text if needed |
| Announcement bar (optional) | One trust line max, e.g. معاينة قبل الدفع · فيديو حقيقي · استبدال 48 ساعة — plum on brand-soft or inverse on plum |

---

## 6. Cart Drawer

| Element | Spec |
| :--- | :--- |
| Surface | `--color-surface` |
| Scrim | `--color-overlay` |
| Line items | Image 64px · title h4 · price |
| Trust reminder | One compact shield row above checkout CTA |
| Primary CTA | إتمام الطلب — primary button |
| Empty state | Calm copy; link back to catalog — no pressure language |

---

## 7. Footer

| Element | Spec |
| :--- | :--- |
| Background | `--color-footer` (`#2C2230`) — **not** `#0F172A` |
| Text | `--color-ink-inverse` |
| Columns | Mobile stacked · Desktop up to 4: Shop · Trust & policies · Contact · Social |
| Logo | Seal knockout or wordmark white |
| Bottom line | Domain / rights — caption |

---

## 8. Forms & Feedback

| Element | Spec |
| :--- | :--- |
| Input height | ≥48px; radius 12px |
| Label | `--text-body-sm` / 700 |
| Error | `--color-danger` text; input border danger |
| Success toast | trust-soft bg + ink text |

---

## 9. Component Inventory (build order for theme)

Priority for Easy Orders implementation:

1. Global tokens (color + type + radius/shadow)
2. Header + footer
3. Product card
4. PDP (media + Trust Shield + sticky CTA)
5. Cart drawer
6. Home sections (hero, pillar entry — after wireframes)

---

## 10. Rejected / Superseded Scaffold Ideas

The previous scaffold listed items that are **out of brand** and must not be built:

| Old scaffold item | Verdict |
| :--- | :--- |
| Glassmorphic header | Rejected |
| 4-column dark footer `#0F172A` | Rejected — use plum footer |
| Promo sticker clusters on cards | Rejected |

---

## 11. Acceptance Checklist

- [ ] Trust Shield sits above primary CTA on PDP (mobile + desktop)
- [ ] Primary CTA = terracotta + plum text, 48px min height, radius 30px
- [ ] Product cards use real images only; radius 12px
- [ ] Footer color is plum `#2C2230`
- [ ] No glassmorphism, no `#0F172A`, no fake urgency patterns
- [ ] Owner sign-off

---

## Related Documents

- Brand Book risk reversal §6: [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md)
- Color contracts: [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md)
- Type mapping: [`TYPOGRAPHY.md`](./TYPOGRAPHY.md)
- Radii / shadow: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
