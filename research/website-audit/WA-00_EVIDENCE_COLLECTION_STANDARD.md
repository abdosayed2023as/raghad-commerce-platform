# WA-00 — Website Audit Evidence Collection Standard

Version: 1.2.0  
Status: Approved  
Owner: Documentation Engineer  
Last Updated: 30-07-2026  

---

## 1. Overview & Purpose

This document establishes the official **Website Audit Evidence Collection Standard** for the Raghad World project. To guarantee that every website, UX, UI, and CRO audit is objective, verifiable, and reproducible, all audit sessions must strictly adhere to the evidence collection rules defined in this standard.

No audit session may evaluate UX, UI, performance, or conversion barriers without first capturing, indexing, and organizing evidence according to this specification.

---

## 2. Target Audit Inputs

Before any evidence collection or audit begins, the auditor must explicitly define and record the following input fields in the audit session metadata:

- **Website URL:** The exact target domain/URL being audited.
- **Environment:** Production / Staging / Development / Preview.
- **Audit Scope:** Homepage, Product Listing Pages (PLP), Product Detail Pages (PDP), Cart, Checkout, Custom Pages, Header/Footer navigation.
- **Target Devices:** 
  - Desktop (Default Viewport: `1440 x 900px`)
  - Mobile (Default Viewport: `390 x 844px` - iPhone 12/13/14 baseline)
- **Target Browsers:** Chromium-based (Chrome/Edge), Safari (WebKit).
- **Authentication Requirements:** Guest / Authenticated Customer / Admin.
- **Language & Locale:** Primary language (Arabic `ar-EG`) and English (`en`) if multi-language.
- **Date & Time of Audit:** ISO Timestamp (`YYYY-MM-DDTHH:mm:ssZ`).
- **Auditor:** Official project role (e.g., `AI Assistant`, `Documentation Owner`, `Code Reviewer`).

---

## 3. Required Evidence Categories

Every website audit must collect evidence across the following 11 core categories:

| Category | Purpose | Required Files | Collection Method | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Visual Evidence** | Capture exact page layout & UI rendering | Full-page PNG screenshots (Desktop & Mobile) | Chrome DevTools Full Page Screenshot | 100% zoom, no element clipping, standard viewports |
| **Technical Evidence** | Detect console errors, broken JS & asset failures | `.log` text files, console dump | DevTools Console export | Zero unfiltered console noise; captures error stack traces |
| **Performance Evidence** | Measure load speed, Core Web Vitals (LCP, CLS, INP) | Lighthouse HTML/JSON, PageSpeed PDF | Lighthouse CLI / PageSpeed API | Same-session generation; includes mobile & desktop runs |
| **Accessibility Evidence** | Evaluate WCAG 2.1 compliance & color contrast | WAVE report summary, Lighthouse A11y JSON | WAVE extension / Lighthouse audit | Identifies contrast errors, missing ARIA tags & alt text |
| **SEO Evidence** | Inspect meta tags, structured data & canonical URLs | Schema Validator JSON export, Head dump | Rich Results Test / Schema Validator | Validates JSON-LD schema & meta tag presence |
| **Navigation Evidence** | Audit header, footer, drawer menus & breadcrumbs | Menu open screenshots, URL navigation trace | Manual capture & DOM link audit | Covers desktop navbar, mobile drawer, and footer links |
| **Customer Journey Evidence** | Track multi-step conversion funnel progression | Sequential screenshots from Home → PDP → Cart | End-to-end screen recording or step screenshots | Captures all steps in purchasing workflow |
| **Content Evidence** | Inspect typography readability, copy clarity & translations | Text extraction `.txt` or section screenshots | DOM text inspect | Identifies untranslated strings, typos & text overflow |
| **Trust Evidence** | Evaluate security badges, policy links & social proof | Badge screenshots, policy footer capture | DOM inspect & screenshot | Verifies presence & legibility of trust factors |
| **Mobile Evidence** | Evaluate mobile touch targets & thumb-zone usability | Full Mobile PNG capture (Viewport `390x844`) | Mobile emulation / Device testing | Touch targets $\ge 48\times48\text{px}$; no horizontal scroll |
| **Desktop Evidence** | Evaluate widescreen space utilization & grid alignment | Full Desktop PNG capture (Viewport `1440x900`) | Desktop browser window | Proper alignment, container max-widths respected |

---

## 4. Collection Tools & Mapping

To maintain standardization, evidence collection must use only approved tools:

| Evidence Type | Primary Tool | Secondary / Backup Tool |
| :--- | :--- | :--- |
| **Full Page Visual Capture** | Chrome DevTools (`Capture full size screenshot`) | GoFullPage Chrome Extension |
| **Performance Metrics** | Google Lighthouse (DevTools / CLI) | PageSpeed Insights |
| **Accessibility Scanning** | WAVE Web Accessibility Evaluation Tool | Lighthouse Accessibility Audit |
| **Structured Data / SEO** | Google Rich Results Test | Schema.org Validator |
| **Console & JS Diagnostics** | Chrome DevTools Console Panel | Node Script Logging |
| **Network & Asset Flow** | Chrome DevTools Network Panel (`.har` export) | WebPageTest |
| **Funnel Recording** | Native OS Screen Recorder / Chrome DevTools Recorder | Sequential Step Screenshots |

---

## 5. Evidence Repository Folder Structure

All evidence collected for an audit session must be organized inside a standardized directory structure within `research/website-audit/`:

```text
research/
└── website-audit/
    ├── WA-00_EVIDENCE_COLLECTION_STANDARD.md
    └── WA-XX_EVIDENCE/                       # XX represents audit session number (e.g., WA-01)
        ├── screenshots/
        │   ├── desktop/                      # 1440x900 full page captures
        │   └── mobile/                       # 390x844 full page captures
        ├── performance/                      # Lighthouse HTML/JSON & PageSpeed reports
        ├── accessibility/                    # WAVE & contrast audit dumps
        ├── seo/                              # Rich results & schema validator outputs
        ├── network/                          # .har files and console log dumps
        └── notes/                            # Raw data notes & session logs
```

---

## 6. File Naming Standard

All collected evidence files must adhere to strict, deterministic naming conventions:

### Visual Screenshots
- `homepage-desktop.png`
- `homepage-mobile.png`
- `plp-category-desktop.png`
- `plp-category-mobile.png`
- `pdp-product-desktop.png`
- `pdp-product-mobile.png`
- `cart-drawer-mobile.png`
- `checkout-step1-mobile.png`

### Performance & Technical Reports
- `lighthouse-homepage-desktop.html`
- `lighthouse-homepage-mobile.html`
- `lighthouse-pdp-mobile.json`
- `pagespeed-homepage-mobile.pdf`
- `network-homepage.har`
- `console-homepage-errors.log`

### Accessibility & SEO Dumps
- `wave-homepage-summary.json`
- `schema-pdp-rich-results.json`

---

## 7. Evidence Quality & Validation Requirements

1. **Full-Page Screenshot Policy:** Screenshots must capture the complete scrollable page length from Header to Footer. Cropped screenshots are prohibited unless explicitly justifying a micro-interaction (e.g., sticky CTA).
2. **Dual-Viewport Requirement:** Every audited page route MUST feature both Desktop (`1440x900`) and Mobile (`390x844`) visual evidence.
3. **Same-Session Performance Audits:** Performance, network, and accessibility scans must be generated during the exact same audit session as visual captures to avoid temporal discrepancies.
4. **Browser State Hygiene:** Audits must run in Clean Incognito / Private mode with browser extensions disabled (except required audit tools) and browser cache cleared.
5. **Display & Scaling Rules:** Zoom must be set to `100%`, device pixel ratio standard, and language set to match target locale.

---

## 8. Audit Readiness Checklist

Before beginning any Website Audit session (e.g., `WA-01`), the auditor must execute and pass the following mandatory checklist:

- [ ] Audit Target Inputs defined (URL, Environment, Scope, Viewports, Date, Auditor).
- [ ] Target evidence folder created (`research/website-audit/WA-XX_EVIDENCE/`).
- [ ] Approved collection tools verified and accessible.
- [ ] Browser cache cleared & clean testing profile active.
- [ ] Full Desktop full-page screenshots captured (`1440x900`).
- [ ] Full Mobile full-page screenshots captured (`390x844`).
- [ ] Performance reports generated (Lighthouse HTML/JSON for Desktop & Mobile).
- [ ] Accessibility reports generated (WAVE / A11y scan).
- [ ] Console logs and Network `.har` files exported if errors exist.
- [ ] All files named strictly according to File Naming Standard.

---

## 9. Evidence Source Classification (Metadata Standard)

Each collected evidence item must be indexed using the following standardized metadata schema:

| Metadata Field | Definition | Example Value |
| :--- | :--- | :--- |
| **Evidence ID** | Unique deterministic evidence identifier | `EVD-VIS-001`, `EVD-PRF-001` |
| **Evidence Category** | Category from Section 3 | `Visual Evidence`, `Performance Evidence` |
| **Source Tool** | Tool used to collect artifact | `Chrome DevTools`, `Google Lighthouse` |
| **Collection Method** | Capture technique | `Full-Page PNG Capture`, `HTML Dump` |
| **Collector** | Official project role | `AI Assistant` |
| **Collection Date** | Timestamp ISO 8601 | `2026-07-30T10:00:00Z` |
| **Target URL** | Specific URL captured | `https://store.example.com/products/item` |
| **Viewport** | Viewport dimensions | `1440x900` (Desktop), `390x844` (Mobile) |
| **Environment** | Test environment | `Production` |
| **Confidence** | Reliability rating of artifact | `High` |
| **Related Audit Session** | Associated audit session ID | `WA-01` |
| **Notes** | Additional context or observed anomalies | `Captured initial load state before scroll` |

---

## 10. Evidence Traceability Rule

To prevent unbacked assertions or subjective observations, all future audit sessions (WA-02 through WA-10) must enforce strict **Evidence Traceability**:

- **Mandatory Linkage:** Every recorded Finding (Fact, Observation, or Insight) MUST explicitly cite one or more `Evidence IDs`.
- **Traceability Pipeline:**
  $$\text{Audit Finding} \longrightarrow \text{Evidence ID(s)} \longrightarrow \text{Collected Artifact File} \longrightarrow \text{Source Tool \& Method}$$
- Any finding presented without a valid Evidence ID reference is non-compliant and shall be rejected during review.

---

## 11. Recommended Website Audit Session Execution Structure

Website audits within the `research/website-audit/` domain are recommended to follow a structured, 11-session breakdown:

```text
WA-00  —  Evidence Collection Standard (Methodology & Traceability Specification)
WA-01  —  Evidence Collection (Capturing, Structuring & Indexing Evidence Artifacts)
WA-02  —  UX Audit (User Experience, Navigation & Funnel Flow Analysis)
WA-03  —  UI Audit (Visual Hierarchy, Component Styling & Layout Consistency)
WA-04  —  CRO Audit (Conversion Barriers, Call-to-Action & Friction Points)
WA-05  —  Trust Audit (Trust Badges, Value Propositions & Purchase Anxiety)
WA-06  —  Accessibility Audit (WCAG 2.1 Compliance, Color Contrast & ARIA)
WA-07  —  Performance Audit (Core Web Vitals, LCP, CLS, INP & Asset Overhead)
WA-08  —  Technical Audit (Console Errors, Broken JS & Layout Shifts)
WA-09  —  Consolidated Findings (Multi-Domain Findings Matrix & Synthesis)
WA-10  —  Improvement Opportunities (Prioritized Action Plan & Design Directives)
```

---

## 12. Evidence Manifest Standard (`WA-01_EVIDENCE_MANIFEST.md`)

When session `WA-01` (Evidence Collection) is executed, all collected evidence items must be compiled into a central index file named `WA-01_EVIDENCE_MANIFEST.md` using the following required table layout:

| Evidence ID | Category | File Name | Target URL | Source Tool | Related Session | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `EVD-VIS-001` | Visual Evidence | `homepage-desktop.png` | `https://example.com/` | Chrome DevTools | `WA-01` | Verified |
| `EVD-VIS-002` | Visual Evidence | `homepage-mobile.png` | `https://example.com/` | Chrome DevTools | `WA-01` | Verified |
| `EVD-PRF-001` | Performance Evidence | `lighthouse-homepage-mobile.html` | `https://example.com/` | Google Lighthouse | `WA-01` | Verified |

*Note: This specification defines the manifest standard only. The manifest file itself is created during session WA-01.*

---

## 13. Severity Classification Standard

All findings recorded in audit evaluation sessions (WA-02 through WA-10) must be assigned a standardized severity level:

| Severity Level | Definition | Business Impact | Implementation Priority |
| :--- | :--- | :--- | :--- |
| **Critical** | Severe breakdown in checkout/conversion funnel, fatal JS error, security flaw, or complete WCAG accessibility block. | High immediate revenue loss / conversion block. | **P0 — Fix Immediately** |
| **Major** | Significant usability friction, high conversion barrier, or major Core Web Vitals deficit affecting user retention. | Moderate-to-high conversion drop. | **P1 — High Priority** |
| **Moderate** | Noticeable visual/functional inconsistency, secondary navigation friction, or minor accessibility non-compliance. | Minor user hesitation / usability friction. | **P2 — Medium Priority** |
| **Minor** | Small alignment flaw, cosmetic UI bug, or small typo with low conversion impact. | Negligible business impact. | **P3 — Low Priority** |
| **Enhancement** | Non-bug UX optimization opportunity, progressive enhancement, or best-practice suggestion. | Long-term brand/usability gain. | **P4 — Advisory / Backlog** |

---

## 14. Recommendation Traceability Rule

To guarantee that design directives and engineering specifications in WA-10 (Improvement Opportunities) and future epics are strictly evidence-driven, all recommendations must enforce **Complete 3-Tier Traceability**:

- **Mandatory 3-Tier Linkage:**
  $$\text{Recommendation} \longrightarrow \text{Finding (Fact / Observation / Insight)} \longrightarrow \text{Evidence ID(s)} \longrightarrow \text{Collected Artifact}$$
- Every recommendation **MUST** explicitly reference one or more `Finding IDs`, and those Findings **MUST** explicitly cite the `Evidence IDs` backing them.
- Any recommendation presented without traceable Findings and Evidence IDs is non-compliant and shall be rejected during review.
