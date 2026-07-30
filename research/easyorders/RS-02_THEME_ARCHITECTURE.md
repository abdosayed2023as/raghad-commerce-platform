# RS-02 Theme Architecture

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer

## Session Metadata
- **Session ID**: RS-02
- **Epic**: Theme Architecture
- **Title**: Core Architecture & CLI Development
- **Version**: 1.0.0
- **Status**: Approved
- **Date**: 29-07-2026
- **Researcher**: Documentation Engineer
- **Reviewer**: Product Architect
- **Review Date**: 29-07-2026
- **Review Status**: Approved
- **Last Updated**: 29-07-2026
- **Template Version**: 2.0.0

## Objective
To map out the foundational architecture, file structure, and local development lifecycle of an Easy Orders Custom Theme.

## Research Questions

### Primary Research Question
- What is the core architecture and required file structure of an Easy Orders Custom Theme?

### Secondary Research Questions
- None.

## Official Sources
- [Easy Orders Custom Themes: Getting Started](https://themes-docs.easy-orders.net/docs/custom-themes/getting-started)
- [Easy Orders Custom Themes: CLI Development](https://themes-docs.easy-orders.net/docs/custom-themes/cli-development)

## Facts
- Themes are built using `.liquid` templates, `style.css`, `script.js`, and JSON schemas (`schema.json` and optionally `product-data-schema.json`). [Source: Getting Started]
- The directory structure requires specific files to be present: `sections/` (20 built-in templates like `header.liquid`, `product-details.liquid`), `home-sections/` (optional custom homepage blocks). [Source: Getting Started]
- `style.css` and `script.js` are global and loaded on every page (minified on upload). [Source: Getting Started]
- `config.json` and `theme-data.json` are CLI-only for local preview defaults and are not part of the production upload. [Source: CLI Development]
- The Easy Orders CLI (`easyorders`) allows local scaffolding (`easyorders create`) and running a dev server (`easyorders start`). [Source: CLI Development]
- The dev server spins up on port `4000` locally and opens a Cloudflare tunnel to preview edits live on the storefront by merging local payload (templates, CSS, JS, theme data schemas) with the live store's settings. [Source: CLI Development]
- The CLI automatically acquires an authentication token via the dashboard that is short-lived and saved in `.cli-tokens.json`. [Source: CLI Development]

## Observations
- The theme architecture differs from traditional CSS-only overriding. It provides total visual and structural autonomy via Liquid templating per section.
- The distinction between `sections/` and `home-sections/` is key: `sections/` holds rigid built-in structures (e.g. `gallery.liquid`), whereas `home-sections/` offers dynamic, modular blocks specifically for the homepage (e.g. `category-mosaic`).
- Live preview merges local Liquid/CSS/JS with the live store database and configuration without overriding the live store's palette settings, making it safe for production stores.

## Insights
- We don't need a heavy build process for CSS/JS since the platform expects a single `style.css` and `script.js`. However, for Raghad World, we will need to ensure our code is organized before being compiled into those single files if the codebase gets large (though the platform handles minification on upload).
- The separation of global settings (`schema.json`) and per-product settings (`product-data-schema.json`) provides a scalable way to implement the dynamic requirements of Raghad World.
- The modularity of `home-sections/` is where we can build specialized, dynamic blocks (like Trust Badges or specialized category grids) that align with our CRO and Trust-building business goals.

## Business Impact
- Our UX and UI phases must account for the 20 built-in sections; wireframes must be mapped to these specific files (e.g. `header.liquid`, `gallery.liquid`) to ensure the designs can be implemented accurately within the platform's constraints.
- Utilizing modular `home-sections/` allows us to create dynamic homepage layouts that support trust-building and conversion rate optimization (CRO) strategies.

## Engineering Impact
- The CLI workflow will be the backbone of our development phase. We will use the CLI to iteratively preview and test designs against live store data before committing.
- Since mobile-first and performance are core principles, knowing that `style.css` and `script.js` are global means we must carefully manage CSS size to prevent bloat.

## Open Questions
- How are Liquid variables injected into these templates, and what variables are available per section?
- How do we define the configuration structure in `config.json` and `schema.json` for theme settings?

## Potential Future Decisions
- We will adopt the `easyorders` CLI as the mandatory development environment.
- We will structure our UI components strictly around the 20 built-in `sections/` templates and utilize `home-sections/` for custom homepage features.

## Next Session
- **Next Session**: RS-03 Liquid Variables & Data Hydration
- **Rationale**: Now that the core file structure and dev environment are understood, the next logical step is to understand what data is available within those Liquid templates (variables and objects) to properly design the UX/UI with real data constraints in mind.
- **Primary Research Question**: "What Liquid objects and variables are available across the built-in sections and how is data hydrated in Easy Orders Custom Themes?"

## Terminology
- **Liquid**: The templating language used by Easy Orders for rendering HTML with dynamic data.
- **home-sections**: Optional, modular building blocks specifically designed for custom homepage layouts.
- **schema.json**: The global JSON schema used to define dynamic theme data settings for the merchant.

## References
- [Easy Orders Custom Themes: Getting Started](https://themes-docs.easy-orders.net/docs/custom-themes/getting-started) - Used for facts on file structures and global assets.
- [Easy Orders Custom Themes: CLI Development](https://themes-docs.easy-orders.net/docs/custom-themes/cli-development) - Used for facts on CLI environment, dev server, and authentication.

## Research Confidence
- **Confidence Level**: High
- The official Easy Orders documentation clearly outlines the mandatory file structure, dev environment setup, and upload lifecycle, providing a complete answer to the Primary Research Question.

## Validation Checklist
- [x] Official sources only
- [x] No assumptions recorded as facts
- [x] Primary Research Question answered
- [x] Research scope respected
- [x] No implementation performed
