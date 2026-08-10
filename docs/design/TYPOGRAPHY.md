# Typography System (`TYPOGRAPHY.md`)

**Status:** Approved — Pending Business Owner sign-off  
**Version:** 1.0.0  
**Date:** 2026-08-10  
**Category:** Visual Identity & UI System  
**Canonical Brand References:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md) §15 · BRAND-021  
**Related:** [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md) · [`LOGO_GUIDELINES.md`](./LOGO_GUIDELINES.md)

---

## 1. Locked Decision

| Rule | Value |
| :--- | :--- |
| **Sole typeface** | **Cairo** (Google Fonts) — Arabic *and* Latin |
| **Allowed weights** | `500` Medium · `700` Bold · `800` Extra Bold |
| **Rejected** | `DM Sans`, `Playfair Display`, and any other family (drift from superseded Brand Book v1.0) |

**Rationale:** Raghad is Arabic-first. Cairo already covers Latin numerals and the short English caption `RAGHAD`. A second family adds load, inconsistency, and no brand value. Logo production already uses Cairo outlines — UI type must match.

---

## 2. Load Spec (Easy Orders / web)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;800&display=swap" rel="stylesheet">
```

CSS stack:

```css
--font-brand: "Cairo", "Segoe UI", Tahoma, Arial, sans-serif;
```

Always declare `direction` and `lang` correctly on the document (`lang="ar"` / `dir="rtl"`). Latin fragments (SKU codes, `RAGHAD` caption) inherit Cairo; do not switch families.

---

## 3. Type Scale (Mobile-First)

Base = **16px** body. Scale uses a ~1.25 major-third progression for display steps. Desktop sizes are enhancements, not a second system.

| Token | Role | Mobile | Desktop (≥768px) | Weight | Line-height | Letter-spacing |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `--text-display` | Hero / pillar landing only | 32px | 40px | 800 | 1.25 | normal |
| `--text-h1` | Page title | 28px | 32px | 800 | 1.30 | normal |
| `--text-h2` | Section title | 24px | 28px | 700 | 1.35 | normal |
| `--text-h3` | Card / block title | 20px | 22px | 700 | 1.40 | normal |
| `--text-h4` | Subhead / PDP product name | 18px | 18px | 700 | 1.40 | normal |
| `--text-body` | Paragraphs, descriptions | 16px | 16px | 500 | 1.70 | normal |
| `--text-body-sm` | Secondary copy, meta | 14px | 14px | 500 | 1.60 | normal |
| `--text-caption` | Labels, timestamps, legal | 12px | 12px | 500 | 1.50 | normal |
| `--text-button` | CTA & secondary buttons | 16px | 16px | 700 | 1.20 | normal |
| `--text-badge` | Trust badges, chips | 12px | 12px | 700 | 1.20 | 0.02em |
| `--text-price` | Product price | 20px | 22px | 800 | 1.20 | normal |
| `--text-price-sm` | Strike / compare-at | 14px | 14px | 500 | 1.20 | normal |

### Arabic optical notes

- Prefer **slightly looser** line-height on body (`1.70`) than typical Latin sites — Arabic needs vertical air.
- Do **not** use ultra-tight tracking on Arabic display type; Cairo’s Arabic metrics already balance the word.
- Latin `RAGHAD` in lockups may use wider tracking in the logo asset only; in UI, keep caption spacing normal unless matching a logo lockup.

---

## 4. Semantic Color Pairing (Text)

Follow the locked accessibility rule from [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md):

| Context | Text color |
| :--- | :--- |
| Body on `#FAFAFA` | `#2C2230` |
| Text on `#2C2230` (footer / dark band) | `#FAFAFA` |
| Text / icons on terracotta, emerald, or amber fills | `#2C2230` only — **never white** |
| Muted / secondary on canvas | `#2C2230` at 70% opacity *or* a dedicated muted token once Color tokens ship |
| Links in body | `#2C2230` + underline; hover may use terracotta **border/underline**, not terracotta fill text on white |

---

## 5. CSS Custom Properties (ready to paste)

```css
:root {
  --font-brand: "Cairo", "Segoe UI", Tahoma, Arial, sans-serif;

  --fw-medium: 500;
  --fw-bold: 700;
  --fw-extrabold: 800;

  --text-display: 2rem;      /* 32px */
  --text-h1: 1.75rem;        /* 28px */
  --text-h2: 1.5rem;         /* 24px */
  --text-h3: 1.25rem;        /* 20px */
  --text-h4: 1.125rem;       /* 18px */
  --text-body: 1rem;         /* 16px */
  --text-body-sm: 0.875rem;  /* 14px */
  --text-caption: 0.75rem;   /* 12px */
  --text-button: 1rem;
  --text-badge: 0.75rem;
  --text-price: 1.25rem;
  --text-price-sm: 0.875rem;

  --lh-display: 1.25;
  --lh-heading: 1.35;
  --lh-body: 1.7;
  --lh-ui: 1.2;
}

@media (min-width: 768px) {
  :root {
    --text-display: 2.5rem;  /* 40px */
    --text-h1: 2rem;         /* 32px */
    --text-h2: 1.75rem;      /* 28px */
    --text-h3: 1.375rem;     /* 22px */
    --text-price: 1.375rem;  /* 22px */
  }
}

body {
  font-family: var(--font-brand);
  font-weight: var(--fw-medium);
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: #2C2230;
}
```

---

## 6. Component Mapping (what uses what)

| UI element | Token | Weight |
| :--- | :--- | :---: |
| Store header brand (text fallback) | `--text-h3` | 800 |
| Home hero headline | `--text-display` | 800 |
| Pillar section title | `--text-h2` | 700 |
| Product card title | `--text-h4` | 700 |
| Product detail name | `--text-h2` | 700 |
| Price | `--text-price` | 800 |
| Body / description | `--text-body` | 500 |
| Primary / secondary CTA | `--text-button` | 700 |
| Trust shield labels | `--text-badge` | 700 |
| Form labels | `--text-body-sm` | 700 |
| Form helper / error | `--text-caption` | 500 |
| Footer links | `--text-body-sm` | 500 |

---

## 7. Do Not

- Introduce a second typeface for “elegance” or English.
- Use Cairo `300` / `400` / `600` / `900` — stick to **500 / 700 / 800** only (performance + brand consistency).
- Set body below 16px on mobile.
- Center-align long Arabic paragraphs (right-align / start-align in RTL).
- Use all-caps for Arabic. Latin `RAGHAD` caps are logo-only.

---

## 8. Acceptance Checklist

- [ ] Only Cairo 500/700/800 loaded
- [ ] No DM Sans / Playfair references remain in design docs or theme
- [ ] Body ≥ 16px; contrast pairs pass COLOR_SYSTEM rules
- [ ] PDP product name + price hierarchy readable on a 375px viewport
- [ ] Trust badge text uses `--text-badge` + plum on accent fills

---

## Related Documents

- Brand Book §15: [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md)
- Color + contrast: [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md)
- Logo (Cairo-derived): [`logo/README.md`](./logo/README.md)
