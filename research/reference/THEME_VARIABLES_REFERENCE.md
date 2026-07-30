# Theme Variables Reference

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer

## Purpose
To provide a quick reference for Theme Variables across the Easy Orders custom themes platform.

## Update Rules
- This document is derived from Research Sessions.
- Do not introduce facts here that are not already documented in an approved Research Session.
- Cite the originating session for all entries.

## Relationship to Research Sessions
This file consolidates knowledge from various research sessions. It is a navigational lookup tool, not the source of truth.

## Reference Entries

### `theme_data`
- **Purpose**: A flat JSON object containing store-wide merchant settings from `schema.json`.
- **Scope**: Global (available in all section templates)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `section_data`
- **Purpose**: Data specific to a custom home section instance, derived from `section_schema`.
- **Scope**: Custom home sections (`home-sections/*/template.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `product_theme_data`
- **Purpose**: Per-product custom settings derived from `product-data-schema.json`.
- **Scope**: Product detail page templates
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `product.product_theme_data`
- **Purpose**: Per-product custom settings accessed for an individual product in a list.
- **Scope**: Product listing sections (inside `{% for product in products %}` loops)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `logo` / `store_name`
- **Purpose**: Store logo image URL and fallback store name text.
- **Scope**: Layout header section
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `categories`
- **Purpose**: Nav items array (each with `name`, `url`, and optional `children`).
- **Scope**: Layout header section, Home categories section
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `announcement_config` / `announcement_text`
- **Purpose**: Announcement bar configuration (slider/marquee/simple) and fallback text.
- **Scope**: Layout header section
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `cart_count` / `compare_count` / `wishlist_count`
- **Purpose**: Pre-rendered server-side counts to initialize the header badges.
- **Scope**: Layout header section
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `is_register_active`
- **Purpose**: Boolean indicating if the register control should be shown.
- **Scope**: Layout header section
- **Originating Session(s)**: RS-04
- **Confidence**: High
- **Last Verified**: 30-07-2026
