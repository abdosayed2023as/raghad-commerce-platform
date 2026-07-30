# Liquid Objects Reference

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer

## Purpose
To provide a quick reference for Liquid Objects across the Easy Orders custom themes platform.

## Update Rules
- This document is derived from Research Sessions.
- Do not introduce facts here that are not already documented in an approved Research Session.
- Cite the originating session for all entries.

## Relationship to Research Sessions
This file consolidates knowledge from various research sessions. It is a navigational lookup tool, not the source of truth.

## Reference Entries

### `logo`
- **Purpose**: Store logo image URL.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `store_name`
- **Purpose**: Store name.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `categories`
- **Purpose**: Hierarchical categories array.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `cart_count`
- **Purpose**: Cart item count for initial server-side rendering.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `compare_count`
- **Purpose**: Compare list count for initial server-side rendering.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `wishlist_count`
- **Purpose**: Wishlist count for initial server-side rendering.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `is_register_active`
- **Purpose**: Boolean indicating if the register feature is active.
- **Scope**: Layout header section (`header.liquid`)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `product`
- **Purpose**: Product object containing properties like `id`, `name`, `slug`, `price`, `sale_price`, `thumb`, `images`, `variations`.
- **Scope**: Product listing sections (inside `products` loop)
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `order`
- **Purpose**: Comprehensive order object containing customer info, status, totals, and `cart_items`.
- **Scope**: Order invoice section (`order-invoice.liquid`)
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `slides`
- **Purpose**: Array of slide objects containing `image`, `mobile_image`, `url`, `alt`.
- **Scope**: Slider section (`slider.liquid`)
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `images`
- **Purpose**: Array of gallery asset URLs (images/videos) for a product.
- **Scope**: Product gallery section (`gallery.liquid`)
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `reviews`
- **Purpose**: Array of review objects containing `rating`, `user_name`, `comment`, `image`.
- **Scope**: Reviews section (`reviews.liquid`)
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026
