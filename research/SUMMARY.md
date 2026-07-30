# Executive Research Summary: Easy Orders Platform

Version: 1.0.0  
Status: Approved  
Owner: Documentation Engineer  
Last Updated: 30-07-2026  
Synthesized From: RS-01A, RS-02, RS-03, RS-04, RS-05, RS-06  

---

## 1. Overview & Purpose

This document provides a high-level architectural summary of the **Easy Orders storefront platform**, compiling verified technical insights from research sessions **RS-01A through RS-06**. It serves as an executive overview for engineers, architects, and designers before diving into individual research sessions or building custom themes.

---

## 2. Platform Architecture & Documentation Map (RS-01A)

The Easy Orders platform ecosystem is divided into four distinct documentation domains:
1. **Dashboard Documentation**: Merchant-facing store operations, inventory, and order management.
2. **Themes Documentation**: Theme development guidelines, built-in section references, Liquid reference, and CLI tools.
3. **Public API Documentation**: External integrations, REST APIs (Products, Categories, Orders, Webhooks), and authentication.
4. **Funnels Builder**: Marketing funnel template creation.

**Key Architecture Takeaway**: Easy Orders storefronts operate as a hybrid platform where core business logic, cart operations, routing, and checkout are managed by an underlying React Single Page Application (SPA), while visual presentation is delegated to custom Liquid themes.

---

## 3. Theme System & File Structure (RS-02)

An Easy Orders Custom Theme follows a strict file map. Standard themes consist of:
- `schema.json`: Root configuration defining store-wide merchant settings (colors, typography, toggles).
- `style.css`: Global stylesheet loaded across all storefront pages.
- `script.js`: Global JavaScript file loaded across all storefront pages.
- `sections/*.liquid`: 20 built-in section templates governing layout, home, product, and utility rendering.
- `home-sections/<custom_block>/template.liquid` & `config.json`: Bespoke compositional blocks available for the homepage.
- `product-data-schema.json`: Schema for per-product merchant-customizable settings.

**CLI Lifecycle**: Local theme development uses the Easy Orders CLI to open a local preview tunnel, injecting local code payload (`code=...`) into a live test store while maintaining live store settings.

---

## 4. Liquid Runtime & Data Hydration (RS-03)

Easy Orders uses **LiquidJS** (a JavaScript implementation of the Liquid template language) to render section templates:
- **Data Injections**: The platform hydrates LiquidJS contexts with dynamic store objects prior to outputting HTML strings.
- **Global Settings (`theme_data`)**: Exposes merchant settings configured in `schema.json` globally across all section templates.
- **Custom Section Settings (`section_data`)**: Exposes settings from `home-sections/<block>/config.json` to custom blocks.
- **Product Settings (`product_theme_data`)**: Exposes per-product settings from `product-data-schema.json`.

---

## 5. Rendering Lifecycle & SPA Routing (RS-04 & RS-06)

1. **Section-Based Rendering Engine**: Easy Orders does **not** use monolithic page wrappers (e.g., no `index.liquid` or `product.liquid`). Pages are dynamically constructed by injecting section HTML strings into React **Section Containers**.
2. **Layout Shell**: `header.liquid` and `footer.liquid` form the persistent layout shell around every route. Header is rendered Server-Side (SSR) on initial load for optimal perceived performance.
3. **SPA Navigation**: The storefront React shell automatically intercepts internal `<a>` clicks (same-origin) to handle client-side routing without full page reloads. External links, `target="_blank"`, and `download` links bypass interception.

---

## 6. Built-in Section Architecture & Contracts (RS-04 & RS-05)

The platform provides exactly **20 built-in sections** across four domains:
- **Layout (2)**: `header.liquid`, `footer.liquid`.
- **Home & Product Lists (5)**: `slider.liquid`, `categories.liquid`, `featured-products.liquid`, `list-products.liquid`, `home-products-grid.liquid`.
- **Product Details (7)**: `breadcrumbs.liquid`, `gallery.liquid`, `product-details.liquid`, `product-description.liquid`, `fixed-buy-button.liquid`, `reviews.liquid`, `related-products.liquid`.
- **Utility & Checkout (6)**: `fake-visitor.liquid`, `fake-stock.liquid`, `fake-counter.liquid`, `thanks.liquid`, `order-invoice.liquid`, `products-grid.liquid`.

**Strict Contracts**: Each section operates under a explicit contract defining accessible variables, required HTML `id` attributes (e.g., `header-cart-count`, `header-wishlist-count`), and supported events.

---

## 7. DOM Event System & Communication Boundary (RS-05 & RS-06)

Because custom theme HTML is rendered inside React Section Containers:
- **Decoupled State**: Themes cannot directly mutate storefront React state or call internal JavaScript methods.
- **CustomEvent Bubbling**: Theme HTML and `script.js` communicate user actions by dispatching standard DOM `CustomEvent` objects (e.g., `buy-now`, `quick-add`, `toggle-wishlist`, `cart-click`).
- **Boundary Requirement**: All custom events **MUST** be dispatched with `{ bubbles: true }`. The React shell attaches `useLiquidEvents` listeners to parent Section Containers to catch these bubbling events and execute application state updates.

---

## 8. Key Architectural Constraints

1. **No Bespoke Page Wrappers**: Developers cannot create arbitrary `.liquid` page templates (e.g., `about-us.liquid` or `blog.liquid`).
2. **Stateless Liquid Templates**: Liquid code handles visual layout rendering only. All state transitions (cart update, quantity increment, modal toggles) are offloaded via events.
3. **Homepage Custom Block Isolation**: `home-sections/` is the only location where custom Liquid files and schemas can be added.
4. **Client-Side Entity Hydration**: Custom home blocks only receive entity IDs in `section_data`. Theme scripts must fetch full product details via the Public REST API (`/api/v1/products`) for client-side rendering.

---

## 9. Critical Implementation Implications

- **Event Compliance**: Every interactive element (Add to Cart, Buy Now, Quantity Controls) **must** dispatch bubbling custom events (`{ bubbles: true }`) or core commerce functionality will fail silently.
- **Required Element IDs**: Header badges must include exact HTML element IDs (`header-cart-count`, `header-compare-count`, `header-wishlist-count`) for client-side sync.
- **Design Alignment**: UX/UI designs must be constrained to the 20 built-in section structures and custom homepage blocks.
