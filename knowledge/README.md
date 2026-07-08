# Engineering Knowledge Base (EKB)

Permanent session memory for the Orvion.co portfolio repository.  
**Every Claude Code session must follow the session protocol below before touching any code.**

---

## Mandatory Session Protocol

Run this sequence at the start of every session. Steps 1–3 are always required. Steps 4–5 depend on task domain.

```
1. Read CANONICAL_CONTEXT.md        — who we are, what this site is, voice rules,
                                       non-negotiable decisions (takes ~2 min, saves 30 min)

2. Read CURRENT_STATE.md            — what's done, what's broken, what's P0 right now
                                       (prevents working on the wrong thing)

3. Read DECISIONS.md                — 14 architectural decisions; never re-litigate these
                                       without reading why they exist

4. Read task-relevant files only:
   - Narrative/copy work           → NARRATIVE_ARCHITECTURE.md, BRAND_GUIDE.md
   - Identity/SEO work             → ENTITY_ARCHITECTURE.md, SEO_AI_DISCOVERABILITY.md
   - Visual/design work            → DESIGN_SYSTEM.md
   - Routing/React work            → architecture/frontend.md, architecture/routing.md
   - SEO component/schema work     → architecture/seo.md
   - Project content               → projects/{name}.md
   - Repository navigation         → architecture/repository.md

5. Read IMPLEMENTATION_BACKLOG.md  — confirm task priority before implementing
                                       (some things that seem obvious are intentionally P3)
```

After completing work:

```
6. Update affected knowledge files  — if your change invalidates a fact, fix it here
7. Update CURRENT_STATE.md          — mark completed items, add new bugs if found
8. Never create duplicate knowledge — update existing entries, don't add new files
9. Archive obsolete reports         — see archive/README.md for criteria
```

---

## File Index

### Core Reference (always read 1–3)

| File                                         | Purpose                                       | Read when     |
| -------------------------------------------- | --------------------------------------------- | ------------- |
| [CANONICAL_CONTEXT.md](CANONICAL_CONTEXT.md) | Studio identity, voice, architecture overview | Every session |
| [CURRENT_STATE.md](CURRENT_STATE.md)         | Live P0s, bugs, completed milestones          | Every session |
| [DECISIONS.md](DECISIONS.md)                 | 14 architectural decisions (D-001 – D-014)    | Every session |

### Strategy & Architecture

| File                                                   | Purpose                                  | Read when                         |
| ------------------------------------------------------ | ---------------------------------------- | --------------------------------- |
| [IMPLEMENTATION_BACKLOG.md](IMPLEMENTATION_BACKLOG.md) | P0–P3 prioritized task list              | Before implementing anything      |
| [NARRATIVE_ARCHITECTURE.md](NARRATIVE_ARCHITECTURE.md) | Homepage section order, trust flow, CTAs | Copy/UX/homepage work             |
| [ENTITY_ARCHITECTURE.md](ENTITY_ARCHITECTURE.md)       | Three entities, schemas, knowledge graph | Identity/SEO/schema work          |
| [SEO_AI_DISCOVERABILITY.md](SEO_AI_DISCOVERABILITY.md) | Meta tags, OG, sitemap, llms.txt, gaps   | SEO audit or discoverability work |

### Brand & Design

| File                                 | Purpose                                          | Read when                     |
| ------------------------------------ | ------------------------------------------------ | ----------------------------- |
| [BRAND_GUIDE.md](BRAND_GUIDE.md)     | Voice rules, tone, CTA copy, what not to write   | Any copy or messaging changes |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Typography, color tokens, animation, Tailwind v4 | Visual or design work         |

### Technical Implementation

| File                                                     | Purpose                                           | Read when                   |
| -------------------------------------------------------- | ------------------------------------------------- | --------------------------- |
| [architecture/repository.md](architecture/repository.md) | Full directory tree, all components, config files | General orientation         |
| [architecture/routing.md](architecture/routing.md)       | TanStack Router patterns, route definitions       | Navigation/routing work     |
| [architecture/frontend.md](architecture/frontend.md)     | React 19, GSAP, Framer Motion, canvas, theme      | Animation or component work |
| [architecture/seo.md](architecture/seo.md)               | SEO.tsx, static schemas, dark-mode script         | Schema or meta tag work     |
| [ENGINEERING_GUIDELINES.md](ENGINEERING_GUIDELINES.md)   | TypeScript rules, no-go patterns, code standards  | Before writing any code     |

### Project Reference

| File                                                     | Purpose                                                 | Read when                      |
| -------------------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| [projects/neurodashboard.md](projects/neurodashboard.md) | NeuroDashboard architecture, modules, decisions         | NeuroDashboard case study work |
| [projects/shade-ledger.md](projects/shade-ledger.md)     | Shade Ledger evidence, testimonial, communication rules | Any mention of Shade Ledger    |
| [projects/portfolio.md](projects/portfolio.md)           | This repository — tech stack, components, assets        | Meta-work on the site itself   |
| [projects/README.md](projects/README.md)                 | Index + guidance on adding project files                | Adding a new project           |

### Decisions & Archive

| File                                       | Purpose                                             |
| ------------------------------------------ | --------------------------------------------------- |
| [decisions/README.md](decisions/README.md) | ADR format; overflow from DECISIONS.md              |
| [archive/README.md](archive/README.md)     | What belongs in archive; current archive candidates |

---

## Key Facts (memorize these)

**Studio:** Orvion — two-founder product engineering studio, not a solo freelancer  
**Voice:** Always "we" / "our" (studio voice). Never "I" / "my" in studio-facing copy.  
**Primary proof:** Shade Ledger — 220 rental units, Mumbai, live 2025, saves 40+ hrs/month  
**Canonical titles:** Saral Banker = "Full-Stack & AI Engineer" | Jatin Basantani = "Frontend & AI Systems Developer"  
**Dark mode:** Default for new visitors — check `theme !== "light"` (not `=== "dark"`)  
**Router:** TanStack Router v1.168 — use `<Link to="..." params={...} />`, not `<a href>`  
**Pricing model:** Fixed-fee only — retainers/hourly explicitly rejected (D-012)  
**Contact:** No backend — email compose pattern via `src/lib/mail.ts`

---

## What This EKB Is Not

- Not a replacement for reading source code — always verify decisions in the actual files
- Not a changelog — check `git log` for what changed and when
- Not a substitute for the investigation reports in the root — those have full reasoning chains; EKB has distilled conclusions

---

_EKB created: 2026-07-02. Update this file only to add/remove files from the index or to update the session protocol._
