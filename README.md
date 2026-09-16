# Omar Fathallah Portfolio

## About the placeholder images

`public/certificates/` and `public/gallery/` were empty in this build (the real files
never made it into the zip), so the certificate gallery and the visual-notebook gallery
were pointing at missing images. Labeled placeholder files with the exact filenames
the code expects have been generated so the site now renders completely — swap each
one out for your real certificate scan or artwork using the same filename and it
updates automatically, no code changes needed.

## What changed in this pass

- Removed a scroll animation I'd added on the previous pass that was breaking the
  certificate deck's `position: sticky` layout — that was the cause of the
  overlapping cards and blank-looking sections.
- Replaced the hand-rolled certificate deck with the official React Bits **DomeGallery**
  component (`src/DomeGallery.jsx`) — a draggable 3D dome of your 9 certificates, mounted
  on the homepage via `src/home-widgets.jsx`.
- Replaced the "Visual notebook" section and the gallery page with the official React Bits
  **AccordionGallery** component (`src/AccordionGallery.jsx`) — hover-expanding panels for
  your moments/journey photos, used on both the homepage (5-image preview) and the full
  `gallery.html` page (all 7 images).
- Removed the old upload-your-own-photo feature and its lightbox, since neither
  DomeGallery nor AccordionGallery support runtime uploads — everything now comes from
  `public/gallery/` and `public/certificates/`.
- No new npm packages needed — both components only need `gsap` and `@use-gesture/react`,
  which were already in `package.json`.

## Round 2 — the real bug behind the empty sections, plus three more React Bits pieces

**Root cause found and fixed:** `.project`, `.proof-item`, and `.timeline-item` all had
both a `reveal` class (a simple IntersectionObserver + CSS fade) *and* their own dedicated
GSAP `ScrollTrigger` entrance animation, targeting the same elements. GSAP's `.from()`
sets an inline `opacity`/`transform` the moment the page loads, which always wins over the
CSS class no matter what the IntersectionObserver does — so if that specific
ScrollTrigger didn't fire exactly as expected, those elements stayed invisible forever.
That's what made "Ideas tested, not just imagined" and the stats/timeline look empty. Fixed
by removing the redundant `reveal` class from those three groups so only one animation
system drives each element.

**Dome gallery framing:** the certificate dome was computing its radius from the
container's *width* (very wide, short box), which zoomed the camera in close enough that
one or two certificates filled the whole frame. It's now sized off the smaller dimension
with a lower `fit` value and a more square-ish container, so many tiles are visible at
once, closer together. It also now auto-rotates gently on its own — it's never static,
drag still works on top of that.

**Gallery page shows both now:** `gallery.html` renders the AccordionGallery of moments
*and* the certificate DomeGallery, one below the other — not just moments.

**Three more React Bits components added, each doing real scroll-driven work:**
- `src/ScrollExpand.jsx` — a full-bleed frame of your photo that expands as you scroll
  past the hero, revealing a short statement over it.
- `src/ScrollStack.jsx` — the Experience & Education timeline is now a scroll-stacked
  card deck (self-contained scroll panel, not hijacking the whole page's scroll — see
  note below).
- `src/ScrollVelocity.jsx` — a velocity-linked marquee of your tools/focus areas between
  the certificates and gallery sections.

**One deliberate deviation from the reference doc:** `ScrollStack`'s `useWindowScroll`
mode pulls in a global smooth-scroll library (Lenis) that takes over scrolling for the
*entire page*. This site already has many GSAP `ScrollTrigger` scrub animations running
site-wide, and an un-bridged Lenis instance fighting with those is a classic source of
exactly the timing/visibility bugs you've been hitting. So the timeline's ScrollStack runs
in its default self-contained mode instead — a fixed-height scrollable panel — which keeps
Lenis scoped to just that panel and leaves the rest of the page's scroll animations alone.

**New dependencies:** `lenis` (ScrollStack) and `motion` (ScrollVelocity) were added to
`package.json`. Nothing else needs installing manually — just run `npm install` as usual
and it'll pull both in.

## Run locally

```powershell
cd C:\Users\omarn\Downloads\omar-portfolio
npm.cmd run dev
```

Open the address Vite prints (usually `http://localhost:5173`).

## Production check

```powershell
npm.cmd run build
npm.cmd run preview
```

## Deploy to Vercel

Push this folder to a GitHub repository, then import that repository at Vercel. Vercel automatically detects Vite; use the default build settings.
