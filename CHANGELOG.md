# Changelog

All notable changes to this project will be documented in this file.

## [2.7.0] - 2026-08-10

### Added
- `docs/design/logo/` — **approved production logo system** (Version A): SVG masters, full-color PNGs, monochrome variants, favicons 16/32/48/180.
- `tools/logo-pipeline/export-final.js` — reproducible production export (seal word locked at 70% of inner ring diameter).
- `docs/design/LOGO_GUIDELINES.md` — usage rules, clear space, minimum sizes, approved variants.
- `docs/archive/logo-exploration-pre-approval/` — archived concept studies and Stage 3 drafts.

### Changed
- Logo direction locked by Business Owner: geometric seal + circular terracotta Ghain accent (concepts 2 × 3). Exploration and draft vectors removed from the active design path.

## [2.6.1] - 2026-08-10

### Added
- `tools/logo-pipeline/` — reproducible vector-construction pipeline (fontkit shaping of Cairo glyph outlines + SVG assembly + PNG rendering).
- `docs/design/logo-concepts/vector/` — Stage 3 masters: baseline wordmarks (700/800), seal drafts, and v2 iteration (circular terracotta Ghain dot per Business Owner preference for concepts 2×3) including a stacked lockup with Latin caption.

### Changed
- Direction refined per Business Owner Stage 4 feedback: geometric-soft letterforms (concept 2) with seal architecture (concept 3); heavy calligraphic treatment dropped.

## [2.6.0] - 2026-08-10

### Added
- `docs/design/logo-concepts/` — logo design brief (`LOGO_DESIGN_BRIEF.md` v1.1) and three raster concept studies (Embrace, Modern Clarity, Seal).

### Changed
- Logo brief Part B upgraded from "AI is exploration only" to an approved AI vector-production workflow: final mark derived from shaped Cairo glyph outlines (SIL OFL) with five staged quality gates. Direction locked by Business Owner: seal architecture × softened calligraphic letterforms.

## [2.5.1] - 2026-08-10

### Fixed
- `README.md` — removed the empty "Repository Architecture Documents" table and its self-referencing note (leftover from the v2.5.0 consolidation); added the live store and `docs/CURRENT_STATE.md` to the status block.
- `README_FOR_AI.md` — remaining two references to `PROJECT_STATE.md` as state owner updated to `docs/CURRENT_STATE.md`.
- `docs/architecture/adr/ADR-003_DOMAIN.md` — removed duplicate Related Documents link produced by the link sweep.
- `docs/CURRENT_STATE.md` — §7 retitled as a historical record instead of "Latest Repository Changes (v2.4.2)".

## [2.5.0] - 2026-08-10

### Added
- `docs/CURRENT_STATE.md` — "Live Business Baseline" section recording the operational store (`raghadkids.com`), first-year order data (≈143 orders, AOV ≈500 EGP), and current low-activity operating mode. Corrects the repository's greenfield-launch framing.

### Changed
- Meta-documentation consolidated: 12 redundant navigation/onboarding documents archived to `docs/archive/meta-consolidation-v2.5/`. Canonical set: `README.md` (human entry), `AI_CONTEXT.md` (AI entry), `README_FOR_AI.md` (AI policies), `docs/CURRENT_STATE.md` (state), plus the two decision ledgers.
- Surviving documents' cross-links updated; root document version headers unified at 2.5.0.
- `ADR-007` reference in CURRENT_STATE corrected from Draft to Approved & Locked.
- Six enterprise-commerce scope-drift documents quarantined to `tools/audit-toolkit/docs/archive/scope-drift/` with explanatory banners.

### Fixed
- CHANGELOG 2.4.3 entry: phantom research file count corrected (six → five).

### Removed
- 13,661 `node_modules` files and generated logs/output untracked from git (files remain on disk; now covered by `.gitignore`).

## [2.4.3] - 2026-08-09

### Added
- Root `.gitignore` — previously an empty file, which is why `node_modules` was tracked while project documentation was not.

### Fixed
- `AI_CONTEXT.md` — corrected five locked-decision IDs that pointed to the wrong decisions (name/tagline BRAND-011→BRAND-013, domain BRAND-017→BRAND-019, architecture BRAND-018→BRAND-020, archetype BRAND-013→BRAND-015). Verified against `docs/brand/03_DECISIONS.md`.
- `docs/architecture/adr/ADR-003_DOMAIN.md` — removed incorrect `BRAND-017` reference; BRAND-017 is the Origin Story decision.
- `docs/brand/01_BRAND_BOOK.md` §15 — resolved the dual `#2C2C30` / `#2C2230` secondary color to `#2C2230` via CR-002.
- `docs/change_requests/CR-002_*.md` — status Draft → Approved & Implemented.
- `research/competitors/`, `research/personas/`, `research/market-data/`, `research/customer-interviews/` README indexes — removed entries for five files that do not exist on disk and were being cited as available evidence.

### Changed
- Repository documentation placed under version control for the first time.

## [2.4.2] - 2026-08-09

### Changed
- `docs/design/COLOR_SYSTEM.md` — resolved all 3 WCAG AA accessibility failures via unified text-on-accent rule (`#2C2230` on all warm fills). No palette colors changed; no CR required.

## [2.4.1] - 2026-08-09

### Changed
- `ADR-007` and `CR-001` (Social Media Channel Architecture) — approved by Business Owner, status updated from Draft/Proposed to Locked/Implemented.

## [2.4.0] - 2026-08-08

### Added
- `docs/architecture/adr/ADR-007_SOCIAL_CHANNEL_ARCHITECTURE.md` — Social Media Channel Architecture decision (Draft, pending Business Owner approval).
- `docs/change_requests/CR-001_SOCIAL_CHANNEL_ARCHITECTURE.md` — formal Change Request submission for ADR-007.

### Changed
- `docs/TRACEABILITY.md` — added ADR-007 to Project & Technical Decisions table.
- `DECISION_TREE.md` — added ADR-007 branch to decision tree.
- `docs/project/PROJECT_STATE.md`, `docs/PROJECT_MANIFEST.md` — updated ADR range references to reflect ADR-007 (Draft).

## [2.3.0] - 2026-08-03

### Added
- `docs/PROJECT_MANIFEST.md` — Repository Purpose, Folder Structure, Reading Order, Document Priority, Version, and Canonical Document Registry.
- `docs/architecture/adr/` — Architecture Decision Records system (`ADR-001` through `ADR-006`).
- `docs/brand/VERSION_HISTORY.md` & `docs/brand/v1.0/` — Formal brand book version history and canonical release archive directory.
- `research/` database subdirectories (`competitors/`, `customer-interviews/`, `market-data/`, `personas/`, `surveys/`, `sources/`).
- `docs/TRACEABILITY.md` — End-to-end decision traceability matrix mapping decisions to origin phase, empirical evidence, supporting files, and ADRs.
- `docs/context/AI_CONTEXT.md` — Concise 2-page AI system context & onboarding protocol.
- `docs/CURRENT_STATE.md` — Master real-time operational status, sprint priorities, and risk register.
- `docs/change_requests/` — Change Request governance system (`README.md` & `CR-000_TEMPLATE.md`).

### Changed
- Synchronized `docs/project/PROJECT_STATE.md` with `docs/CURRENT_STATE.md`.

## [2.2.0] - 2026-08-03

### Added
- `INDEX.md` (root) — Master repository navigation index organized into 8 layers.
- `SESSION_HANDOFF.md` (root) — AI-optimized 60-second project orientation document for future sessions.
- `DOCUMENT_MAP.md` (root) — Full document relationship map, ownership hierarchy, anti-duplication rules, and archive registry.
- `DECISION_TREE.md` (root) — Visual map of all 29 decisions (BRAND-001–021 and TECH/OPS-0001–0008) with rationale and authority matrix.
- `DEPENDENCIES.md` (root) — Document dependency graph, impact analysis, update responsibilities, and locked document policy.

### Changed
- `docs/project/GLOSSARY.md` — Expanded from 30 generic technical terms to 60+ entries covering Arabic brand vocabulary, strategic brand terms, supply chain terms, personas, governance terms, and platform terms. Version bumped to 2.0.0.
- `docs/project/PROJECT_CONTEXT.md` — Fixed critical brand name inconsistency ("Raghad World" → "رغد | Raghad / RCP"). Updated Vision and Mission to match approved Brand Book statements. Updated Brand Personality to reflect approved Archetype. Updated Brand Promise to reflect official tagline. Updated Long-Term Vision to reflect Monolithic Branded House model. Updated Out of Scope section to reflect actual current phase. Version bumped to 2.0.0.
- `docs/project/PROJECT_RULES.md` — Fixed legacy "Raghad World" brand name reference. Updated Last Updated date.
- `docs/project/PROJECT_WORKFLOW.md` — Fixed legacy "Raghad World" brand name reference. Replaced hardcoded AI product names (Gemini, Claude, ChatGPT) with role-based designations (Implementation Engineer, Code Reviewer, Strategist) for tool-agnostic professional governance.
- `docs/project/ROADMAP.md` — Complete rebuild. Superseded the severely outdated Sprint 1/2/3 structure (which incorrectly showed Brand Strategy as "Active Remaining Epic"). Restructured as Phase 1–8 with accurate completion states aligned with PROJECT_STATE.md. Version bumped to 2.0.0.
- `docs/brand/07_SESSION_HANDOFF.md` — Fixed hardcoded absolute Windows paths to relative paths. Added pointer to comprehensive root-level SESSION_HANDOFF.md.

## [2.1.0] - 2026-08-03


### Added
- `AI_CONTEXT.md` (root) — concise 2-page AI entry point & instant onboarding protocol.
- `README_FOR_AI.md` (root) — operational manual for AI assistants (reading order, SSOT rules, archive & update policies).
- `PROJECT_INDEX.md` (root) — master navigation index for the entire repository.
- `docs/design/` — new design system directory with 6 scaffolded specifications (`LOGO_GUIDELINES.md`, `COLOR_SYSTEM.md`, `TYPOGRAPHY.md`, `DESIGN_SYSTEM.md`, `ICONOGRAPHY.md`, `UI_COMPONENTS.md`).

### Changed
- `docs/brand-workshop/` → renamed to `docs/brand/` (canonical folder name).
- `docs/brand/02_WORKSHOP_TRANSCRIPT.md` — added historical Q&A archive banner to reduce transcript dependency.
- `docs/brand/03_DECISIONS.md` — standardized decision IDs with `BRAND-XXX` prefixes (mapping legacy `DEC-XXX`).
- `docs/project/PROJECT_DECISIONS.md` — standardized project decision IDs with `TECH-` and `OPS-` prefixes.
- `docs/project/PROJECT_CHARTER.md` — eliminated empty placeholders by cross-referencing canonical brand & project documents.
- `README.md` & `PROJECT_STATE.md` — updated all paths and navigation maps to point to `docs/brand/` and `docs/design/`.

## [2.0.0] - 2026-08-03

### Added
- `docs/archive/` — new archive directory preserving all superseded documents with full content (no information deleted).
- `docs/archive/brand-workshop-pre-refactor/` — 30 legacy/stub/phase files from brand-workshop preserved here.
- `docs/brand-workshop/01_BRAND_BOOK.md` — official Enterprise Brand Book (moved from `docs/raghad-brand-book.md` and given canonical numbering).
- `docs/brand-workshop/07_SESSION_HANDOFF.md` — filename normalized to uppercase.

### Changed
- `docs/project/PROJECT_STATE.md` — updated from stale Sprint 2 state to reflect current reality: brand strategy 100% complete, next phase is Visual Identity.
- `README.md` — complete rewrite to reflect current project phase, brand identity quick reference, and clean navigation for all canonical files.
- `docs/brand-workshop/` — reduced from 42 files to 8 canonical files (zero information loss; all content preserved or archived).

### Removed (Archived)
- `docs/brand/BRAND_BOOK.md` — v1.0 brand book with old "عالم رغد | Raghad World" name. Superseded. Archived to `docs/archive/BRAND_BOOK_v1.0_SUPERSEDED.md`.
- `docs/MASTER_REVIEW.md` — duplicate of `docs/brand-workshop/05_MASTER_REVIEW.md`. Archived.
- `docs/raghad-brand-book.md` — moved to `docs/brand-workshop/01_BRAND_BOOK.md`.
- `docs/raghad-brand-book.zip` — binary asset with no documentation value. Removed.
- `gpt-chat.md` (root) — 113KB raw AI chat log with no structured documentation value. Removed.
- 7 empty directories: `docs/branding/`, `docs/business/`, `docs/cro/`, `docs/decisions/`, `docs/easyorders/`, `docs/ui/`, `docs/ux/`.
- 30 legacy brand-workshop files (stubs, phase-xx files, early session logs) — all archived to `docs/archive/brand-workshop-pre-refactor/`.

## [1.0.0] - 2026-07-29

### Added
- Created Bootstrap system (`prompts/bootstrap_*.md`) for ChatGPT, Gemini, and Claude.
- Introduced `Task Completion Protocol (TCP)` in `PROJECT_WORKFLOW.md`.
- Defined `Mandatory Task Completion Checklist` in `AI_TEAM_RULES.md`.
- Added `Documentation Impact Assessment` guidelines in `DOCUMENTATION_STANDARDS.md`.
- Established `Project Roles` section within `PROJECT_CONTEXT.md`.
- Added project principle: "Conversations are temporary. Documentation is permanent." in `PROJECT_CHARTER.md`.

### Changed
- Standardized document titles to human-readable format.
- Resolved sprint inconsistency; `PROJECT_STATE.md` is now the canonical source for the current project phase.
- Centralized workflow definitions into `PROJECT_WORKFLOW.md`.
- Consolidated operational AI governance into `AI_TEAM_RULES.md`.
- Replaced generic metadata ownership with specific role-based ownership across project documents.
- Marked scaffold folders in `README.md` as reserved for future phases.
- Updated `PROJECT_DECISIONS.md` formatting and recorded DEC-0001 and DEC-0002.
