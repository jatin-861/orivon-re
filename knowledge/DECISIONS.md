# Architectural Decisions
## Every accepted decision — with rationale

> Only record decisions that are non-obvious, were debated, or have been reversed before.  
> Obvious choices ("use React") belong in ENGINEERING_GUIDELINES.md.

---

## D-001: Dark Mode as Default for New Visitors

**Decision:** New visitors (no `localStorage` key) receive dark mode. Condition: `theme !== "light"`.

**Reason:** The brand aesthetic and visual identity (dark backgrounds, terracotta accent) are designed for dark mode. Light mode is available as a preference, not the default.

**Implementation:**
```html
<!-- index.html, inline script before <head> content -->
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (theme !== "light") document.documentElement.classList.add("dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
```

**Alternative considered:** Light mode as default (standard web convention). Rejected because the site's visual identity reads as incomplete in light mode.

**Trade-off:** Users who prefer light mode by default must explicitly switch.

**Date adopted:** 2026-07-02

---

## D-002: TanStack Router (not React Router)

**Decision:** All routing uses `@tanstack/react-router` v1.168.0 with file-based route generation.

**Reason:** Type-safe params (`Link to="/work/$slug" params={{ slug }}`), built-in loader pattern, and active-link detection via `useLocation()`.

**Implementation:** Routes live in `src/routes/`. Root route: `src/routes/__root.tsx`. File-based: `createFileRoute("/path")`.

**Alternative considered:** React Router v6. Not selected — project was already established on TanStack Router before this session began.

**Trade-off:** TanStack Router requires `@tanstack/router-plugin` for Vite codegen; adds build complexity.

**Date adopted:** Pre-existing decision, confirmed 2026-07-02.

---

## D-003: Hybrid Authority Identity Architecture

**Decision:** Three canonical entities — Orvion.co (Organization), Saral Banker (Person), Jatin Basantani (Person) — all present on the site. Studio-primary canvas: "we" voice everywhere except individual founder cards.

**Reason:** The only architecture that survives partnership restructuring AND serves both B2B consulting clients (who hire the studio) and recruiters (who hire individuals).

**Alternatives considered:**
- Person-First (Saral only): Erases co-founder. Rejected.
- Dual-Founder-Equal: Produces three diluted entities, slow trust accumulation. Rejected.
- Studio-Only: Blocks individual hiring. Rejected.
- Federated (3 separate sites): Premature, high maintenance burden. Rejected.

**Trade-off:** Requires maintaining role titles in multiple locations consistently.

**Date adopted:** 2026-07-02 (CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md)

---

## D-004: Canonical Titles

**Decision:**
- Saral Banker: `"Full-Stack & AI Engineer"` (canonical across all schema, cards, bio)
- Jatin Basantani: `"Frontend & AI Systems Developer"` (canonical across all schema, cards, bio)

**Reason:** Multiple role titles existed for both founders across the repository (Jatin had 4 different descriptions). Canonical titles defined to end inconsistency.

**Where applied:** TEAM array (`about.tsx`), Person JSON-LD (`about.tsx`), Organization member JSON-LD (`index.html`), founder card subtitles (`about.tsx`).

**Date adopted:** 2026-07-02

---

## D-005: Static Schema in index.html (Organization + WebSite)

**Decision:** `Organization` and `WebSite` JSON-LD schemas are embedded as static `<script type="application/ld+json">` blocks in `index.html`, not injected by React.

**Reason:** Non-JS crawlers (~40–60% of crawl traffic) cannot execute React. Static schemas in HTML are visible to all crawlers. These two entity types are the most important for knowledge graph establishment.

**Alternative considered:** All schemas via SEO.tsx component (React-injected). Rejected for studio-level schemas because of crawler coverage gap.

**Trade-off:** Static schemas cannot react to page context. They are the studio entity, not page-specific schemas.

**Date adopted:** 2026-07-02

---

## D-006: WebSite Schema (not ProfilePage) on Homepage

**Decision:** The homepage uses `@type: WebSite` JSON-LD, not `@type: ProfilePage`.

**Reason:** `ProfilePage` is for individual-person profile pages. The homepage is a studio homepage — `WebSite` is the correct type and enables sitelinks search box in Google.

**Alternative considered:** `ProfilePage` — rejected because this is a studio, not a personal profile.

**Date adopted:** 2026-07-02

---

## D-007: SEO.tsx Component for Per-Page Schema + Meta

**Decision:** All per-page metadata and JSON-LD schemas are injected via `<SEO>` component rendered inside each route component.

**Reason:** React 19 supports `<title>`, `<meta>`, and `<script>` tags rendered anywhere in the tree — they are hoisted to `<head>` automatically. No `react-helmet` or similar library needed.

**Implementation:** `src/components/SEO.tsx` — accepts `title`, `description`, `canonical`, `ogUrl`, `ogImage`, `schema` (single or array).

**Trade-off:** Schemas injected this way are JS-dependent. Non-JS crawlers cannot see them (addressed by D-005 for studio-level entities).

**Date adopted:** 2026-07-02

---

## D-008: llms.txt for AI Discoverability

**Decision:** `/public/llms.txt` — a plain-text machine-readable studio identity document per the llmstxt.org spec.

**Reason:** AI crawlers (ChatGPT, Perplexity, Gemini, etc.) do not execute JavaScript and often don't parse structured data. A plain-text file at a predictable path provides guaranteed machine-readable identity without JS dependency.

**Contents:** Studio identity, founder names + GitHub, all 4 projects with stack/metrics, services, key stats, all page URLs.

**Date adopted:** 2026-07-02

---

## D-009: Preloader alreadySeen via useRef (not useState in deps)

**Decision:** In `Preloader.tsx`, the "has the visitor seen the preloader before?" flag is stored in `useRef`, initialized once from `sessionStorage`. The `useEffect` dependency array is `[]` (empty).

**Reason:** React 19 StrictMode double-invokes effects (mount → cleanup → remount). If `alreadySeen` was a variable inside the effect deps array, the effect would set `sessionStorage`, trigger a re-render, the dep would change from `false` to `true`, and cleanup would fire `clearInterval`, freezing the animation at ~2%.

**Pattern:**
```tsx
const alreadySeenRef = useRef(
  typeof sessionStorage !== "undefined" && !!sessionStorage.getItem("preloaderSeen"),
);
const [isComplete, setIsComplete] = useState(alreadySeenRef.current);

useEffect(() => {
  if (alreadySeenRef.current) return;
  // interval logic
}, []); // empty deps — runs once
```

**Date adopted:** 2026-07-02 (bug fix)

---

## D-010: Hero GSAP delayBase via useState Lazy Initializer

**Decision:** In `CinematicHero.tsx`, the animation delay (`delayBase`) that synchronizes with the preloader is computed via `useState(() => ...)` lazy initializer, not a `const` or `useEffect`.

**Reason:** `const delayBase = 2.5` was hardcoded, meaning hero content was invisible for 2.5 seconds on return visits (when the preloader is skipped). The lazy initializer reads `sessionStorage` synchronously on first render — before any effects fire.

**Pattern:**
```tsx
const [delayBase] = useState(() => {
  const seen =
    typeof sessionStorage !== "undefined" && !!sessionStorage.getItem("preloaderSeen");
  return seen ? 0 : 2.5;
});
```

**Date adopted:** 2026-07-02 (bug fix)

---

## D-011: ThemeToggle Icon via useState Lazy Initializer

**Decision:** `ThemeToggle.tsx` initializes `isDark` via `useState(() => document.documentElement.classList.contains("dark"))` — not `useState(false)` + `useEffect`.

**Reason:** Initializing to `false` then correcting in a `useEffect` caused a Sun→Moon icon flash on initial paint in dark mode.

**Date adopted:** 2026-07-02 (bug fix)

---

## D-012: Fixed-Fee Pricing Model

**Decision:** All pricing is fixed-fee per project scope, not hourly. The Pricing page communicates this as the first headline: "Fixed fee, not hourly."

**Reason:** This is a branding decision as much as a pricing decision. Fixed-fee reduces scope ambiguity fear for B2B clients and differentiates from typical freelance hourly billing.

**Three pricing lines:** Website Development (₹20k–₹10L), Mobile App Development (₹60k–₹21L), Automation & SaaS (₹35k–₹55L). Downloadable PDFs for each.

**Date adopted:** Pre-existing, confirmed 2026-07-02.

---

## D-013: Contact Form via Email Compose (not form backend)

**Decision:** The contact form in `contact.tsx` does not POST to a backend. On submit, it detects the visitor's email provider and opens a pre-filled compose window (Gmail, Outlook, Yahoo, or `mailto:`).

**Reason:** No server infrastructure to maintain. The email lands directly in the studio inbox without a middleman service.

**Trade-off:** A visitor who does not have an email client configured cannot submit easily (mitigated by the "copy to clipboard" fallback).

**Date adopted:** Pre-existing decision.

---

## D-014: Homepage Narrative Sequence (Target Architecture)

**Decision:** The canonical homepage section order, adopted from HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md:

1. `CinematicHero` — WHO (fixed voice)
2. `StudioManifesto` — BELIEF (moved from position 6)
3. `FeaturedEvidence` — PROOF (new component)
4. `ScrollStoryHorizontal` — CAPABILITY (one project section)
5. `ProcessSignal` — METHODOLOGY (new component)
6. `SkillsMarquee` — TECHNICAL SIGNALS
7. `Numbers` — QUANTIFIED PROOF
8. `BigCTA` — CONVERSION

Sections removed: `ScrollingTicker`, `StudioShowreel`, `StoryTeller`.

**Reason:** Belief must precede evidence. Evidence must be complete in one place, not scattered. Process signal eliminates the primary B2B conversion blocker (methodology uncertainty).

**Status:** Decision accepted. Implementation pending (P1/P2 backlog).

**Date adopted:** 2026-07-02 (HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md)
