# Holy Queen Credit Souhardha Co-operative Society — Website

A full Next.js (App Router) rebuild of the original single-file Holy Queen
website, structured the same way as the ARISE project: componentized
sections, a global styles/tokens layer, and a `public/` assets folder.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view it. Build for production with:

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/
    layout.js         Root layout — nav, footer, intro overlay, global interactions
    page.js            Assembles all page sections in order
    globals.css        Full site styling (ported from the original <style> block)
  components/
    global/
      Nav.js           Header + mobile menu (React state)
      Footer.js
      IntroOverlay.js  Vault-style intro markup
      Interactions.js  Client-side effects: intro sequence + particle canvas,
                        scroll progress bar, cursor glow, reveal-on-scroll,
                        animated counters, tilt cards, magnetic buttons,
                        hero particle canvas, ambient audio sync
    sections/
      Hero.js, About.js, Schemes.js, Deposits.js, Calculator.js, Why.js,
      Policies.js, Services.js, Testimonials.js, Location.js, Contact.js
  styles/
    tokens.css         CSS custom properties (color palette, shadows)
public/
  logo/holy-queen-logo.png   Extracted from the original base64 embed
  audio/ambient.mp3          Extracted from the original base64 embed
```

## Notes on the conversion

- The original file embedded its logo and ambient audio track as base64
  data URIs. Both were decoded to real files under `public/` to keep the
  source readable and the bundle size sane.
- The Calculator, Policies accordion, and Testimonials carousel were
  rebuilt as proper React state instead of raw DOM manipulation, since
  they're fully self-contained.
- Everything else that touches the whole page at once — the intro
  sequence, particle canvases, scroll progress, cursor glow,
  reveal-on-scroll, counters, tilt, magnetic buttons, and the ambient
  audio toggle sync — lives in one `Interactions.js` client component
  that mounts once from the root layout, matching the original script's
  behavior.
- The "Request Callback" button keeps the original WhatsApp + SMS
  deep-link behavior.
- Update the branch phone number, email, and map address in
  `Contact.js` / `Location.js` if these details change.

## Performance pass

- Removed ~360 lines of dead CSS from an earlier "vault door" intro
  design (locks, rings, energy fields, fog) that had been superseded
  but never deleted from the original file — it was force-hidden with
  `display: none` yet still parsed on every page load.
- The logo went through `pngquant` (271KB → 84KB) and both `<img>`
  uses now go through `next/image`, which serves a responsive WebP
  (~36KB at typical sizes) with automatic lazy-loading and sizing.
- Ambient audio no longer eagerly downloads (~960KB) on page load —
  `preload="none"` — since it's opt-in via the sound toggle.
- The hero particle canvas now waits until the intro finishes before
  it starts (no point animating something hidden behind the intro
  overlay), and fully pauses via `IntersectionObserver` whenever it's
  scrolled out of view or the tab is backgrounded, instead of running
  forever in the background.
- Tilt and magnetic hover effects used to call `getBoundingClientRect()`
  on every `pointermove` event, forcing a layout reflow each time.
  They now cache the rect once on hover-enter instead.
- Fixed a couple of small visual bugs surfaced during this pass: a
  wrong `aspect-ratio` on the logo (699/540 instead of the image's
  actual 568/439) and a `.vault-transition` element that had lost its
  `position: absolute` when the dead intro CSS around it was removed.
