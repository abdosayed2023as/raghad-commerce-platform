# TASK: Implement Raghad PDP sections on Easy Orders Custom Theme

## ROLE
You are a theme implementation engineer. Execute the locked PDP specification exactly.
Do not redesign. Do not invent new product-route sections. Do not enable fake scarcity widgets.

## REPOSITORY
`C:\abdo\Projects\raghad-commerce-platform`  
Branch: `main`

## AUTHORITATIVE SPECS (read in this order before coding)
1. `specs/theme/PDP_THEME_SPEC.md` — **Locked** (section map + Trust Shield + events)
2. `docs/design/UI_COMPONENTS.md` — Trust Shield, buttons, cards
3. `docs/design/COLOR_SYSTEM.md` — CSS color tokens + text-on-accent rule
4. `docs/design/TYPOGRAPHY.md` — Cairo-only type tokens
5. `docs/design/DESIGN_SYSTEM.md` — radius 12/30, shadow, spacing
6. `docs/design/logo/README.md` — which logo asset where
7. `research/easyorders/RS-04_TEMPLATES_AND_PAGE_ARCHITECTURE.md`
8. `research/easyorders/RS-05_THEME_VARIABLES_AND_SECTION_CONTRACTS.md`
9. `research/reference/EVENTS_REFERENCE.md` + `LIQUID_OBJECTS_REFERENCE.md`

Official EO docs remain SSOT if anything conflicts: https://themes-docs.easy-orders.net/docs/custom-themes/getting-started

## HARD CONSTRAINTS
1. Product page = only these section files (restyle/implement; do not add new product sections):
   - `breadcrumbs.liquid`, `gallery.liquid`, `product-details.liquid`, `product-description.liquid`,
     `fixed-buy-button.liquid`, `reviews.liquid`, `related-products.liquid`
2. **Trust Shield MUST live inside `product-details.liquid`**, after price, before secondary actions.
3. Locked Arabic Trust Shield labels (exact):
   - معاينة كاملة قبل الدفع
   - فيديو حقيقي 100%
   - استبدال مجاني خلال 48 ساعة
4. Primary CTA: background `#D48C80` / `--color-brand`, text `#2C2230` / `--color-on-accent` — **never white text on terracotta**.
5. Do **not** implement or polish `fake-visitor`, `fake-stock`, `fake-counter`. Hide/neutralize if present.
6. Required CustomEvents must bubble `{ bubbles: true }`:
   - `fixed-buy-button`: `buy-now`, `increment-quantity`, `decrement-quantity`
   - related cards if used: `quick-add` / `quick-view` per RS-05
7. Required header cart ID remains `header-cart-count` when touching header (if you touch layout at all).
8. Font: Cairo 500/700/800 only. No DM Sans / Playfair.
9. Radii: cards/inputs/shield container `12px`; buttons/chips `30px`.
10. Real media only in gallery; support video entries in `images` per Liquid reference.
11. Do not commit `node_modules`. Do not expand scope to Home/PLP full redesign unless those section files are required stubs for theme upload — if stubs required, minimal placeholder OK and note it.

## THEME TREE
Follow Easy Orders custom theme layout from RS-02 / Getting Started. Prefer existing `theme/` scaffold:

```
theme/
  sections/   # the 7 product sections (+ header/footer if required for valid theme)
  ...         # schema.json, style.css, script.js, etc. as EO requires
```

If `theme/` is empty of EO-required files, create the minimum valid structure per official Getting Started, then implement PDP sections fully.

## IMPLEMENTATION ORDER
1. Global CSS tokens in theme stylesheet from COLOR_SYSTEM + TYPOGRAPHY + DESIGN_SYSTEM (`:root` variables).
2. `product-details.liquid` — name, price, Trust Shield, events for wishlist/compare only if UI includes them.
3. `fixed-buy-button.liquid` — sticky bar, trust micro-line, qty controls, `buy-now`.
4. `gallery.liquid` — gallery UX + video handling.
5. `product-description.liquid`, `breadcrumbs.liquid`, `reviews.liquid`, `related-products.liquid`.
6. `script.js` helpers for CustomEvent dispatch and gallery; no fake counters.

## TRUST MICRO-LINE (sticky bar)
Exact or equivalent one line above CTA:  
`معاينة قبل الدفع · فيديو حقيقي · استبدال 48س`

## ACCEPTANCE (you must verify and report)
- [ ] Trust Shield above purchase intent in `product-details.liquid`
- [ ] Sticky CTA meets 48px min height, brand + on-accent colors
- [ ] `buy-now` / qty events implemented with bubbles true
- [ ] No fake scarcity sections styled as features
- [ ] Tokens used (no random hex drift like `#0F172A`)
- [ ] List every file created/modified
- [ ] Note anything blocked by missing EO CLI/store credentials (do not invent)

## OUT OF SCOPE
Home page redesign, cart drawer full redesign, domain changes, dashboard config, content photography.

## DELIVERABLE
Working Liquid/CSS/JS under `theme/` for PDP sections + short REPORT.md section in your reply (not a new governance doc unless asked).
