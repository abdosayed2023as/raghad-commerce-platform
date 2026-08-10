# Design System Architecture (`DESIGN_SYSTEM.md`)

**Status:** Active — foundational tokens  
**Version:** 1.0.0  
**Date:** 2026-08-10  
**Category:** Design System & Theme Tokens  
**Canonical Brand References:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md) §15  

**Owns:** spacing, radius, elevation, breakpoints, motion defaults.  
**Does not own:** color ([`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md)) · type ([`TYPOGRAPHY.md`](./TYPOGRAPHY.md)) · components ([`UI_COMPONENTS.md`](./UI_COMPONENTS.md)) · logo ([`logo/`](./logo/)).

---

## 1. Border Radius

| Token | Value | Use |
| :--- | :---: | :--- |
| `--radius-card` | `12px` | Product cards, panels, inputs, Trust Shield container |
| `--radius-pill` | `30px` | CTAs, badges, chips |
| `--radius-none` | `0` | Full-bleed media only |

## 2. Elevation

| Token | Value | Use |
| :--- | :--- | :--- |
| `--shadow-soft` | `0 4px 20px rgba(0,0,0,0.05)` | Cards at rest |
| `--shadow-none` | `none` | Default for flat header/footer |

No multi-layer glam shadows. No glow.

## 3. Spacing Scale (4px grid)

| Token | Value |
| :--- | :---: |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

Page horizontal padding: `--space-4` mobile · `--space-6` desktop.  
Section vertical gap: `--space-6` mobile · `--space-7` desktop.

## 4. Breakpoints

| Name | Min width | Use |
| :--- | :---: | :--- |
| `sm` | 0 | Mobile default |
| `md` | 768px | Tablet / type desktop steps |
| `lg` | 1024px | Desktop grids (3–4 col cards) |
| `xl` | 1280px | Wide marketing only |

## 5. Motion

| Token | Value | Use |
| :--- | :--- | :--- |
| `--ease-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | UI transitions |
| `--dur-fast` | 150ms | Hover / color |
| `--dur-normal` | 250ms | Drawer open |

Motion supports clarity (drawer, sticky bar), not decoration. No continuous pulse on CTAs.

## 6. CSS snippet

```css
:root {
  --radius-card: 12px;
  --radius-pill: 30px;
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 150ms;
  --dur-normal: 250ms;
}
```
