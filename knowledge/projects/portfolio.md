# Portfolio — orvion.co

## This repository

---

## Executive Summary

The Orvion.co portfolio website. A production-deployed SPA at `https://orvion.co`. Built with React 19, TanStack Router, Tailwind CSS v4, GSAP, and Framer Motion.

**Repository name:** `saral-banker-portfolio` (package.json)  
**Deployed at:** https://orvion.co  
**Build tool:** Vite  
**Type:** SPA (no SSR, no SSG currently)

---

## Purpose

Three simultaneous goals:

1. Attract B2B clients for Orvion.co consulting work
2. Attract freelance/contract engineering projects
3. Support individual hiring (recruiter path) for Saral Banker and Jatin Basantani

---

## Architecture

```
src/
  components/       — shared UI components
    canvas/         — particle/canvas interactive components (CinematicHero, StoryTeller)
    layout/         — global layout pieces (Preloader, LenisProvider, PageSkeleton)
    ui/             — shadcn-style primitives (radix-ui based)
  data/
    projects.ts     — PROJECTS array (4 projects, each with slug/title/description/services/etc.)
    testimonials.ts — testimonial data
  hooks/
    useInView.ts    — IntersectionObserver hook (canvas visibility pause)
    useStickyHorizontalScroll.ts — native-sticky horizontal scroll for showreel
    useTextSplit.ts — character splitting for animations
  lib/
    mail.ts         — contact email assembly (mailto/Gmail/Outlook/Yahoo URLs)
    utils.ts        — cn() Tailwind merge utility
  routes/
    __root.tsx      — root layout (LenisProvider, Preloader, SiteHeader, SiteFooter)
    index.tsx       — homepage
    about.tsx       — about page
    work.index.tsx  — project gallery
    work.$slug.tsx  — individual case studies
    process.tsx     — methodology
    pricing.tsx     — pricing
    contact.tsx     — contact form
  router.tsx        — TanStack Router configuration
  main.tsx          — React entry point
```

---

## Tech Stack

| Technology        | Version | Purpose                                          |
| ----------------- | ------- | ------------------------------------------------ |
| React             | 19.2.0  | UI framework                                     |
| TanStack Router   | 1.168.0 | File-based routing, typed params                 |
| Vite              | latest  | Build tool                                       |
| Tailwind CSS      | 4.2.1   | Styling                                          |
| @tailwindcss/vite | 4.2.1   | Tailwind v4 Vite integration                     |
| GSAP              | 3.15.0  | Scroll animations, kinetic text, particle canvas |
| Framer Motion     | 12.38.0 | Component-level animations, page transitions     |
| Lenis             | 1.3.3   | Smooth scroll                                    |
| Radix UI          | various | Accessible UI primitives                         |
| Lucide React      | 0.575.0 | Icon set                                         |
| next-themes       | 0.4.6   | Theme management                                 |
| Zod               | 3.24.2  | Schema validation (used in router/form)          |

---

## Key Components

| Component               | Purpose                            | Notable                                                                        |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `CinematicHero`         | Homepage hero with particle canvas | Particle text "USEFUL OVER IMPRESSIVE"; StrictMode-safe preloader coordination |
| `Preloader`             | First-visit loading animation      | useRef pattern for sessionStorage flag (D-009)                                 |
| `StoryTeller`           | Belief statement section           | Canvas animation + suspected dead-end CTA (P0-5)                               |
| `StudioManifesto`       | Core belief text                   | Scroll-parallax paragraphs; strongest written section                          |
| `ScrollStoryHorizontal` | Horizontal project scroll          | useStickyHorizontalScroll hook                                                 |
| `SEO`                   | Per-page meta + schema             | React 19 document metadata hoisting                                            |
| `SiteHeader`            | Fixed navigation                   | Active route detection, mobile menu                                            |
| `SiteFooter`            | Footer with dock                   | AnimatedDock + GooeyText morphing wordmark                                     |
| `AnimatedTestimonials`  | TEAM cards on /about               | Auto-advancing card stack                                                      |
| `BookingCalendar`       | Calendar on /contact               | Date picker for project start date                                             |
| `PulseBeams`            | Decorative SVG beams               | Contact page right-column decoration                                           |

---

## Public Assets

| Asset                      | Location        | Purpose                          |
| -------------------------- | --------------- | -------------------------------- |
| og-image.png               | /public/        | 1200×630 OG image for all pages  |
| sitemap.xml                | /public/        | 10-URL sitemap                   |
| robots.txt                 | /public/        | Crawl directives                 |
| llms.txt                   | /public/        | AI-readable studio identity      |
| favicon.ico                | /public/        | Site favicon                     |
| Saral_Banker_Resume.pdf    | /public/        | Individual resume                |
| Jatin_Basantani_Resume.pdf | /public/        | Individual resume                |
| Orvion_Team_Resume.pdf     | /public/        | Combined team resume             |
| Orvion-Pricing-\*.pdf      | /public/        | Three pricing PDFs + full report |
| images/                    | /public/images/ | Project screenshots (webp)       |
| videos/                    | /public/videos/ | Showreel video files             |

---

## Build & Dev

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
npm run format    # Prettier
```

---

## Known Limitations

- No SSR/SSG — all schemas are JS-dependent except static blocks in index.html
- No backend — contact form routes via mailto/webmail compose
- No analytics installed (no visitor data available for nav order decisions)

---

## Related Knowledge

- Homepage narrative architecture → [`knowledge/NARRATIVE_ARCHITECTURE.md`](../NARRATIVE_ARCHITECTURE.md)
- Engineering patterns → [`knowledge/ENGINEERING_GUIDELINES.md`](../ENGINEERING_GUIDELINES.md)
- Repository structure → [`knowledge/architecture/repository.md`](../architecture/repository.md)
