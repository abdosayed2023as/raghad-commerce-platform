# Color System & Palette Tokens (`COLOR_SYSTEM.md`)

**Status:** Approved & Locked — Business Owner pending final sign-off on token expansion  
**Version:** 1.1.0  
**Date:** 2026-08-10  
**Category:** Visual Identity & Design System  
**Canonical Brand References:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md) §15 · BRAND-021 · [`docs/brand/06_BRAND_MEMORY.md`](../brand/06_BRAND_MEMORY.md)  
**Related:** [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) · [`LOGO_GUIDELINES.md`](./LOGO_GUIDELINES.md)

> Core hex values are locked under BRAND-021. This document expands them into **implementable CSS tokens**. It does not change the brand palette.

---

## 1. Locked Brand Palette (do not alter)

| Role | Name | Hex | RGB |
| :--- | :--- | :---: | :---: |
| Primary accent | Warm Terracotta | `#D48C80` | 212, 140, 128 |
| Secondary contrast | Slate Plum | `#2C2230` | 44, 34, 48 |
| Surface canvas | Warm Silk White | `#FAFAFA` | 250, 250, 250 |
| Trust / success | Forest Emerald | `#10B981` | 16, 185, 129 |
| Warning / deposit | Amber Gold | `#F59E0B` | 245, 158, 11 |

### Text-on-Accent Rule (Locked 2026-08-09)

> Text and icons on `#D48C80`, `#10B981`, or `#F59E0B` fills **must** use `#2C2230` — never white, never the raw accent as text on `#FAFAFA`.

| Pairing | Ratio | AA |
| :--- | :---: | :---: |
| `#2C2230` on `#FAFAFA` | 14.60 : 1 | ✅ |
| `#FAFAFA` on `#2C2230` | 14.60 : 1 | ✅ |
| `#2C2230` on `#D48C80` | 5.70 : 1 | ✅ |
| `#2C2230` on `#10B981` | 6.01 : 1 | ✅ |
| `#2C2230` on `#F59E0B` | 7.09 : 1 | ✅ |

---

## 2. Semantic Tokens (what components use)

Use **semantic names** in theme CSS — never hard-code hex in Liquid except via these variables.

| Token | Value | Use |
| :--- | :---: | :--- |
| `--color-canvas` | `#FAFAFA` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, drawers, modals |
| `--color-surface-muted` | `#F3F1F2` | Alternating bands, input fill |
| `--color-ink` | `#2C2230` | Primary text / icons |
| `--color-ink-muted` | `rgba(44, 34, 48, 0.70)` | Secondary text |
| `--color-ink-subtle` | `rgba(44, 34, 48, 0.45)` | Placeholders, disabled |
| `--color-ink-inverse` | `#FAFAFA` | Text on plum/dark bands |
| `--color-brand` | `#D48C80` | Primary accent, logo seal, key CTAs |
| `--color-brand-hover` | `#C4786C` | Hover on brand fills |
| `--color-brand-pressed` | `#B56A5F` | Active/pressed |
| `--color-brand-soft` | `#F6E4E0` | Soft brand wash (chips, selected row) |
| `--color-trust` | `#10B981` | Trust / success fills |
| `--color-trust-soft` | `#D1FAE5` | Soft success background |
| `--color-warning` | `#F59E0B` | Deposit / caution fills |
| `--color-warning-soft` | `#FEF3C7` | Soft warning background |
| `--color-danger` | `#DC2626` | Errors / destructive only |
| `--color-danger-soft` | `#FEE2E2` | Error backgrounds |
| `--color-border` | `rgba(44, 34, 48, 0.12)` | Default borders |
| `--color-border-strong` | `rgba(44, 34, 48, 0.24)` | Inputs focus ring base / dividers |
| `--color-focus` | `#2C2230` | Focus outline |
| `--color-overlay` | `rgba(44, 34, 48, 0.45)` | Drawer/modal scrim |
| `--color-footer` | `#2C2230` | Footer / dark band (**not** `#0F172A`) |

### Pillar accent tints (secondary only — master brand stays terracotta)

Under BRAND-020 pillars do not get separate logos. Optional section tints:

| Pillar | Soft tint | Use |
| :--- | :---: | :--- |
| Kids | `#F6E4E0` (brand-soft) | Section wash / nav chip |
| Home | `#EDE8EA` (plum-tint) | Section wash / nav chip |
| Bridal | `#F3E6E3` (warm blend) | Section wash / nav chip |

Terracotta remains the only primary CTA and logo color across all pillars.

---

## 3. CSS Custom Properties (ready to paste)

```css
:root {
  /* Brand core */
  --color-brand: #D48C80;
  --color-brand-hover: #C4786C;
  --color-brand-pressed: #B56A5F;
  --color-brand-soft: #F6E4E0;

  --color-plum: #2C2230;
  --color-plum-tint: #EDE8EA;

  --color-canvas: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F3F1F2;

  --color-ink: #2C2230;
  --color-ink-muted: rgba(44, 34, 48, 0.70);
  --color-ink-subtle: rgba(44, 34, 48, 0.45);
  --color-ink-inverse: #FAFAFA;

  --color-trust: #10B981;
  --color-trust-soft: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-soft: #FEF3C7;
  --color-danger: #DC2626;
  --color-danger-soft: #FEE2E2;

  --color-border: rgba(44, 34, 48, 0.12);
  --color-border-strong: rgba(44, 34, 48, 0.24);
  --color-focus: #2C2230;
  --color-overlay: rgba(44, 34, 48, 0.45);
  --color-footer: #2C2230;

  /* On-accent text (locked a11y rule) */
  --color-on-accent: #2C2230;
}
```

---

## 4. Component Color Contracts

| Component | Background | Text / icon | Border |
| :--- | :--- | :--- | :--- |
| Page | `--color-canvas` | `--color-ink` | — |
| Product card | `--color-surface` | `--color-ink` | `--color-border` |
| Primary CTA | `--color-brand` | `--color-on-accent` | none |
| Primary CTA hover | `--color-brand-hover` | `--color-on-accent` | none |
| Secondary CTA | `--color-surface` | `--color-ink` | `--color-border-strong` |
| Trust badge / shield chip | `--color-trust` | `--color-on-accent` | none |
| Deposit notice | `--color-warning` | `--color-on-accent` | none |
| Soft trust callout | `--color-trust-soft` | `--color-ink` | transparent |
| Footer / dark band | `--color-footer` | `--color-ink-inverse` | — |
| Input default | `--color-surface` | `--color-ink` | `--color-border` |
| Input focus | `--color-surface` | `--color-ink` | `--color-focus` (2px) |
| Error text | transparent | `--color-danger` | — |

---

## 5. Do Not

- Use white text on terracotta / emerald / amber fills.
- Use emerald or amber as body text on `#FAFAFA`.
- Reintroduce `#0F172A`, `#2C2C30`, or any superseded v1.0 neutrals.
- Create pillar-specific primary CTA colors.
- Add purple gradients, glows, or glassmorphic color overlays.

---

## 6. Accessibility Audit Log (retained)

**Audit Date:** 2026-08-09 · WCAG 2.1 AA  

Original failing pairs (white on terracotta; emerald/amber as icons on canvas) were resolved by the Text-on-Accent rule — see section 1. Full luminance table preserved in git history under CHANGELOG `[2.4.2]`.

---

## 7. Acceptance Checklist

- [ ] Theme CSS uses semantic tokens only (no stray hex in components)
- [ ] Primary CTA = terracotta fill + plum text
- [ ] Trust chips = emerald fill + plum text
- [ ] Footer = plum (`#2C2230`), not slate-navy leftovers
- [ ] Owner sign-off on this token expansion

---

## Related Documents

- Brand Book §15: [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md)
- Typography: [`TYPOGRAPHY.md`](./TYPOGRAPHY.md)
- Decisions: [`docs/brand/03_DECISIONS.md`](../brand/03_DECISIONS.md) (BRAND-021)
