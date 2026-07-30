# SESSION_TEMPLATE

Version: 1.0.0
Status: Active
Owner: Documentation Engineer

## Session Metadata
- **Session ID**: RS-05
- **Epic**: Research Infrastructure
- **Knowledge Domain**: Easy Orders Theme Architecture
- **Title**: Theme Variables & Section Contracts
- **Keywords**: [variables, sections, contracts, events, scope, liquid]
- **Related Sessions**: [RS-02, RS-03, RS-04]
- **Version**: 1.0.0
- **Created Using Template Version**: 2.2.0
- **Last Migrated**: 30-07-2026
- **Status**: Approved
- **Date**: 30-07-2026
- **Researcher**: AI Assistant
- **Reviewer**: Documentation Owner
- **Review Date**: 30-07-2026
- **Review Status**: Approved
- **Last Updated**: 30-07-2026

## Objective
To document the contracts of every built-in Easy Orders section, including available variables, expected inputs, rendering contexts, required IDs, supported settings, data scopes, and interaction contracts.

## Research Scope
- **In Scope**: Documenting the variables, events, and rendering contracts of the 20 built-in Easy Orders theme sections.
- **Out of Scope**: Implementing these sections, reviewing standard liquid tags, exploring non-theme platform APIs.

## Research Questions

### Primary Research Question
- How does each Easy Orders built-in section expose data, settings, variables, and rendering responsibilities?

### Secondary Research Questions
- What are the available Liquid objects and variables for every section?
- What are the required DOM IDs and Custom Events?
- What is the rendering lifecycle and scope?
- What are the limitations and dependencies?

## Official Sources
- [Easy Orders Layout Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/layout-sections)
- [Easy Orders Product Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/product-sections)
- [Easy Orders Home Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/home-sections)
- [Easy Orders Utility Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/utility-sections)

## Facts

### Layout Sections Contract
- **header.liquid**: Rendered server-side (SSR) on first load.
  - **Variables**: `logo`, `store_name`, `categories`, `announcement_config`, `announcement_text`, `cart_count`, `compare_count`, `wishlist_count`, `is_register_active`, `theme_data`.
  - **Required IDs**: `header-cart-count`, `header-compare-count`, `header-wishlist-count`, `header-lang-btn`, `header-lang-mobile`, `header-register`, `header-register-mobile`.
  - **Events**: `cart-click`, `compare-click`, `lang-click`, `register-click`.
- **footer.liquid**: Rendered client-side.
  - **Variables**: `logo`, `store_name`, `categories`, `pages`, `social`, `year`, `payment_img`, `phone`, `email`, `address`, `has_contact`, `shop_label`, `help_label`, `subscribe_label`, `email_placeholder`, `follow_label`, `rights_label`, `show_powered`, `theme_data`.
  - **Events**: `footer-subscribe`.

### Product Sections Contract
- **breadcrumbs.liquid**: 
  - **Variables**: `categories`, `product_name`, `home_text`.
- **gallery.liquid**: 
  - **Variables**: `images`, `mainImage`, `product_name`, `theme_data`. No events required (client-side only behavior).
- **product-details.liquid**: 
  - **Variables**: `product_name`, `price`, `sale_price`, `currency`, `rating`, `reviews_count`, `description`, `product_id`, `theme_data`, `product_theme_data`.
  - **Events**: `toggle-wishlist`, `toggle-compare`.
- **product-description.liquid**: 
  - **Variables**: `description`, `description_label`, `policies`, `theme_data`.
- **fixed-buy-button.liquid**: 
  - **Variables**: `product_name`, `price`, `sale_price`, `currency`, `thumb`, `buy_now_text`, `quantity`, `disabled`, `hide_quantity`, `increase_disabled`, `theme_data`.
  - **Events**: `buy-now`, `increment-quantity`, `decrement-quantity`.
- **reviews.liquid**: 
  - **Variables**: `reviews`, `reviews_count`, `average_rating`, `average_rating_display`, `t_users_reviews`, `t_reviews`, `t_share_your_review`, `t_no_reviews`, `theme_data`.
  - **Required Attributes**: `data-review-open` on the button to open the modal.
- **related-products.liquid**: 
  - **Variables**: `products`, `category`, `section_title`, `currency`, `add`, `shop_now`, `sale`, `theme_data`.
  - **Events**: `quick-add`, `quick-view`.

### Home & List Sections Contract
- **slider.liquid**: 
  - **Variables**: `slides` (each with `image`, `mobile_image`, `url`, `alt`), `theme_data`.
- **categories.liquid**: 
  - **Variables**: `categories`, `theme_data`.
- **featured-products.liquid**, **list-products.liquid**, **home-products-grid.liquid**, **products-grid.liquid**: 
  - **Variables**: `products`, `category`, `section_title`, `currency`, `add`, `shop_now`, `sale`, `hide_view_all`, `theme_data`.
  - **Events**: `quick-add`, `quick-view`, `toggle-wishlist`, `toggle-compare`.

### Utility Sections Contract
- **fake-visitor.liquid**: `min`, `max`, `watching_text`, `theme_data`. Requires custom script.js animation using data attributes.
- **fake-stock.liquid**: `text`, `theme_data`.
- **fake-counter.liquid**: `hours`, `product_id`, `title`, `label_days`, `label_hours`, `label_minutes`, `label_seconds`, `theme_data`. Requires custom script.js animation.
- **thanks.liquid**: `content`, `show_home_button`, `thanks_title`, `thanks_message`, `phone_message`, `go_home_text`, `offers_text`, `theme_data`. Event: `go-home`.
- **order-invoice.liquid**: `order` (object with full details), `order_notes`, `currency`, `logo`, `store_name`, `tracking_link`, `has_contact`, `contact_phone`, `contact_email`, `contact_address`, plus translation strings. Event: `copy-tracking-link`.

### Custom Home Sections Contract
- `home-sections/<name>/template.liquid`: Has access to `section_data` (local instance settings from config.json) and `theme_data` (global settings).
- **Data Hydration**: Uses `data-eo-hs-entity` and `data-eo-hs-ids` to hydrate products/categories client-side, since `section_data` only contains IDs.

## Observations
- **Event Bus Ubiquity**: Almost all interactive behaviors (adding to cart, wishlist, changing language, etc.) rely on standard DOM `CustomEvent` dispatching with `{bubbles: true}`. The Easy Orders React shell listens for these at the boundary of the injected HTML.
- **Client-Side Hydration for Extensions**: The storefront does not execute heavy logic for custom blocks. If a developer uses a custom product picker in `home-sections/`, they must write a script to hit the Easy Orders API (`/api/v1/products`) and hydrate the DOM manually, using skeleton loaders during fetch.
- **Utility Constraints**: Fake visitor and fake counter sections have no engine-backed timer/randomizer. The storefront merely outputs the variables; the theme `script.js` is entirely responsible for the animation and persistence.

## Insights
- **Loose Coupling**: The strict variable contracts and reliance on `CustomEvents` creates a loosely coupled architecture. The theme is completely unaware of the app state (React), and the app state is completely unaware of the DOM structure (Liquid), connecting only via predefined IDs and CustomEvents.
- **Stateless Liquid**: Liquid templates in Easy Orders are virtually stateless and non-interactive. All interactivity must be provided by the theme's `script.js` or by bubbling events to the core application.

## Engineering Impact
- Theme engineers must rigorously implement the required CustomEvents, especially `buy-now`, `quick-add`, and quantity controls, otherwise core commerce functionality will quietly fail without console errors (because the React shell simply won't receive the event).

## Open Questions
- There are no unresolved questions within the documented scope.

## Decision Candidates
- We may need to standardize a reusable `CustomEvent` helper function inside `script.js` to ensure consistent `{ bubbles: true }` dispatching and prevent developer error.

## Next Session
- **Website UX/CRO Audit**: Prepare to audit the UX and conversion rate optimization aspects of the default theme structure.

## Architectural Relationships
- **Depends On**: RS-02 Theme Architecture, RS-03 Liquid Variables & Data Hydration, RS-04 Theme Templates & Page Architecture.
- **Enables**: UX/CRO Auditing and future theme implementations.

## Reference Impact
- **Purpose**: Determine whether this session requires updates to any Reference document.
- **Reference Files Affected**: 
  - `EVENTS_REFERENCE.md`
  - `LIQUID_OBJECTS_REFERENCE.md`
- **Reason**: Discovered `buy-now`, `increment-quantity`, `decrement-quantity`, `quick-add`, `quick-view`, `footer-subscribe`, `go-home`, `copy-tracking-link` events. Also need to add new Liquid Objects (`order`, `product`, `slides`, `images`, `reviews`).

## Terminology
- **Client-Side Hydration**: The process of fetching entity data (like products) via the REST API to populate a custom block whose `section_data` only contains IDs.
- **Section Contract**: The explicit list of variables guaranteed to be passed to a `.liquid` file by the Easy Orders storefront engine.

## References
- [Easy Orders Layout Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/layout-sections)
- [Easy Orders Product Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/product-sections)
- [Easy Orders Home Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/home-sections)
- [Easy Orders Utility Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/utility-sections)

## Research Confidence
- **Confidence Level**: High
- Derived entirely from the official Easy Orders sections documentation.

## Validation Checklist
- [x] Official sources only
- [x] No assumptions recorded as facts
- [x] Primary Research Question answered
- [x] Research scope respected
- [x] No implementation performed
