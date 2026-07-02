# Homepage Execution Report
## Orvion.co — Implementation of Homepage Decision Architecture Blueprint

**Date:** 2026-07-02  
**Scope:** P0 + P1 + P2 implementation (P3 deferred — see rejections)  
**Build status:** ✅ TypeScript clean, Vite build passes (3.27s)

---

## Executive Summary

All P0, P1, and P2 items from the `HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md` have been implemented and verified. The homepage now follows the canonical 8-section trust-building sequence:

```
CinematicHero → StudioManifesto → FeaturedEvidence → ScrollStoryHorizontal
→ ProcessSignal → SkillsMarquee → Numbers → BigCTA
```

**Business impact summary:**
- Voice contradiction (the highest-trust-damage bug) is resolved: consistent "we" from hero through footer
- All dead-end CTAs eliminated
- Belief now precedes evidence (Manifesto at section 2, not section 6)
- Shade Ledger story told completely in one place (FeaturedEvidence)
- Process fear addressed before conversion (ProcessSignal)
- Budget self-qualification enabled (pricing signal in BigCTA)
- Post-contact uncertainty removed (3-item assurance in BigCTA)
- Cross-page navigation paths added (Work → About, About → Process)

---

## Recommendation Validation Matrix

| ID | Recommendation | Repository Evidence | Verdict | Notes |
|---|---|---|---|---|
| P0-1 | Fix "I build software" → "We build software" | `CinematicHero.tsx:371` confirmed | ✅ Implement | Single word change |
| P0-2 | Fix "I design, build" → "we design, build" | `CinematicHero.tsx:374` confirmed | ✅ Implement | Single word change |
| P0-3 | Fix "Tell me more" → "Tell us more" | `contact.tsx:418` confirmed | ✅ Implement | Single word change |
| P0-4 | Fix footer bio singular "I" | `SiteFooter.tsx:51` confirmed | ✅ Implement | One sentence change |
| P0-5 | Fix StoryTeller dead-end CTA | `Button.tsx` is pure `<button>` — no navigation — confirmed dead end | ✅ Implement | Added `onClick → navigate("/work")` via `useNavigate` |
| P0-6 | Fix Jatin subtitle | `about.tsx:467` confirmed | ✅ Implement | One string change |
| P0-7 | Fix Saral jobTitle in JSON-LD | `about.tsx:187` + `index.html:74` confirmed | ✅ Implement | Two targeted edits + TEAM designation |
| P1-1 | Remove ScrollingTicker | `index.tsx:57` confirmed | ✅ Implement | Removed function + JSX + divider pair |
| P1-2 | Remove StudioShowreel | `index.tsx:67` confirmed; uses `useStickyHorizontalScroll` + `LazyVideo` (now dead imports) | ✅ Implement | Removed function + JSX + dead imports |
| P1-3 | Remove StoryTeller from homepage | `index.tsx:71` confirmed; P0-5 separately wired the CTA | ✅ Implement | Removed JSX + import |
| P1-4 | Move StudioManifesto to section 2 | `index.tsx:74` confirmed, animation position-independent | ✅ Implement | JSX reorder only |
| P1-5 | Remove hero metrics strip | `CinematicHero.tsx:113-118` (METRICS array), `CinematicHero.tsx:395-407` (grid JSX) | ✅ Implement | Both removed; Numbers section unchanged |
| P1-6 | Remove Resume CTA from hero | `CinematicHero.tsx:386-392` confirmed; `Download` import becomes dead | ✅ Implement | CTA + import removed |
| P1-7 | Add bridge sentence to Manifesto | StudioManifesto ends abruptly when moved to section 2 | ✅ Implement | "Here's what that looks like in practice." |
| P2-1 | FeaturedEvidence component | Content confirmed in `work.$slug.tsx:394-403`, testimonial in `about.tsx:286` | ✅ Implement | New component at `src/components/FeaturedEvidence.tsx` |
| P2-2 | ProcessSignal component | Content confirmed in `process.tsx:20-57` STEPS array | ✅ Implement | New component at `src/components/ProcessSignal.tsx` |
| P2-3 | Pricing signal in BigCTA | BigCTA function in `index.tsx` confirmed; `/pricing` route exists | ✅ Implement | One link line below CTA button |
| P2-4 | Post-contact assurance in BigCTA | Contact page has "What happens next" — surfacing earlier | ✅ Implement | 3-item inline list above CTA button |
| P2-5 | Work → About cross-page CTA | `work.index.tsx` ends with project grid, no CTA | ✅ Implement | "Meet the engineers" CTA added to Work index |
| P2-6 | About → Process cross-page CTA | `about.tsx` closing CTA goes to `/contact` only | ✅ Implement | Secondary "See how we work" link added |
| P3-1 | Nav reorder (About before Pricing) | No analytics data available | ❌ Reject | Blueprint acknowledges traffic-source dependency; wrong change worse than no change |

---

## Priority Roadmap

### P0 — Voice + Dead-End Fixes ✅ Complete

| # | Task | Complexity | Risk | Business Impact |
|---|---|---|---|---|
| P0-1 | Hero "I" → "We" (line 1) | Minimal | None | Highest — first 5 seconds of visit |
| P0-2 | Hero "I" → "we" (line 2) | Minimal | None | High |
| P0-3 | Contact "Tell me more" → "Tell us more" | Minimal | None | Low |
| P0-4 | Footer bio singular → plural | Minimal | None | Medium — last thing every visitor reads |
| P0-5 | StoryTeller dead-end CTA | Low | None | High — trust-destroying interaction |
| P0-6 | Jatin subtitle canonical title | Minimal | None | Medium — recruiter trust |
| P0-7 | Saral jobTitle JSON-LD (2 locations) | Minimal | None | SEO/knowledge graph |

**Dependencies:** None. All P0 items were independent.

### P1 — Homepage Restructuring ✅ Complete

| # | Task | Complexity | Risk | Business Impact |
|---|---|---|---|---|
| P1-1 | Remove ScrollingTicker | Low | Low | Medium — belief arrives sooner |
| P1-2 | Remove StudioShowreel | Medium | Managed | High — eliminates redundancy that depletes attention |
| P1-3 | Remove StoryTeller from homepage | Low | Low | High — removes redundant belief section |
| P1-4 | Move Manifesto to section 2 | Low | Low | Highest — belief now precedes evidence |
| P1-5 | Remove hero metrics strip | Low | Low | Medium — metrics arrive with context in Numbers |
| P1-6 | Remove Resume CTA | Minimal | None | Medium — hero CTA is now singular and clear |
| P1-7 | Add Manifesto bridge sentence | Minimal | None | Low — improves narrative flow |

**Dependencies:** P0 complete first (P0-5 fires before P1-3 removes StoryTeller).

### P2 — New Components ✅ Complete

| # | Task | Complexity | Risk | Business Impact |
|---|---|---|---|---|
| P2-1 | FeaturedEvidence component | Medium | Low | Highest — completes the Shade Ledger story |
| P2-2 | ProcessSignal component | Medium | Low | High — addresses #1 unconverted visitor reason |
| P2-3 | Pricing signal in BigCTA | Minimal | None | High — budget self-qualification |
| P2-4 | Post-contact assurance | Low | None | High — removes final conversion blocker |
| P2-5 | Work → About CTA | Minimal | None | Medium — cross-page journey |
| P2-6 | About → Process CTA | Minimal | None | Medium — cross-page journey |

**Dependencies:** P1 complete first (section slots must exist before wiring new components).

### P3 — Remaining Backlog (not implemented)

| # | Task | Complexity | Risk | Dependency |
|---|---|---|---|---|
| P3-1 | Nav reorder | Minimal | Low | Analytics data to confirm traffic source |
| P3-2 | Static prerendering (SSG) | HIGH | HIGH | All P0/P1/P2 complete — now eligible |
| P3-3 | LinkedIn profiles | External | — | Founders must create accounts |
| P3-4 | Per-project OG images | Medium | Low | Playwright generation |
| P3-5 | prefers-reduced-motion | Medium | Medium | Animation audit required |
| P3-6 | Jatin GitHub in footer dock | Minimal | None | Confirm GitHub is public-facing |

---

## Incremental Implementation Log

### Batch 1 — P0 (Voice + Schema + Dead-End)

**Files changed:**
- `src/components/canvas/CinematicHero.tsx` — "I build" → "We build", "I design" → "we design"
- `src/routes/contact.tsx` — "Tell me more" → "Tell us more"
- `src/components/SiteFooter.tsx` — "Product engineer. I design..." → "Product engineering studio. We design..."
- `src/routes/about.tsx` — Jatin subtitle, Saral JSON-LD jobTitle, Saral TEAM designation
- `index.html` — Saral Organization member jobTitle
- `src/components/StoryTeller.tsx` — Added `useNavigate` import + `onClick={() => navigate({ to: "/work" })}` to realm-btn

**TypeScript:** ✅ Zero errors after batch.

---

### Batch 2 — P1 (Homepage Restructuring)

**Files changed:**
- `src/routes/index.tsx`:
  - Removed imports: `StoryTeller`, `LazyVideo`, `useStickyHorizontalScroll`
  - Removed functions: `StudioShowreel`, `ScrollingTicker`
  - Restructured `Index()` return: Manifesto moved to section 2, ScrollStoryHorizontal is now the only project section
  - Added bridge sentence to `StudioManifesto` function
- `src/components/canvas/CinematicHero.tsx`:
  - Removed `METRICS` constant
  - Removed metrics grid JSX
  - Removed Resume `<a>` CTA
  - Removed `Download` import (now unused)

**TypeScript:** ✅ Zero errors after batch.

---

### Batch 3 — P2 (New Components + BigCTA + Cross-Page CTAs)

**Files created:**
- `src/components/FeaturedEvidence.tsx` — Complete Shade Ledger story (before/after/live/testimonial/CTA)
- `src/components/ProcessSignal.tsx` — 3-step process preview with Framer Motion entrance animations

**Files changed:**
- `src/routes/index.tsx`:
  - Added `FeaturedEvidence` and `ProcessSignal` imports
  - Wired both into `Index()` at sections 3 and 5
  - Added post-contact assurance (3 bullet items) above BigCTA button
  - Added pricing signal link below BigCTA button
- `src/routes/work.index.tsx` — Added "Meet the engineers →" CTA at page bottom
- `src/routes/about.tsx` — Added "See how we work →" secondary CTA to closing block

**TypeScript:** ✅ Zero errors after batch (caught and fixed TanStack Router typed params for `to="/work/$slug" params={{ slug: "shade-ledger" }}`).

**Build:** ✅ Vite production build, 2277 modules, 3.27s.

---

## Final Verification

### Completed work

| Item | Status |
|---|---|
| P0: Voice consistency (hero, footer, contact) | ✅ |
| P0: Dead-end CTA (StoryTeller realm-btn) | ✅ |
| P0: Canonical titles (Jatin, Saral) in cards + JSON-LD + index.html | ✅ |
| P1: Removed ScrollingTicker | ✅ |
| P1: Removed StudioShowreel | ✅ |
| P1: Removed StoryTeller from homepage | ✅ |
| P1: Moved Manifesto to section 2 | ✅ |
| P1: Removed hero metrics strip | ✅ |
| P1: Removed Resume CTA from hero | ✅ |
| P1: Bridge sentence added to Manifesto | ✅ |
| P2: FeaturedEvidence component | ✅ |
| P2: ProcessSignal component | ✅ |
| P2: Post-contact assurance in BigCTA | ✅ |
| P2: Pricing signal in BigCTA | ✅ |
| P2: Work → About cross-page CTA | ✅ |
| P2: About → Process cross-page CTA | ✅ |

### Modified recommendations

- **P0-7 bonus:** Also updated Saral TEAM `designation` field in `about.tsx` (`"Product Engineer · Full-Stack & AI Applications"` → `"Full-Stack & AI Engineer · Orvion.co"`) — this is displayed text in `AnimatedTestimonials`, not just JSON-LD.
- **P0-5 + P1-3 sequencing:** P0-5 wired the realm-btn to `/work` (fixing the trust incident). P1-3 removed StoryTeller from the homepage entirely. Both were needed — P0-5 ensured zero dead-end CTAs in any intermediate build state.

### Rejected recommendations

| Recommendation | Reason |
|---|---|
| P3-1: Nav reorder | Blueprint explicitly notes traffic-source dependency; no analytics available; wrong change is worse than no change |

### Build status

- TypeScript: ✅ Zero errors
- Vite build: ✅ Passes (3.27s, 2277 modules)
- Dead imports: ✅ Cleaned (`StoryTeller`, `LazyVideo`, `useStickyHorizontalScroll`, `Download`)

### Accessibility

- Hero SR-only H1 unchanged — canvas particle text remains screen-reader accessible
- FeaturedEvidence and ProcessSignal use semantic `<section>` with appropriate heading hierarchy (`h2`, `h3`)
- All `<Link>` elements have descriptive text content

### Responsive behavior

- FeaturedEvidence: `grid-cols-1 md:grid-cols-3` — stacks on mobile
- ProcessSignal: `grid-cols-1 md:grid-cols-3` with Framer Motion stagger — stacks on mobile
- BigCTA assurance items: `flex-col sm:flex-row` — stacks on mobile

### Performance observations

- `StudioShowreel` removal eliminates three lazy-loaded `<video>` elements per page load
- `useStickyHorizontalScroll` and its GSAP ScrollTrigger setup are now absent from the homepage
- Bundle size: `index-DCTw1KLV.js` is 34.73 kB (gzip: 10.70 kB) — reasonable for the homepage component graph
- New components (`FeaturedEvidence`, `ProcessSignal`) use no canvas or heavy animation — Framer Motion entrance only

### Remaining backlog

See `knowledge/IMPLEMENTATION_BACKLOG.md` — P3 items are all that remain for homepage. Next logical implementation target is P3-2 (static prerendering) which would resolve the non-JS crawler schema coverage gap.

---

## Knowledge Base Synchronization

Updated `knowledge/CURRENT_STATE.md`:
- All P0/P1/P2 tasks moved from "Active Priorities" to "Recently Completed"
- Known bugs table updated with ✅ Fixed status
- Remaining priorities now show only P3 items

The `knowledge/IMPLEMENTATION_BACKLOG.md` P0/P1/P2 entries remain as historical record. The `knowledge/NARRATIVE_ARCHITECTURE.md` target section order now matches production state.

The Engineering Knowledge Base and the repository are in sync.
