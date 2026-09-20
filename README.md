# Omar Fathallah — Portfolio

Live: **https://omar-portfolio-pied.vercel.app**

The personal site for Omar Mohamed Fathallah — an AI & Intelligent Systems Engineering student building real-time 3D AI avatars, RAG pipelines, and computer vision projects. This repo is the site itself: no CMS, no page builder — every animation, layout, and interaction here is hand-built.

## What's on it

- **Selected work** — case-by-case breakdowns of four shipped projects: **AANG** (a real-time 3D AI tutor avatar — Three.js + Flask + a local LLM + RAG, in progress), **Aang 2D Avatar** (2nd place, Helwan Cyber Arena Hackathon — RAG + Wave2Lip), **AI Style Transfer** (NTI final project, PyTorch/TensorFlow Hub), and an **Anime Portrait Generator** (Stable Diffusion + Gradio).
- **Proof of practice** — a certificate gallery (drag to browse, click to open) and career-highlight stats.
- **Moments** — a photo gallery from competitions and workshops.
- **Resume** — an embedded, downloadable, ATS-checked PDF.

## Stack

- **Build tool:** [Vite](https://vitejs.dev/) — no framework-level SSR, just a fast dev/build setup for a mostly-static site.
- **UI:** Plain HTML/CSS for the page shell (`index.html`, `styles.css`), with a handful of interactive **React** islands mounted into specific DOM nodes (`src/home-widgets.jsx`) for the pieces that need real component state — the certificate lightbox, the profile-orbit animation, the scroll-stacked timeline, the accordion gallery.
- **Motion:** [GSAP](https://gsap.com/) + ScrollTrigger for scroll-driven reveals, [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling.
- **No backend.** The contact form and resume are static; nothing here talks to a server.

## Running it locally

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Project structure

```
index.html                 Page shell — hero, work, proof, certs, moments, about, contact
resume.html                Standalone resume page (embeds the PDF)
gallery.html                Full moments gallery
styles.css / experience.css / certificates.css   Page-level CSS
script.js                   Scroll reveals, cursor, nav, smooth scroll, counters
cursor.js                   Custom cursor (falls back to native cursor over dialogs)
src/
  home-widgets.jsx          Mounts every React island used on the homepage
  ProfileOrbits.jsx/.css     The "same builder, three profiles" section
  CertificateShowcase.jsx/.css  Certificate lightbox (native <dialog>)
  ScrollStack.jsx/.css       Pinned-card timeline ("Learning in public")
  AccordionGallery.jsx/.css  Moments accordion
  ScrollVelocity.jsx/.css    Marquee skill strip
public/
  avatars/, projects/, certificates/, gallery/   Images
  omar-fathallah-resume.pdf
```

## Notes for whoever touches this next (including future-me)

- Native `<dialog>` elements render in the browser's top layer — always above everything else on the page, no matter the z-index set on other elements. Keep that in mind before adding another modal.
- Two competing smooth-scroll (Lenis) instances on the same page is a real bug, not a theoretical one — it caused visible jitter on the pinned timeline section. If you add a new scroll-driven component, check whether it can reuse `window.lenis` instead of creating its own instance.
- `.project-featured` and plain `.project` cards use different grid layouts (`7% 42% 1fr` vs `7% 1fr 27%` on desktop, both collapsing to `14% 1fr` on mobile). If you add a `.project-visual` image to a card that *isn't* `.project-featured`, double-check it's covered by the mobile `grid-column` rule too.

## Contact

- [LinkedIn](https://www.linkedin.com/in/omar-mohamed-fathallah-59912b335/)
- [GitHub](https://github.com/Omaryone1w1)
- [Kaggle](https://www.kaggle.com/omarmohamed1w1)
- omarnasa1w1@gmail.com
