# SESSION_TEMPLATE

Version: 1.0.0
Status: Active
Owner: Documentation Engineer

## Session Metadata
- **Session ID**: RS-04
- **Epic**: Research Infrastructure
- **Knowledge Domain**: Easy Orders Theme Architecture
- **Title**: Easy Orders Theme Templates & Page Architecture
- **Keywords**: [templates, sections, layout, hierarchy, rendering, routing]
- **Related Sessions**: [RS-02, RS-03]
- **Version**: 1.0.0
- **Created Using Template Version**: 2.1.0
- **Last Migrated**: DD-MM-YYYY
- **Status**: Approved
- **Date**: 30-07-2026
- **Researcher**: AI Assistant
- **Reviewer**: Documentation Owner
- **Review Date**: 30-07-2026
- **Review Status**: Approved
- **Last Updated**: 30-07-2026

## Objective
To research and document how Easy Orders organizes page templates and page rendering inside Custom Themes.

## Research Questions

### Primary Research Question
- How does Easy Orders organize page templates and page rendering inside Custom Themes?

### Secondary Research Questions
- What is every supported page template?
- What is the page hierarchy and routing behavior?
- What is the rendering lifecycle?
- What are the available sections for each template?
- What are the page-specific variables and customization boundaries?
- How are non-product pages templated?

## Official Sources
- [Easy Orders Layout Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/layout-sections)
- [Easy Orders Product Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/product-sections)
- [Easy Orders Home Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/home-sections)
- [Easy Orders Utility Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/utility-sections)
- [Easy Orders Getting Started](https://themes-docs.easy-orders.net/docs/custom-themes/getting-started)

## Facts
- Easy Orders Custom Themes use a "Section-based Rendering Engine" without monolithic page templates (e.g., no `product.liquid` or `index.liquid`).
- There are exactly 20 built-in section templates grouped into 4 functional domains.
- **Layout Shell**: `header.liquid`, `footer.liquid`. These form the persistent shell across all pages and are rendered server-side on first load.
- **Home Route (`/`)**: Renders `featured-products.liquid`, `list-products.liquid`, `home-products-grid.liquid`, `slider.liquid`, `categories.liquid`, plus any optional custom blocks defined inside `home-sections/`.
- **Product Route**: Renders `breadcrumbs.liquid`, `gallery.liquid`, `product-details.liquid`, `product-description.liquid`, `fixed-buy-button.liquid`, `reviews.liquid`, `related-products.liquid`.
- **Search & Collections Routes**: Render `products-grid.liquid`.
- **Utility & Checkout Routes**: Render `fake-visitor.liquid`, `fake-stock.liquid`, `fake-counter.liquid`, `thanks.liquid`, `order-invoice.liquid`.
- Routing is implicit and handled exclusively by the storefront engine; sections are injected into the page based on the current URL.
- Non-product generic pages (like "About Us") use dynamic schema entities (`page_multi_select`, `page_single_select`), but there is no dedicated `page.liquid` section in the 20 built-in templates.
- Custom blocks can only be added to the homepage via the `home-sections/<name>/template.liquid` directory structure.

## Observations
- Because routing is strictly controlled by the Easy Orders storefront, themes are purely presentational fragments. A theme cannot define entirely new URLs or routes backed by new `.liquid` files.
- The `home-sections/` directory is the only location where developers can introduce completely bespoke compositional blocks with their own schema (`config.json`).
- Social proof utilities (`fake-visitor`, `fake-stock`) are standalone sections rather than snippets, meaning their placement is likely managed by the storefront's layout manager rather than manually included inside `product-details.liquid`.

## Insights
- **Design Constraint**: UX/UI Designers must restrict architectural designs to the available 20 sections and custom home blocks. You cannot design a bespoke layout for a "Blog" or "About Us" page if the storefront engine doesn't expose a dedicated section for it.
- **Modularity**: By separating the persistent layout (`header`, `footer`) from page content, the storefront allows rapid client-side transitions and modular caching, making the theme highly performant.

## Business Impact
- Ensures themes strictly comply with the platform's constraints, preventing costly design rework for page types that cannot be implemented (e.g., custom blog structures).

## Engineering Impact
- Theme engineers do not write routing logic or full-page HTML wrappers. They focus purely on isolated section components and their required Liquid variables.

## Open Questions
- How does the storefront render generic CMS pages (e.g., Privacy Policy, About Us, Terms)? Are they entirely unthemed other than inheriting the Header, Footer, and global CSS?
- Are the social proof widgets strictly locked to the Product page, or can they be embedded elsewhere?

## Potential Future Decisions
- We may need to adopt a standardized "Custom Page Hack" using `home-sections/` and client-side JavaScript if complex bespoke pages are requested by the business.

## Next Session
- **RS-05 Theme Variables & Section Contracts**: Research the exact Liquid variables, attributes, and data structures available within each of the 20 built-in sections to finalize the technical contracts.

## Reference Impact
- **Purpose**: Determine whether this session requires updates to any Reference document.
- **Reference Files Affected**: 
  - `THEME_VARIABLES_REFERENCE.md`
  - `EVENTS_REFERENCE.md`
  - `STANDARD_IDS_REFERENCE.md`
- **Reason**: The documentation for Layout sections revealed new global variables, required element IDs (e.g., `header-cart-count`), and CustomEvents (e.g., `cart-click`). These must be synchronized.

## Terminology
- **Section-based Rendering Engine**: An architectural pattern where the platform constructs pages by combining isolated fragments (sections) rather than executing a single full-page monolithic template.
- **Layout Shell**: The persistent HTML structure (Header, Footer) that wraps page-specific sections.

## References
- [Easy Orders Getting Started](https://themes-docs.easy-orders.net/docs/custom-themes/getting-started)
- [Easy Orders Sections Category](https://themes-docs.easy-orders.net/docs/category/sections)
- [Easy Orders Layout Sections](https://themes-docs.easy-orders.net/docs/custom-themes/sections/layout-sections)

## Research Confidence
- **Confidence Level**: High
- The File Map Reference in the official documentation explicitly lists all 20 template files and their strict functional mappings, leaving no ambiguity about the rendering hierarchy.

## Validation Checklist
- [x] Official sources only
- [x] No assumptions recorded as facts
- [x] Primary Research Question answered
- [x] Research scope respected
- [x] No implementation performed
