# Color System & Palette Tokens (`COLOR_SYSTEM.md`)

**Status:** Accessibility Fixes Approved — Token Generation Pending  
**Category:** Visual Identity & Design System  
**Canonical Brand References:** [`docs/brand/01_BRAND_BOOK.md`](../brand/01_BRAND_BOOK.md), [`docs/brand/06_BRAND_MEMORY.md`](../brand/06_BRAND_MEMORY.md)  

---

## Approved Palette Summary (from Brand Strategy)

- **Primary Accent:** `#D48C80` (Warm Terracotta / Soft Rose)
- **Secondary Contrast:** `#2C2230` (Slate Plum)
- **Surface Canvas:** `#FAFAFA` (Warm Silk White)
- **Trust Badge:** `#10B981` (Forest Emerald)
- **Deposit Warning:** `#F59E0B` (Amber Gold)
- **Text-on-Accent Rule:** `#2C2230` is the only approved text/icon color on top of Primary Accent, Trust Badge, or Deposit Warning fills (see Resolved Accessibility Fix Decision below).

---

## Overview

This specification will define HSL scale variations, CSS custom properties, WCAG contrast ratios, and dark/light surface tokens for Easy Orders liquid themes.

*Detailed HSL scale variations, CSS custom properties, and dark/light surface tokens will be populated during the Token Generation phase.*

---

## Accessibility (WCAG 2.1) Contrast Audit

**Audit Date:** 2026-08-09  
**Standard:** WCAG 2.1 Level AA — Normal text ≥ 4.5:1 · Large text / UI components ≥ 3:1  
**Method:** Relative luminance per WCAG 1.4.3 formula (sRGB linearisation → L = 0.2126R + 0.7152G + 0.0722B)

| # | Foreground | Background / Context | Contrast Ratio | AA Normal Text | AA Large / UI | Result |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | `#2C2230` text | `#FAFAFA` background (body copy) | **14.60 : 1** | ✅ Pass | ✅ Pass | ✅ **PASS** |
| 2 | `#FAFAFA` text | `#2C2230` background (dark sections / footer) | **14.60 : 1** | ✅ Pass | ✅ Pass | ✅ **PASS** |
| 3 | `#FAFAFA` text | `#D48C80` button fill (primary CTA) | **2.56 : 1** | ❌ Fail | ❌ Fail | ❌ **FAIL** |
| 4 | `#10B981` icon / badge | `#FAFAFA` background (trust badge) | **2.43 : 1** | ❌ Fail | ❌ Fail | ❌ **FAIL** |
| 5 | `#F59E0B` icon / badge | `#FAFAFA` background (deposit warning) | **2.06 : 1** | ❌ Fail | ❌ Fail | ❌ **FAIL** |

### Luminance Reference

| Color | Hex | Relative Luminance (L) |
| :--- | :---: | :---: |
| Premium Slate Plum | `#2C2230` | 0.01892 |
| Warm Silk White | `#FAFAFA` | 0.95610 |
| Warm Terracotta / Primary CTA | `#D48C80` | 0.34338 |
| Forest Emerald / Trust Badge | `#10B981` | 0.36453 |
| Amber Gold / Deposit Warning | `#F59E0B` | 0.43859 |

---

## Resolved — Accessibility Fix Decision (Approved 2026-08-09)

**Decision:** All three failing pairings (`OI-COLOR-001`, `OI-COLOR-002`, `OI-COLOR-003`) are resolved by a single unified rule, not three separate color changes:

> **Text and icons placed on any of the three warm accent colors (`#D48C80` Terracotta, `#10B981` Emerald, `#F59E0B` Amber) must use `#2C2230` (Slate Plum), never white or the raw palette color, and never used as text/icon color directly against `#FAFAFA`.**

This is a **Design System / component-usage decision**, not a brand palette change — all three locked `BRAND-021` hex values remain exactly as approved. No Change Request is required.

| Component | Fix | Verified Ratio | Result |
| :--- | :--- | :---: | :---: |
| Primary CTA button (`#D48C80` fill) | `#2C2230` text/icon on top | **5.7 : 1** | ✅ PASS |
| Trust Badge (`#10B981` fill) | `#2C2230` text/icon on top | **6.01 : 1** | ✅ PASS |
| Deposit Warning (`#F59E0B` fill) | `#2C2230` text/icon on top | **7.09 : 1** | ✅ PASS |

**Correction to prior analysis:** The original `OI-COLOR-002` note suggesting that swapping foreground/background roles would improve the `#10B981`/`#FAFAFA` ratio was incorrect — contrast ratio is symmetric between two colors regardless of which is treated as foreground or background (both orderings equal 2.43:1, which fails even the 3:1 UI-component threshold). The fix above (a third color, `#2C2230`, as text on the `#10B981` fill) is what resolves it, not reordering the original pair.

**Approved by:** Business Owner  
**Approval Date:** 2026-08-09
