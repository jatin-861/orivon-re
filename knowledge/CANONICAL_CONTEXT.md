# Canonical Context

## The single reference document for new Claude Code sessions

> Read this before any implementation. If only one knowledge file is read, this is it.

---

## Repository Purpose

This repository is the production portfolio website for **Orvion.co**, a product engineering studio founded by Saral Banker and Jatin Basantani. It is deployed at `https://orvion.co`.

The site serves three business objectives simultaneously:

1. Attract B2B clients — founders and business owners with a project to build
2. Attract freelance/contract engineering work
3. Support individual hiring (recruiter path) for both founders

---

## Identity

### The studio

**Orvion.co** — a product engineering studio based in India. Two engineers who design, build, and ship complete systems from database to deployment.

### The founders

| Person          | Role                            | GitHub                 |
| --------------- | ------------------------------- | ---------------------- |
| Saral Banker    | Full-Stack & AI Engineer        | github.com/saralbanker |
| Jatin Basantani | Frontend & AI Systems Developer | github.com/jatin-861   |

### Identity architecture

**Hybrid Authority with Studio-Primary Canvas.** Orvion.co accumulates B2B, consulting, and project authority. Saral and Jatin each accumulate individual hiring and technical authority on the same site. Three entities, each sharply defined, each pointing to the others.

→ See [`ENTITY_ARCHITECTURE.md`](ENTITY_ARCHITECTURE.md) for schema implementation.

---

## Voice

**Always "we" — never "I" when referring to studio work.**

- Hero copy: "We build software that solves real problems."
- Process copy: "We design, build, and ship complete systems."
- Footer bio: "Product engineering studio. We design, build, and ship complete systems."

The site presents Orvion.co as a duo. Any singular "I" in studio-facing copy is a bug.

Exception: Individual founder cards on `/about` may use "I" (Saral and Jatin speaking in first person about their own work).

---

## Positioning

**"Useful over impressive."** — The particle canvas headline in the hero.  
**Core belief:** "If it doesn't run in production, it doesn't count."  
**Differentiator:** Most agencies deliver demos. Orvion delivers running systems.

The Shade Ledger story is the primary proof: automated billing for 220 rental units in Mumbai, replacing manual Excel billing and phone calls, running since 2025 without interruption, saving 40+ hours of manual work monthly.

---

## Primary Audience

**Founders, business owners, non-technical buyers** evaluating whether to hire Orvion.co.

They need:

- Evidence the team understands the type of problem they have
- Evidence the team has solved that problem before
- Confidence in how the engagement works
- A budget signal before committing to a conversation

They do not need: tech stack lists, animations, or GPAs.

---

## Secondary Audience

**A — Recruiters / Hiring Managers:** Individual engineers seeking a role. Path: Homepage → About → individual resume download. LinkedIn currently absent from site (open gap).

**B — Technical founders / senior engineers:** Peers evaluating capability. Path: Hero ProductPreview → Work → Case studies. GitHub links are the primary credential.

---

## Design Philosophy

- Dark mode is default for new visitors
- Production-first aesthetics: editorial, deliberate, not decorative
- Animations serve comprehension, not impression
- Typography-led hierarchy (Bodoni Moda serif for display)
- Every animation has a `prefers-reduced-motion` responsibility (partially implemented)

→ See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for tokens and component decisions.

---

## Engineering Philosophy

- TypeScript strict mode. No `any` without a comment.
- Functions max 50 lines. Split at single responsibility boundary.
- No silent failures. Every error must be thrown, logged, or explicitly swallowed with a comment.
- No hardcoded secrets or environment-specific values in source files.
- No dead code in commits.
- Naming: variables = nouns, functions = verbs, booleans = `is/has/can/should` prefixed.
- **Production quality = it runs, it stays up, it handles real data**

→ See [`ENGINEERING_GUIDELINES.md`](ENGINEERING_GUIDELINES.md) for full standards.

---

## Architecture (overview)

| Layer     | Technology                                          | Version          |
| --------- | --------------------------------------------------- | ---------------- |
| Framework | React                                               | 19.2.0           |
| Router    | TanStack Router (file-based)                        | 1.168.0          |
| Build     | Vite                                                | latest           |
| Styling   | Tailwind CSS v4                                     | 4.2.1            |
| Animation | GSAP + Framer Motion                                | 3.15.0 / 12.38.0 |
| Scroll    | Lenis (smooth scroll)                               | 1.3.3            |
| Fonts     | Bodoni Moda, Cabinet Grotesk, JetBrains Mono        | Google Fonts     |
| State     | React useState / useRef (no external state library) | —                |

SPA with client-side routing. No SSR. No SSG (open gap — see IMPLEMENTATION_BACKLOG.md).

→ See [`architecture/`](architecture/) for detailed breakdown.

---

## Routes

| Route         | File                    | Purpose                           |
| ------------- | ----------------------- | --------------------------------- |
| `/`           | `routes/index.tsx`      | Homepage                          |
| `/about`      | `routes/about.tsx`      | Founder profiles + studio history |
| `/work`       | `routes/work.index.tsx` | Project gallery                   |
| `/work/$slug` | `routes/work.$slug.tsx` | Individual case studies           |
| `/process`    | `routes/process.tsx`    | Engineering methodology           |
| `/pricing`    | `routes/pricing.tsx`    | Fixed-fee pricing                 |
| `/contact`    | `routes/contact.tsx`    | Contact form                      |

Case study slugs: `neurodashboard`, `shade-ledger`, `smart-parking`, `carbon-compass`

---

## Production Evidence

| System         | Client                | Status          | Key metric                                      |
| -------------- | --------------------- | --------------- | ----------------------------------------------- |
| Shade Ledger   | Confidential (Mumbai) | Live since 2025 | 220 rental units automated, 40+ hrs saved/month |
| NeuroDashboard | Independent           | Active use      | 70k+ lines, 6 modules                           |
| Smart Parking  | Independent           | Open source     | GitHub: saralbanker/smart-parking               |
| Carbon Compass | Independent           | Open source     | GitHub: saralbanker/carbon-compass              |

---

## Non-Negotiable Decisions

1. **Voice is "we" for studio-level copy** — enforced across all routes and components
2. **Dark mode is default** — `localStorage` theme key; `theme !== "light"` → add `.dark` class
3. **TanStack Router** — not React Router. All routing decisions use `createFileRoute`, `Link to=`.
4. **No hardcoded secrets in source** — contact email is composed in `src/lib/mail.ts`
5. **Hybrid Authority identity** — Orvion.co + two named individuals. Not studio-only, not person-only.
6. **Fixed-fee pricing model** — not hourly. This is a branding decision, not just a pricing decision.
7. **Production-first evidence** — never claim things that aren't running in production

---

## Current Domain

`https://orvion.co` — canonical URL for all absolute links and schema.org declarations.

---

## Known Limitations

- **No SSR/SSG** — all JS-injected schemas (Person, SoftwareApplication, FAQPage) invisible to non-JS crawlers (~40–60% of crawl traffic)
- **No LinkedIn** — both founders lack LinkedIn profiles; absent from site entirely
- **Anonymous client** — Shade Ledger client is "Confidential" — reduces social proof weight
- **No per-project OG images** — all pages share one og-image.png

→ See [`CURRENT_STATE.md`](CURRENT_STATE.md) for active priorities and [`IMPLEMENTATION_BACKLOG.md`](IMPLEMENTATION_BACKLOG.md) for the roadmap.
