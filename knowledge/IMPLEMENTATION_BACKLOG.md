# Implementation Backlog

## Prioritized engineering tasks — no speculation, only decided work

> Source: HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md, NARRATIVE_DECISION_ARCHITECTURE_REPORT.md, CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md  
> Cross-reference: [`CURRENT_STATE.md`](CURRENT_STATE.md) for active priorities

---

## P0 — Immediate (voice consistency + dead-end fix)

These are bugs, not features. Complete before any other work.

### P0-1: Fix hero voice — "I" → "We"

**Current:** `"I build software that solves real problems."` (`CinematicHero.tsx:371`)  
**Target:** `"We build software that solves real problems."`  
**Reason:** Two lines above this, the hero says "we're Saral x Jatin." The immediate I/we switch is the highest-severity trust issue on the site.  
**Business impact:** Fixes the single biggest trust interruption at the highest-attention moment.  
**Engineering complexity:** One word change.  
**Dependencies:** None.  
**Success criteria:** No instance of "I" after "we're" in the hero copy.

### P0-2: Fix hero body — second "I" → "We"

**Current:** `"I design, build, and ship production systems..."` (`CinematicHero.tsx:374`)  
**Target:** `"We design, build, and ship production systems..."`  
**Engineering complexity:** One word change.  
**Dependencies:** None.

### P0-3: Fix contact form label

**Current:** `"Tell me more"` (`contact.tsx:419`, textarea `<Label>`)  
**Target:** `"Tell us more"`  
**Engineering complexity:** One word change.

### P0-4: Fix footer bio

**Current:** `"Product engineer. I design, build, and ship complete systems — database to deployment."` (`SiteFooter.tsx:51`)  
**Target:** `"Product engineering studio. We design, build, and ship complete systems — database to deployment."`  
**Reason:** Footer is the last thing every visitor reads. Singular "I" contradicts every "we" used on the rest of the site.  
**Engineering complexity:** One sentence change.

### P0-5: Fix StoryTeller dead-end CTA

**Current:** `<Button id="realm-btn" title="see what's running" />` in `StoryTeller.tsx` — `Button` is not a TanStack `Link`; no `href` or `onClick` visible in JSX.  
**Target:** Either (a) wire to `/work` via the Button component's link prop, or (b) if the section is being removed in P1, remove this simultaneously.  
**Reason:** A non-functional CTA at the belief section is a brand trust incident. Claiming production-quality work while the portfolio has a broken button is contradictory.  
**Dependencies:** Inspect `src/components/Button.tsx` to confirm API.  
**Success criteria:** Clicking "see what's running" navigates to `/work` or the button is absent from the DOM.

### P0-6: Fix Jatin founder card subtitle

**Current:** `"Full-Stack Engineer & AI Systems Builder"` (`about.tsx:467`, founder card `<p>` subtitle)  
**Target:** `"Frontend & AI Systems Developer"`  
**Reason:** Canonical title from D-004. This is the fourth different role description Jatin has on the site.  
**Engineering complexity:** One line change.

### P0-7: Fix Saral Person JSON-LD jobTitle

**Current:** `jobTitle: "Product Engineer"` in two places:

- `about.tsx` Person JSON-LD schema
- `index.html` Organization member[0] jobTitle  
  **Target:** `"Full-Stack & AI Engineer"` in both locations.  
  **Engineering complexity:** Two targeted edits.  
  **Dependencies:** None.

---

## P1 — Homepage restructuring (after P0 complete)

### P1-1: Remove ScrollingTicker from homepage

**Current:** `<ScrollingTicker />` section (section 2) with 8 capability marquee items.  
**Target:** Remove component from route; remove `<ScrollingTicker />` call + function + animated-divider pair.  
**Reason:** Restates what the hero already says. Interrupts the decision flow between identity and projects. No new information introduced.  
**Business impact:** Attention reaches the belief section sooner.  
**Engineering complexity:** Delete function + JSX reference.  
**Success criteria:** Hero flows directly to next section. No visual regression.

### P1-2: Remove StudioShowreel from homepage

**Current:** `<StudioShowreel />` (section 4) — video showreel of same 3 projects as ScrollStoryHorizontal.  
**Target:** Remove component from route.  
**Reason:** Identical content (Knowledge Hub, Shade Ledger, Smart Parking) in a different visual format. No new information.  
**Engineering complexity:** Delete function + JSX reference. The `useStickyHorizontalScroll` hook is used here — confirm it's not used elsewhere before deleting the import.  
**Success criteria:** ScrollStoryHorizontal is the only project section.

### P1-3: Move StudioManifesto to section 2 (before projects)

**Current:** `StudioManifesto` is section 6 in `routes/index.tsx`.  
**Target:** Section 2 — immediately after CinematicHero, before any project section.  
**Reason:** Belief must precede evidence. Without the manifesto's philosophy, project metrics are just numbers. See D-014.  
**Engineering complexity:** Move JSX block in `routes/index.tsx`. GSAP scroll animations in StudioManifesto are position-independent.  
**Success criteria:** The belief statement ("Most software stays a demo...") is visible within the first 30 seconds of homepage reading.

### P1-4: Remove hero metrics strip

**Current:** `METRICS` array + 4-column grid rendered inside `CinematicHero.tsx` (lines ~395–408).  
**Target:** Remove the metrics grid from the hero. Metrics remain in the Numbers section (section 7 in target structure).  
**Reason:** Metrics without context are premature proof. In the target structure, the Numbers section arrives after belief + evidence — when numbers have interpretive context. Having them in both locations is redundant.  
**Engineering complexity:** Delete METRICS array and grid JSX from CinematicHero.  
**Dependencies:** Confirm Numbers section is intact and positioned correctly.  
**Success criteria:** Stats appear once on the homepage, after the belief and evidence sections.

### P1-5: Remove Resume CTA from hero

**Current:** `<a href="/Orvion_Team_Resume.pdf" download>Resume</a>` as secondary CTA button in hero.  
**Target:** Remove from hero. Resume links remain on `/about` (individual founder cards with `Saral_Banker_Resume.pdf` and `Jatin_Basantani_Resume.pdf`).  
**Reason:** Resume CTA in the hero is for recruiters. The hero is written for B2B clients. Competing CTAs dilute both audiences.  
**Engineering complexity:** Delete one `<a>` element.

### P1-6: Add narrative bridge to StudioManifesto

**Current:** StudioManifesto ends with the Shade Ledger reference paragraph.  
**Target:** Add one connecting sentence at the end: a bridge to the FeaturedEvidence section below.  
**Reason:** In the new section 2 position, the manifesto immediately precedes the project sections. A bridge sentence prevents an abrupt topic jump.  
**Engineering complexity:** One sentence addition inside `StudioManifesto` function.

---

## P2 — New components (after P1 complete)

### P2-1: FeaturedEvidence component

**Current:** Shade Ledger evidence is distributed across 5 sections, presented completely in 0 sections.  
**Target:** A new homepage section that presents the complete Shade Ledger story: before state → after state → live status → outcome.

**Content source (no new copy needed):**

- Before: "Replaced manual Excel billing and phone calls" — from `SIMPLE_CONTENT['shade-ledger'].whatItDoes` in `work.$slug.tsx`
- After: invoice generation, WhatsApp reminders, penalty tracking — from `howItWorks` array
- Outcome: 220 rental units, 40+ hours saved — from METRICS and Numbers data
- Quote: "Billing used to eat a whole afternoon every month. Now it just runs." — from `about.tsx` testimonial section

**CTA:** `"See the full case study →"` → `/work/shade-ledger`  
**Engineering complexity:** New component file + add to `routes/index.tsx` as section 3.  
**Dependencies:** P1-3 (Manifesto moved), P1-1 (Ticker removed).

### P2-2: ProcessSignal component

**Current:** No process information on homepage. Methodology is on `/process` only.  
**Target:** A new lightweight section (3 steps: Discover → Build → Ship) that answers "what happens if I contact them?" before the CTA.

**Content source:** `STEPS` array in `process.tsx` — first 3 steps (Discover, Define, Build — or adapt to Discover/Build/Ship for homepage compression).  
**CTA:** `"How we work →"` → `/process`  
**Engineering complexity:** New component file + add to `routes/index.tsx` as section 5.

### P2-3: Pricing signal in BigCTA

**Current:** No pricing information surfaced from homepage.  
**Target:** One sentence below the CTA button in BigCTA: "Fixed-fee pricing available. [See pricing →]"  
**Reason:** B2B buyers who self-qualify on budget before contacting are higher-quality leads.  
**Engineering complexity:** One line addition inside `BigCTA` function.

### P2-4: Post-contact assurance in BigCTA

**Current:** BigCTA has the headline and one CTA button. No post-contact clarity.  
**Target:** 3 micro-items above or below the CTA: "We reply within 48 hours, personally → Quick 15-min call to understand scope → Real proposal, not a sales deck."  
**Reason:** Post-contact uncertainty is the final conversion blocker. The Contact page addresses it with "What happens next" — this surfaces it one step earlier.  
**Engineering complexity:** Add 3 card/list items to `BigCTA` function.

### P2-5: Work → About cross-page transition

**Current:** `work.index.tsx` ends with a project grid. No CTA to the About page.  
**Target:** Add a CTA link at the bottom of the work index: "Meet the engineers →" → `/about`  
**Reason:** A visitor who evaluates capability (Work) needs a natural path to identity (About).  
**Engineering complexity:** Add one CTA block to `work.index.tsx`.

### P2-6: About → Process cross-page transition

**Current:** `about.tsx` closing CTA goes only to `/contact`.  
**Target:** Add a secondary CTA: "See how we work →" → `/process`  
**Engineering complexity:** Add one secondary link to the closing CTA block in `about.tsx`.

---

## P3 — Lower priority / external dependency

### P3-1: Navigation reorder

**Current:** Work → Process → Pricing → About → Contact (`SiteHeader.tsx:9-15` NAV array)  
**Target:** Work → About → Process → Pricing → Contact (or About first — see note)  
**Reason:** About should precede Pricing. A buyer should know who they're working with before seeing cost.  
**Note:** If majority traffic is project-referral (visitors already know specific projects), Work-first is correct. Verify with analytics before changing.  
**Engineering complexity:** Reorder 5 items in the NAV array.

### P3-2: Static prerendering (vite-react-ssg)

**Current:** SPA with client-side rendering. JS-injected schemas invisible to non-JS crawlers.  
**Target:** Static site generation so Person, SoftwareApplication, FAQPage schemas are in rendered HTML.  
**Engineering complexity:** HIGH — requires vite-react-ssg integration + testing all routes.  
**Dependencies:** All P0/P1/P2 complete first.

### P3-3: LinkedIn profiles

**Current:** No LinkedIn for either founder anywhere on the site.  
**Target:** Add LinkedIn links to footer dock (alongside GitHub) and founder cards on About page.  
**Dependencies:** Founders must create/activate LinkedIn profiles first (external).

### P3-4: Per-project OG images

**Current:** All pages share `og-image.png` (1200×630, studio brand image).  
**Target:** Unique OG images for each case study (`/work/neurodashboard`, `/work/shade-ledger`, etc.)  
**Engineering complexity:** Generate 4 images via Playwright + update schema/meta per page.

### P3-5: prefers-reduced-motion

**Current:** Page transitions and some animations do not respect `prefers-reduced-motion`.  
**Target:** All GSAP and Framer Motion animations check `window.matchMedia('(prefers-reduced-motion: reduce)')`.  
**Engineering complexity:** MEDIUM — requires auditing all animation entry points.

### P3-6: Jatin GitHub in footer dock

**Current:** Footer dock has only Saral's GitHub + studio email.  
**Target:** Decision: add `github.com/jatin-861` to dock OR keep dock studio-only.  
**Note:** Requires confirming Jatin's GitHub is active and public-facing.
