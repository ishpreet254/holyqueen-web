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
