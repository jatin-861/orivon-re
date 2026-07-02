# Repository Architecture
## Structure and organization

---

## Root Structure

```
/
├── index.html                    — entry point; static schemas + dark-mode script
├── package.json                  — dependencies (React 19, TanStack Router 1.168)
├── vite.config.ts                — Vite + TanStack Router plugin + tsconfig-paths
├── tailwind.css (or similar)     — Tailwind v4 CSS entry (no tailwind.config.js)
├── tsconfig.json                 — TypeScript strict mode
│
├── src/                          — application source
│   ├── main.tsx                  — React entry, RouterProvider mount
│   ├── router.tsx                — TanStack Router instance
│   ├── routes/                   — file-based routes (TanStack Router)
│   ├── components/               — shared components
│   ├── data/                     — static data
│   ├── hooks/                    — custom React hooks
│   └── lib/                      — utilities
│
├── public/                       — static assets (served at root)
│   ├── index.html                — DO NOT EDIT (this is the root; edits go to root index.html)
│   ├── og-image.png
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── llms.txt
│   ├── favicon.ico
│   ├── *.pdf                     — resumes + pricing documents
│   ├── images/                   — project screenshots (webp)
│   └── videos/                   — showreel video files
│
├── knowledge/                    — Engineering Knowledge Base (EKB)
│
├── CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md  — identity investigation (archive candidate)
├── NARRATIVE_DECISION_ARCHITECTURE_REPORT.md  — narrative investigation (archive candidate)
└── HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md — homepage blueprint (archive candidate)
```

---

## Routes Directory

```
src/routes/
├── __root.tsx          — root layout: LenisProvider > CustomCursor > Preloader >
│                          SiteBackground > SiteHeader > main > PageTransition >
│                          Outlet > SiteFooter
├── index.tsx           — homepage (/)
├── about.tsx           — about page (/about)
├── work.index.tsx      — project gallery (/work)
├── work.$slug.tsx      — case studies (/work/neurodashboard, /work/shade-ledger, etc.)
├── process.tsx         — methodology (/process)
├── pricing.tsx         — pricing (/pricing)
└── contact.tsx         — contact (/contact)
```

TanStack Router generates a typed route tree from this directory. The `$slug` in `work.$slug.tsx` is a path parameter; `work.index.tsx` is the index route for `/work`.

---

## Components Directory

```
src/components/
├── canvas/
│   └── CinematicHero.tsx       — particle canvas hero; preloader coordination
├── layout/
│   ├── LenisProvider.tsx       — smooth scroll wrapper
│   ├── PageSkeleton.tsx        — skeleton loader (used during route transitions)
│   └── Preloader.tsx           — first-visit loading animation
├── ui/                         — shadcn-style primitives (radix-based)
│   ├── booking-calendar.tsx
│   ├── gooey-text-morphing.tsx
│   ├── shape-landing-hero.tsx  — used on /work page header
│   └── ...
├── AnimatedDock.tsx            — macOS-style dock (footer)
├── AnimatedTestimonials.tsx    — stacking card testimonials (/about)
├── AnimatedTitle.tsx           — gooey title animation (StoryTeller)
├── BentoTilt.tsx               — 3D tilt wrapper
├── Button.tsx                  — custom Button (NOT TanStack Link) — see P0-5
├── CustomCursor.tsx            — custom cursor
├── InteractiveGrid2D.tsx       — canvas grid background
├── InteractiveParticles2D.tsx  — canvas particle background
├── LazyVideo.tsx               — IntersectionObserver-based video loader
├── MagneticButton.tsx          — magnetic cursor pull button
├── MagneticText.tsx            — magnetic cursor pull text
├── Marquee.tsx                 — infinite looping marquee
├── NotFoundPage.tsx            — 404 component
├── PageTransition.tsx          — Framer Motion page transition wrapper
├── PulseBeams.tsx              — SVG beam animation (/contact)
├── RevealText.tsx              — GSAP character reveal
├── ScrollStoryHorizontal.tsx   — horizontal scroll project cards
├── SEO.tsx                     — per-page metadata + JSON-LD injection
├── SiteBackground.tsx          — persistent background layer
├── SiteFooter.tsx              — footer
├── SiteHeader.tsx              — navigation
├── SpotlightCard.tsx           — mouse-tracking spotlight card
├── StoryTeller.tsx             — belief statement + canvas (P0-5 dead-end issue)
├── SVGPathReveal.tsx           — SVG path drawing animation
├── TextRevealByWord.tsx        — word-by-word reveal (StudioManifesto)
├── ThemeToggle.tsx             — dark/light toggle
└── VideoPreview.tsx            — video preview component
```

---

## Data Directory

```
src/data/
├── projects.ts         — PROJECTS array: 4 projects (neurodashboard, shade-ledger,
│                          smart-parking, carbon-compass)
│                          Each: slug, title, client, category, year, description,
│                          services[], color, link?, modules?, image?
└── testimonials.ts     — testimonial data (separate from TEAM array in about.tsx)
```

---

## Hooks Directory

```
src/hooks/
├── useInView.ts                  — IntersectionObserver hook; returns [ref, isInView]
├── useStickyHorizontalScroll.ts  — native-sticky horizontal scroll engine
└── useTextSplit.ts               — character/word splitting for animations
```

---

## Lib Directory

```
src/lib/
├── mail.ts     — buildMailUrls(), openCompose(), pickCompose()
│                  Assembles mailto/Gmail/Outlook/Yahoo compose URLs
│                  Contact email: ["orvionstudio.co", "gmail.com"].join("@")
└── utils.ts    — cn() = clsx + tailwind-merge
```

---

## Path Aliases

`@/` → `src/` (configured via `vite-tsconfig-paths` in `tsconfig.json`)

Usage: `import { SEO } from "@/components/SEO"` instead of relative paths.

---

## Key Configuration Files

| File | Purpose |
|---|---|
| `index.html` | Entry point; contains dark-mode inline script + static schemas (DO NOT AUTO-GENERATE) |
| `vite.config.ts` | Vite + `@tanstack/router-plugin` + `@vitejs/plugin-react` + `vite-tsconfig-paths` |
| `tsconfig.json` | TypeScript strict mode, path aliases |
| `package.json` | All dependency versions |
