# Holy Queen — build notes (Phase 0–2 delivered)

Run it:

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verified: 24 static routes, eslint clean
```

## What changed

**Theming (Phase 0).** `src/styles/tokens.css` is now two tiers — brand
primitives plus semantic tokens redefined per theme. All 77 hard-coded colour
literals in `globals.css` were replaced with token references (verified: zero
`rgba(` or `#hex` literals remain in that file). `src/styles/theme-light.css`
restyles the panels that were written for glass-on-navy so they read as
bordered paper on ivory. Light is the server-rendered default; the inline script
in `ThemeScript.js` applies a stored preference before first paint, so there is
no flash. Toggle sits in the utility bar, the mobile drawer and the footer.

**Content layer.** Every rate, scheme, service, policy and person now lives in
`src/content/`. `rates.js` is the single source — change a rate there and the
mega-menu badge, the product page and `/rates` all update together. Anything the
society hasn't supplied is an empty string with a `// CLIENT INPUT` comment, and
the page renders an honest enquiry panel instead of a placeholder number.

**IA (Phase 1).** 24 routes. Mega-menu for Accounts & Deposits (the specific
thing the client asked for), Services and Digital; keyboard-operable, closes on
Esc/outside click; mobile accordion drawer with pinned Call/WhatsApp actions.
Utility bar, rebuilt 4-column footer, breadcrumbs on every inner page.

**Products (Phase 2–3).** `/deposits` hub plus Fixed, Recurring, Special
Schemes, Senior Citizen and Pigmy. `/rates` consolidates the whole card.
`/calculators` has three tools: an FD calculator whose tenure dropdown is the
society's own rate ladder (so it can only compute with a rate you actually
offer), an RD calculator, and a scheme comparator. Results hand off to WhatsApp
prefilled.

**Performance.** Intro plays once per session, home route only, skipped under
reduced motion. Intro particle canvas removed; the hero canvas runs only in dark
theme on pointer-fine viewports and pauses off-screen. Cursor glow is
pointer-fine and dark-theme only. Google Maps is click-to-load behind a static
panel. `Interactions.js` split into `MotionProvider` (all routes: progress,
reveal, counters) and `HomeAtmosphere` (home only).

## New data folded in from the brochure, cards and invitation

Pigmy Deposit (3% for 1–2 years, 4% for 3+) — new page. Nine services instead of
six (added cheque clearance, LIC premium collection, Western Union/MoneyGram/Ria,
general insurance detail, Yashasvini). "Our strength" list. Kannada name in the
hero. Leadership page: president, vice president, general manager and three
directors. Established/inaugurated 25 June 2026.

## Things in the source material that need your client's confirmation

1. **Pincode.** The invitation footer says 570099; everything else says 570009.
   Built with 570009.
2. **Ajay Arokyaraj's title.** Visiting card says General Manager, the
   invitation lists him as C.E.O. Built as General Manager, flagged in
   `leadership.js`.
3. **Duplicate phone numbers on the cards.** Anthony Cruz J and Annet Akshatha
   share 7349733253; Arokyaraj and Anthony Richard S share 8971513765. Looks
   like a template copy error.
4. **Name spellings differ** between the invitation and the cards (Arokia Raj.S
   / Arokyaraj, Ajay Arokya Raj / Ajay Arokyaraj).
5. **Individual mobile numbers are not published.** `publishDirectNumbers` in
   `leadership.js` is `false` — publishing personal mobiles on a public site
   needs each person's sign-off. Flip the flag if they want them live.
6. **Headshots.** `publishPhotos` is `false`; the ID-card artwork isn't usable as
   a website portrait. Clean headshots on a plain ground would let the leadership
   page carry photos.
7. **"100% well-equipped branches"** from the brochure was softened to
   "well-equipped branch infrastructure", since there is one branch.
8. Still outstanding from the spec: savings/current account terms, loan
   products and rates, registration number and year, branch hours, grievance
   officer, rates effective-from date, testimonial approval.

## Not built yet

Phase 5 polish on `/about` prose, news/gallery/career, Kannada variant, member
login. `/loans` and the two account pages are deliberately gated — they are
excluded from `sitemap.js` until their content files are filled in.

## Review this first

The light theme has not been looked at in a browser — it was built to the token
spec and verified only by build and lint. Run `npm run dev`, check the light
theme on the home page, `/rates` and `/deposits/fixed`, and tell me what reads
wrong before I do the Phase 6 contrast and polish pass.

---

# Phase 6 pass — accessibility, print, mobile actions

## Contrast audit (WCAG 2.1 AA)

The first light palette failed. Measured against the four light surfaces
(page ivory, warm-sand band, white card, warm inset), the deep gold
`#A9761C` came in at 3.46–3.97:1 as body text, and `--text-subtle`
`#7A8798` at 3.45:1. Both are below the 4.5:1 floor. Fixed by splitting the
accent in two:

| Token | Light value | Worst ratio | Needs | Result |
|---|---|---|---|---|
| `--text` | `#0E2137` | 14.18 | 4.5 | pass |
| `--text-muted` | `#55677C` | 5.06 | 4.5 | pass |
| `--text-subtle` | `#5F6A78` | 4.79 | 4.5 | pass |
| `--accent` (all text, links, table values, button fill) | `#8A6115` | 4.82 | 4.5 | pass |
| `--accent-hover` | `#6F4B0F` | 6.81 | 4.5 | pass |
| `--accent-display` (large figures, hairlines, icons only) | `#A9761C` | 3.46 | 3.0 | pass |
| Button label `#FFF9EC` on `--accent` | — | 5.26 | 4.5 | pass |

Dark theme: `--text` 15.27, `--text-muted` 9.08, `--text-subtle` 5.94,
`--accent` 10.19, button label 12.23. All pass.

`--accent-display` is used in exactly two rules — `.page-hero-stat strong`
and `.product-card h2` — both of which render at `--step-3` (30–48px), so
the 3:1 large-text threshold applies. Don't reuse it at body size.

## Also added

- **Mobile sticky action bar** on the deposit, rates, accounts and loans
  pages: Call / WhatsApp / Calculate, 56px targets, hidden above 980px.
- **Print stylesheet.** `/rates` prints clean — chrome, CTAs and footer links
  drop out, tables get solid borders and avoid page breaks. Branch staff can
  print the rate card.
- **Structured data.** `BreadcrumbList` on every inner page,
  `FAQPage` on `/policies`, alongside the existing `FinancialService` block.

## Still open

- Fonts are still a system stack. `next/font` self-hosting needs a network
  fetch at build time, which this sandbox blocks — do it on your machine:
  a display serif for headings plus one sans, two weights.
- Visual review of the light theme in a browser. The palette is now measured,
  but measurement isn't taste — the warm-sand bands and the bordered-paper
  cards need your eye.
- The `metadataBase` and sitemap base URL are placeholders
  (`https://holyqueen.example`). Swap in the real domain before launch.

---

# Visual + bug-fix pass (this round)

## Fixed

**Hydration error.** The mismatch was Grammarly injecting `data-new-gr-c-s-check-loaded` / `data-gr-ext-installed` onto `<body>` before React hydrated — a browser extension, not a bug in the app. Added `suppressHydrationWarning` to `<body>` in `layout.js`, which is the standard, correct fix for exactly this case (React still hydrates normally; it just stops warning about attributes it doesn't control).

**Hero layout — the real bug.** At ≤680px, `.hero` had `padding: 8rem 0.5rem 3rem` — an 8px side gutter, which is what put the headline in the corner. Fixed to `1.5rem`. Separately, `.hero`, `.section`, `.nav-shell` and `.footer` were using two different shell widths (1180px vs the newer `--shell: 1240px` token), so the hero content didn't line up with the utility bar above it. Unified everything to `--shell`, with a 3rem minimum gutter instead of 2rem across the board.

**Hero card cropping.** `.hero-medallion` had a hard `min-height: 590px` inside a `.hero` forced to `min-height: 100vh`. On shorter viewports the combined content (logo + 4-line headline + tagline + stat row) exceeded the viewport, and centering pushed the bottom below the fold — which is what your screenshot shows. Fixed by: capping the headline to `max-width: 15ch` at a smaller clamp so it wraps to 2–3 lines instead of 4, dropping the medallion's fixed height in favour of intrinsic sizing with even padding, and changing `.hero` to `min-height: clamp(640px, 94vh, 940px)` so it can never demand more height than a reasonable viewport gives it.

**Hero card in light theme.** This was the biggest visual gap — `.hero-medallion` had no light-theme rule at all, so it stayed the dark navy glass card regardless of theme. It now gets its own light treatment: a white-to-sand gradient, a soft shadow instead of a glow, and a thin gold inset border (a "certificate" frame) instead of the dark glass look. The `Assured Growth. Unmatched Peace.` line now sits in navy ink, not gold-on-navy.

**Dark-theme dropdown transparency.** `.mega-panel` was inheriting `--surface-raised` (10% white over navy) at 18px blur — see-through enough that hero content behind it stayed legible through the menu, which is a real reading problem, not a stylistic choice. Dark-theme dropdowns and the mobile drawer are now a near-opaque navy gradient (97–99%), with the blur only softening the edge rather than doing the work of hiding what's behind it.

**Light theme was flat.** Three changes: (1) the body background now layers three low-alpha radial washes instead of two very faint ones, so there's a visible warmth gradient across the page rather than a flat fill; (2) a barely-there SVG grain texture (~5% opacity, `mix-blend-mode: multiply`) gives the page a paper-like tooth instead of a screen-flat look — this is a single inline background-image, effectively free at runtime; (3) a new `.band` utility gives specific sections (About, Deposits, Services, the branch/contact band on Home, and one content section each on About, Accounts, Fixed Deposit, Services, Digital, Loans, Rates and Calculators) a full-bleed `--bg-alt` backdrop with a thin gold hairline at the seam, so pages read as alternating bands rather than one continuous sheet. Cards also picked up a subtle warm-white gradient fill (was flat `#ffffff`) and a gold border on hover.

## Also removed

The "RBI-KYC and Income Tax-TDS compliant" line, and the related "RBI-KYC Discipline" chip in the trust-chip list on the home page. The actual KYC/TDS *policy* explanations on `/policies` are untouched — those are member-facing process information, not the marketing claim you flagged.

## Performance

Light theme now runs almost no `backdrop-filter` (only the 10px blur on the nav pill) — the card blur that dark theme uses is explicitly turned off in light mode, so light-theme scrolling has less GPU work, not more, despite looking richer. The grain texture is a single small background-image, not a canvas or JS effect. Dark-theme dropdown blur only runs while a menu is actually open. Full production build still comes in at 24 static routes with no new client JS beyond what was already there.

## Still worth your eyes

I can verify contrast ratios and DOM structure from here, but I can't render a browser in this environment — screenshot the light theme home page, `/deposits/fixed`, and one dropdown open in both themes, and tell me if anything still reads off.

---

# Font build error — fixed

`Module not found: Can't resolve '@fontsource/cormorant-garamond/400.css'` was because the fonts were an npm dependency, and something in your environment (a stale `node_modules`, a registry that didn't have the exact version, or `npm install` not re-run after the last update) left them unresolved.

Fixed properly rather than just re-explaining the install step: the fonts are no longer an npm package at all. The actual `.woff2` files (latin subset, the 7 weights actually used — 124KB total) now live in `public/fonts/` as static assets, loaded through a plain `src/styles/fonts.css` with manual `@font-face` rules. `@fontsource/*` has been removed from `package.json` entirely.

This means:
- `npm install` no longer needs to fetch anything font-related — one less thing that can fail on a different machine or registry.
- No dependency on npm registry availability for fonts, ever.
- If you `git clone` or copy just the project folder, the fonts always come with it.

Verified: production build compiles clean, and the served CSS bundle correctly serves all 7 `.woff2` files at `/fonts/...` with `200`.

If you still see the old error, delete `node_modules` and `package-lock.json` and run `npm install` fresh — the old lockfile from the previous zip is not compatible with this one.

---

# Hero layout, nav and load-speed pass

**Hero was flush against the window edge.** Root cause: `components.css` sets
`.section { padding: 4.6rem 0 }` and loads *after* `globals.css`, so it silently
replaced the hero's side padding with 0. The hero is full-bleed but its content
must sit on the same shell as the nav, so `.hero.section` (higher specificity)
now owns all hero padding in `components.css`, including the tablet/phone
overrides. Its side padding uses `max(1.5rem, (100% - var(--shell)) / 2)`,
the same box the nav uses, so the left edges line up at every width.

**Hero card overflowed and looked off-centre.** `.brand-logo-hero` was
`min(84vw, 440px)` wide inside a 440px card with ~76px of padding, so the logo
was wider than the card's content box and dragged the whole grid track to the
right. The logo is now `width: 100%; max-width: 400px`, and the card's grid
column is `minmax(0, 1fr)` so nothing can push it wider than the card.

**Nav.** `Home` added first in `content/nav.js` (also shows in the menu). Each
dropdown label is now a link *plus* a separate arrow button: the arrow opens the
panel without navigating, a click pins it open, a second click (or outside
click / Esc) closes it. Hover opens immediately; the panel fades in 110ms
(was 240ms) and its blur was removed, since the panel is opaque anyway. The
three-line menu button is now always visible (it animates into an X) and opens
the full menu as a dropdown under the header on desktop, a sheet on phones.
Below 1220px the inline links give way to that menu instead of wrapping.

**Load speed.** Hero content is no longer `.reveal` (it waited for hydration
before fading in) and the hero stats show their final numbers rather than
counting up from 0. The full-screen logo intro is off by default
(`INTRO_ENABLED` in `HomeAtmosphere.js`): it covered the page for ~2s on a
first visit and until hydration on every load. Other `.reveal` blocks fade in
faster (250ms, 10px travel) and start just before they scroll into view.
`<html>` also got `suppressHydrationWarning` — the theme script sets
`data-theme` before React hydrates, which caused a dev-mode mismatch warning
whenever dark theme was stored.
