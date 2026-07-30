# Standard IDs Reference

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer

## Purpose
To provide a quick reference for Standard IDs across the Easy Orders custom themes platform.

## Update Rules
- This document is derived from Research Sessions.
- Do not introduce facts here that are not already documented in an approved Research Session.
- Cite the originating session for all entries.

## Relationship to Research Sessions
This file consolidates knowledge from various research sessions. It is a navigational lookup tool, not the source of truth.

## Reference Entries

### `header-cart-count`
- **Purpose**: Required HTML `id` attribute for the cart badge. Relied upon by the storefront for client-side syncing.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `header-compare-count`
- **Purpose**: Required HTML `id` attribute for the compare badge. Relied upon by the storefront for client-side syncing.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `header-wishlist-count`
- **Purpose**: Required HTML `id` attribute for the wishlist badge. Relied upon by the storefront for client-side syncing.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03, RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `header-lang-btn` / `header-lang-mobile`
- **Purpose**: Required HTML `id` attribute for the desktop and mobile language controls. Hidden when the Multi-language plugin is not active.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `header-register` / `header-register-mobile`
- **Purpose**: Required HTML `id` attribute for the desktop and mobile register controls. Reserved for a future storefront feature.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026
