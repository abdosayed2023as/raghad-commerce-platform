# RS-03 Liquid Variables & Data Hydration

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer

## Session Metadata
- **Session ID**: RS-03
- **Epic**: Research Infrastructure
- **Knowledge Domain**: Easy Orders Theme Development
- **Title**: Liquid Variables & Data Hydration
- **Keywords**: liquid, variables, data hydration, schema, dynamic data
- **Related Sessions**: RS-02
- **Version**: 1.0.0
- **Created Using Template Version**: 2.1.0
- **Last Migrated**: 29-07-2026
- **Status**: Approved
- **Date**: 29-07-2026
- **Researcher**: AI Assistant
- **Reviewer**: Product Architect
- **Review Date**: 29-07-2026
- **Review Status**: Approved
- **Last Updated**: 29-07-2026

## Objective
To understand how Easy Orders injects dynamic data into Liquid templates, the scope and availability of variables across different sections, and how themes communicate with the core platform via events and DOM IDs.

## Research Questions

### Primary Research Question
- How is dynamic store and product data hydrated into Easy Orders custom themes via Liquid variables, and how do themes interact with the platform?

### Secondary Research Questions
- What are the different types of schema configurations?
- How are custom events and specific DOM IDs utilized for platform interactivity?

## Official Sources
- https://themes-docs.easy-orders.net/docs/custom-themes/liquid-reference
- https://themes-docs.easy-orders.net/docs/custom-themes/dynamic-theme-data
- https://themes-docs.easy-orders.net/docs/custom-themes/sections/layout-sections
- https://themes-docs.easy-orders.net/docs/custom-themes/sections/product-sections

## Facts
- Easy Orders custom themes use LiquidJS, a JavaScript implementation of the Liquid template language.
- Dynamic theme data schemas are defined in three places: `schema.json` (store-wide), `product-data-schema.json` (per product), and `config.json`'s `section_schema` (per custom home section).
- Root-level fields in `schema.json` and `section_schema` can be visually grouped in the editor using an optional `group` string property. The `group` property does not affect the flat structure of the stored data.
- The `theme_data` object (from `schema.json`) is available globally in all section templates.
- The `section_data` object is only available in custom home sections (`home-sections/*/template.liquid`).
- The `product_theme_data` object is available on product detail page templates, containing values for the current product.
- Inside product listing sections, `product.product_theme_data` is used within the `{% for product in products %}` loop.
- Liquid uses `{{ }}` for outputting values and `{% %}` for logic and control flow (e.g., `if`, `unless`, `for`, `case`).
- Filtering transforms values using the `|` syntax (e.g., `{{ price | floor }}`).
- Video assets are detected in Liquid by checking if the asset URL contains `.mp4`.
- The layout header section (`header.liquid`) receives variables such as `logo`, `store_name`, `categories`, `cart_count`, `compare_count`, `wishlist_count`, and `is_register_active`.
- The storefront relies on strict HTML `id` attributes for client-side syncing, such as `header-cart-count`, `header-compare-count`, and `header-wishlist-count`.
- Interactivity is achieved by dispatching bubbling `CustomEvent`s from DOM elements: `cart-click`, `compare-click`, `lang-click`, `register-click`, `toggle-wishlist`, and `toggle-compare`.
- Wishlist navigation uses a standard `<a href="/wishlist">` link rather than a custom event.
- The `toggle-wishlist` and `toggle-compare` events require a `detail` object containing `{ productId: '...' }` matching the product's `id`.

## Observations
- Data hydration happens server-side, injecting flat JSON objects into the Liquid context. There is no API required to fetch theme settings on the client side.
- Easy Orders utilizes a hybrid architecture: initial render is SSR via Liquid for fast paint, followed by client-side hydration where platform scripts attach to specific predefined IDs and classes.
- Scoping rules are strict: `section_data` cannot be used in standard sections, and `product.product_theme_data` cannot be used outside of loops in product listing templates.
- The `theme_data` flat structure simplifies access in Liquid, meaning `group` only affects the UI of the merchant admin panel, not the code logic.

## Insights
- **CSS Variable Injection**: To efficiently apply `theme_data` global settings (like colors and typography), themes should map these Liquid variables to CSS custom properties (variables) within a `<style>` block in the `<head>`, preventing the need for inline styles scattered throughout the HTML.
- **Event-Driven Architecture**: The theme's JavaScript does not need to handle the complex logic of cart management or wishlists. It only needs to dispatch the correct custom events, and the Easy Orders core platform scripts will handle the state updates and sync the DOM nodes that have the correct `id` attributes.
- **Client-Side Interception**: Internal links like categories or searches are intercepted by the storefront for SPA-like navigation, meaning standard `<a>` tags should be used without custom onClick handlers for standard navigation.

## Business Impact
- By utilizing `schema.json` and `group` visually, we can build a highly customizable, yet organized, admin interface that empowers merchants to configure the theme without touching code.
- Implementing the correct standard IDs and events ensures full compatibility with the Easy Orders platform, preventing bugs in critical conversion flows like the cart and wishlist.

## Engineering Impact
- The strict scoping of `section_data` vs `theme_data` dictates our component architecture. Components intended for home sections must be built to accept `section_data`, whereas global components will rely on `theme_data`.
- UI interactions (e.g., image gallery tab switching) must be built with standard DOM scripting (`script.js`), independent of the platform's custom events, unless interacting with core data (cart/wishlist).

## Open Questions
- Are there specific validation limits on schema fields (e.g., max string length, allowed file types for image uploads)?
- How are the `categories` hierarchical trees built and ordered from the backend?

## Potential Future Decisions
- We will adopt a standard mapping strategy to convert all `theme_data` design tokens into CSS custom properties in `header.liquid`.
- We will enforce a naming convention for custom events and IDs in our internal design system components to ensure they map perfectly to Easy Orders' requirements.

## Next Session
- **Next Session**: RS-04 Templates and Page Types
- **Primary Research Question**: What are the available page templates in Easy Orders and how do they route requests?
- **Rationale**: Having understood the architecture and data variables, the next step is to document the specific page types (templates) available in the system and their distinct contexts.

## Terminology
- **theme_data**: A flat JSON object containing store-wide merchant settings from `schema.json`.
- **section_data**: Data specific to a custom home section instance, derived from `section_schema`.
- **product_theme_data**: Per-product custom settings derived from `product-data-schema.json`.

## References
- Liquid Reference: `https://themes-docs.easy-orders.net/docs/custom-themes/liquid-reference`
- Dynamic Theme Data: `https://themes-docs.easy-orders.net/docs/custom-themes/dynamic-theme-data`
- Product Sections: `https://themes-docs.easy-orders.net/docs/custom-themes/sections/product-sections`
- Layout Sections: `https://themes-docs.easy-orders.net/docs/custom-themes/sections/layout-sections`

## Research Confidence
- **Confidence Level**: High
- The findings are based entirely on direct extraction from the official Easy Orders documentation regarding Liquid integration and data schemas.

## Validation Checklist
- [x] Official sources only
- [x] No assumptions recorded as facts
- [x] Primary Research Question answered
- [x] Research scope respected
- [x] No implementation performed
