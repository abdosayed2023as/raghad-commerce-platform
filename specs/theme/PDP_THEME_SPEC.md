# PDP Theme Specification — Easy Orders

**Status:** Approved & Locked — Business Owner 2026-08-10  
**Version:** 1.0.0  
**Date:** 2026-08-10  
**Owner:** Project Director  
**Platform constraint source:** [`research/easyorders/RS-04`](../../research/easyorders/RS-04_TEMPLATES_AND_PAGE_ARCHITECTURE.md) · [`RS-05`](../../research/easyorders/RS-05_THEME_VARIABLES_AND_SECTION_CONTRACTS.md)  
**Design contracts:** [`docs/design/UI_COMPONENTS.md`](../../docs/design/UI_COMPONENTS.md) · [`COLOR_SYSTEM.md`](../../docs/design/COLOR_SYSTEM.md) · [`TYPOGRAPHY.md`](../../docs/design/TYPOGRAPHY.md)

> Pre-code specification. No Liquid implementation starts until this document is Owner-approved.  
> Easy Orders has **no** `product.liquid` page file — the Product route is composed only from the built-in sections listed below.

---

## 1. Objective

Specify the Product Detail Page so that:

1. The **Trust Shield** (معاينة قبل الدفع · فيديو حقيقي · استبدال 48 ساعة) sits **above** the purchase action.
2. Media is **real** (BRAND-004) — gallery supports images/videos from `images`.
3. Implementation maps 1:1 to Easy Orders section files and required CustomEvents — no invented routes or illegal sections.

---

## 2. Platform Reality (non-negotiable)

### Product route — section set (engine-controlled order)

| # | Section file | Role on Raghad PDP |
| :---: | :--- | :--- |
| 1 | `sections/breadcrumbs.liquid` | Path: الرئيسية ← فئة ← المنتج |
| 2 | `sections/gallery.liquid` | Real photo gallery + real video clips when present in `images` |
| 3 | `sections/product-details.liquid` | Name, price, rating summary, **Trust Shield**, variant UI if any |
| 4 | `sections/product-description.liquid` | Long description + policy snippets |
| 5 | `sections/fixed-buy-button.liquid` | Sticky mobile buy bar (price + qty + primary CTA) |
| 6 | `sections/reviews.liquid` | Reviews list / empty state |
| 7 | `sections/related-products.liquid` | Related products grid |

**Cannot:** add a new product-route section file, rename routes, or replace the engine’s composition with a monolithic template.

**Must not enable on brand grounds:** `fake-visitor`, `fake-stock`, `fake-counter` — false scarcity / fake social proof (PROJECT_RULES + Brand Voice Don’ts). If the dashboard toggles them, theme styling should neutralize or hide; do not invest in animating them.

---

## 3. Mobile viewport composition (primary)

```
┌─────────────────────────────┐
│ Header (seal / cart)        │
├─────────────────────────────┤
│ Breadcrumbs                 │
├─────────────────────────────┤
│ Gallery (photos + video)    │  ← real media only
├─────────────────────────────┤
│ product-details:            │
│   Name                      │
│   Price                     │
│   ★ Trust Shield (3 items)  │  ← ABOVE buy intent
│   (wishlist/compare if req) │
├─────────────────────────────┤
│ product-description         │
├─────────────────────────────┤
│ reviews                     │
├─────────────────────────────┤
│ related-products            │
├─────────────────────────────┤
│ [sticky] fixed-buy-button   │  ← Trust micro-line + CTA
└─────────────────────────────┘
```

Desktop: gallery left (~55%) · details right (~45%); Trust Shield still directly under price and **above** any in-section buy control; sticky bar remains for mobile.

---

## 4. Section-by-section contracts

### 4.1 `gallery.liquid`

| Item | Spec |
| :--- | :--- |
| Variables | `images`, `mainImage`, `product_name`, `theme_data` |
| Behavior | Client-side only (no required CustomEvents) |
| Visual | Full-bleed within card radius 12px; dots/arrows plum; no glass overlays |
| Video | If an `images[]` item is video, show play control on a **real** poster frame (not AI art). Prefer inline ≤10s muted-with-unmute per BRAND-004 |
| Empty | Soft muted placeholder — never stock lifestyle AI |

### 4.2 `product-details.liquid` ★ Trust Shield host

| Item | Spec |
| :--- | :--- |
| Variables | `product_name`, `price`, `sale_price`, `currency`, `rating`, `reviews_count`, `description`, `product_id`, `theme_data`, `product_theme_data` |
| Events | `toggle-wishlist`, `toggle-compare` (only if UI exposes those controls) |
| Type | Name → `--text-h2` / 700 · Price → `--text-price` / 800 · Compare-at → `--text-price-sm` muted strike |
| **Trust Shield** | **Mandatory block** inside this section, after price, before any secondary actions |

**Trust Shield content (locked Arabic labels):**

1. معاينة كاملة قبل الدفع  
2. فيديو حقيقي 100%  
3. استبدال مجاني خلال 48 ساعة  

Styling: per [`UI_COMPONENTS.md`](../../docs/design/UI_COMPONENTS.md) §1 — trust fill chips + `--color-on-accent` text, or soft trust wash container radius 12px.

**Optional `product_theme_data` (via `product-data-schema.json` later):** flags such as `has_real_video` to dim/hide slot 2 only when genuinely no clip — never fake a video badge.

### 4.3 `fixed-buy-button.liquid` ★ Conversion bar

| Item | Spec |
| :--- | :--- |
| Variables | `product_name`, `price`, `sale_price`, `currency`, `thumb`, `buy_now_text`, `quantity`, `disabled`, `hide_quantity`, `increase_disabled`, `theme_data` |
| **Required events** | `buy-now`, `increment-quantity`, `decrement-quantity` — must bubble `{ bubbles: true }` or checkout silently fails (RS-05) |
| Visual | Sticky bottom; `--color-surface`; top border `--color-border`; min CTA height 48px; radius 30px; brand fill + on-accent text |
| Trust micro | Single caption above CTA: `معاينة قبل الدفع · فيديو حقيقي · استبدال 48س` |
| Qty | Plum ink; 48px hit targets |

### 4.4 `product-description.liquid`

| Item | Spec |
| :--- | :--- |
| Variables | `description`, `description_label`, `policies`, `theme_data` |
| Tone | Wise Older Sister — practical, honest; no hype / fake discounts |
| Policies | Surface inspection + replacement promises in plain language when `policies` present |

### 4.5 `breadcrumbs.liquid`

| Item | Spec |
| :--- | :--- |
| Variables | `categories`, `product_name`, `home_text` |
| Visual | `--text-caption` / muted; current page ink |

### 4.6 `reviews.liquid`

| Item | Spec |
| :--- | :--- |
| Variables | per RS-05 |
| Required | `data-review-open` on open-modal control |
| Empty | Calm empty state — no fake stars |

### 4.7 `related-products.liquid`

| Item | Spec |
| :--- | :--- |
| Variables | `products`, `category`, `section_title`, `currency`, `add`, `shop_now`, `sale`, `theme_data` |
| Events | `quick-add`, `quick-view` if buttons shown |
| Cards | [`UI_COMPONENTS.md`](../../docs/design/UI_COMPONENTS.md) §3 product card rules |

---

## 5. Global tokens on PDP

All colors/type/radii from locked design docs. Footer/header are layout shell (`header.liquid` / `footer.liquid`) — not redefined here; PDP inherits them.

Required header IDs (layout, still mandatory for cart): `header-cart-count` (+ compare/wishlist if used).

---

## 6. Content / ops requirements (outside Liquid)

For the Trust Shield to be honest in production:

| Requirement | Owner |
| :--- | :--- |
| Real photos on every SKU | Ops / Owner |
| ≤10s unedited clip when promising “فيديو حقيقي” | Ops / Owner (A-001) |
| Door inspection honored at delivery | Ops (BRAND-010) |
| 48h replacement process documented for support | Ops |

Theme must not claim video if no clip exists — use `product_theme_data` or detect media type in `images`.

---

## 7. Acceptance tests (before marking theme PDP done)

- [ ] On 375px width: Trust Shield visible without scrolling past price; sticky CTA does not cover shield when at top of details
- [ ] Primary CTA uses terracotta + plum text (not white on terracotta)
- [ ] `buy-now` / qty events fire and add-to-cart works on a staging product
- [ ] Gallery plays/shows only real media
- [ ] No fake-visitor / fake-stock / fake-counter UI
- [ ] Related cards match product-card radius 12px and type tokens
- [ ] Lighthouse/a11y: focus states on qty and CTA; contrast pairs pass COLOR_SYSTEM

---

## 8. Implementation file checklist (for coding agent — after approval)

```
theme/
  sections/
    breadcrumbs.liquid          # restyle
    gallery.liquid              # restyle + video handling
    product-details.liquid      # Trust Shield + type/color
    product-description.liquid  # restyle
    fixed-buy-button.liquid     # sticky bar + events + trust micro
    reviews.liquid              # restyle
    related-products.liquid     # card system
  assets/ or root per EO layout:
    style.css                   # tokens from COLOR + TYPE + DESIGN_SYSTEM
    script.js                   # gallery UX; event helpers; no fake counters
  product-data-schema.json      # optional: has_real_video, etc.
  schema.json                   # global theme settings as needed
```

Exact upload tree must follow Easy Orders Getting Started (RS-02) at implementation time.

---

## 9. Out of scope for this spec

- Home / PLP / cart drawer (separate specs next)
- Domain migration
- Changing Easy Orders checkout internals
- Pillar-specific PDP layouts (one PDP system for all pillars — BRAND-020)

---

## 10. Sign-off

| Role | Verdict | Date |
| :--- | :--- | :--- |
| Project Director | Recommended for approval | 2026-08-10 |
| Business Owner | **Approved** | 2026-08-10 |

---

## Related

- UI Trust Shield: [`docs/design/UI_COMPONENTS.md`](../../docs/design/UI_COMPONENTS.md)  
- EO Product sections: [official docs](https://themes-docs.easy-orders.net/docs/custom-themes/sections/product-sections)  
- Liquid `images` (incl. video URLs): [`research/reference/LIQUID_OBJECTS_REFERENCE.md`](../../research/reference/LIQUID_OBJECTS_REFERENCE.md)
