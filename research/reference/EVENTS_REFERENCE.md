# Events Reference

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer

## Purpose
To provide a quick reference for Events across the Easy Orders custom themes platform.

## Update Rules
- This document is derived from Research Sessions.
- Do not introduce facts here that are not already documented in an approved Research Session.
- Cite the originating session for all entries.

## Relationship to Research Sessions
This file consolidates knowledge from various research sessions. It is a navigational lookup tool, not the source of truth.

## Reference Entries

### Architectural Event Flow
Custom themes communicate with the storefront Single Page Application (SPA) through bubbling DOM events. 
- **Trigger**: HTML element in Liquid template (e.g., `onclick="this.dispatchEvent(new CustomEvent('buy-now', { bubbles: true }))"`).
- **Boundary**: React Section Container listens via `useLiquidEvents`.
- **Handling**: SPA logic executes (e.g., cart operations, navigation).
- **Originating Session(s)**: RS-06
- **Confidence**: High
- **Last Verified**: 30-07-2026


### `cart-click`
- **Purpose**: Bubbling CustomEvent dispatched to trigger the side cart.
- **Scope**: Global (typically from header)
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `compare-click`
- **Purpose**: Bubbling CustomEvent dispatched to trigger the compare modal.
- **Scope**: Global
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `lang-click`
- **Purpose**: Bubbling CustomEvent dispatched to toggle the language dropdown.
- **Scope**: Global
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `register-click`
- **Purpose**: Bubbling CustomEvent dispatched to navigate to the register page.
- **Scope**: Global
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `toggle-wishlist`
- **Purpose**: Bubbling CustomEvent to toggle a product in the wishlist. Requires a `detail` object `{ productId: '...' }` matching the product's `id`.
- **Scope**: Product sections
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `toggle-compare`
- **Purpose**: Bubbling CustomEvent to toggle a product in the compare list. Requires a `detail` object `{ productId: '...' }` matching the product's `id`.
- **Scope**: Product sections
- **Originating Session(s)**: RS-03
- **Confidence**: High
- **Last Verified**: 29-07-2026

### `buy-now`
- **Purpose**: Bubbling CustomEvent to trigger the buy/checkout action.
- **Scope**: Fixed buy button section
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `increment-quantity` / `decrement-quantity`
- **Purpose**: Bubbling CustomEvents to adjust the selected quantity of a product.
- **Scope**: Fixed buy button section
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `quick-add`
- **Purpose**: Bubbling CustomEvent to add a product to the cart. Requires `{ productId: '...' }`.
- **Scope**: Product grid and list sections
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `quick-view`
- **Purpose**: Bubbling CustomEvent to open the quick-view modal. Requires `{ productId: '...' }`.
- **Scope**: Product grid and list sections
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `footer-subscribe`
- **Purpose**: Bubbling CustomEvent to submit a newsletter subscription. Requires `{ email: '...' }`.
- **Scope**: Footer section
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `go-home`
- **Purpose**: Bubbling CustomEvent to navigate to the store homepage.
- **Scope**: Thanks section
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026

### `copy-tracking-link`
- **Purpose**: Bubbling CustomEvent to copy the order tracking link and show a toast. Requires `{ link: '...' }`.
- **Scope**: Order invoice section
- **Originating Session(s)**: RS-05
- **Confidence**: High
- **Last Verified**: 30-07-2026
