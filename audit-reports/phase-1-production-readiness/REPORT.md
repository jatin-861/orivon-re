# Phase 1 — Production Readiness Investigation

**Repository:** `orivon-re` (under `orvion-port/`)
**Audit Date:** 2026-07-01
**Auditor:** Claude Code (Sonnet 4.6) via lyra_winter_prompt
**Previous Audit:** `docs/AUDIT-REPORT.md`, dated 2026-06-26, score 68/100
**Method:** Static source review · TypeScript compile · ESLint diagnostics · Bundle analysis · npm audit · SEO/accessibility inspection
**Scope:** Client-side SPA only. No backend, no database, no auth, no payments.
**Phase Type:** STRICTLY INVESTIGATIVE — no code was modified.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overall Production Readiness Score](#2-overall-production-readiness-score)
3. [Scorecard Summary](#3-scorecard-summary)
4. [Repository Health Assessment](#4-repository-health-assessment)
5. [Architecture Assessment](#5-architecture-assessment)
6. [Technical Debt Assessment](#6-technical-debt-assessment)
7. [Security Assessment](#7-security-assessment)
8. [Performance Assessment](#8-performance-assessment)
9. [Accessibility Assessment](#9-accessibility-assessment)
10. [SEO Assessment](#10-seo-assessment)
11. [Mobile Readiness Assessment](#11-mobile-readiness-assessment)
12. [Dependency Health Assessment](#12-dependency-health-assessment)
13. [Code Quality Assessment](#13-code-quality-assessment)
14. [Runtime Stability Assessment](#14-runtime-stability-assessment)
15. [AI-Generated Repository Risk Assessment](#15-ai-generated-repository-risk-assessment)
16. [Complete Issue Inventory](#16-complete-issue-inventory)
17. [Hidden Risks](#17-hidden-risks)
18. [Technical Debt Hotspots](#18-technical-debt-hotspots)
19. [Architectural Weaknesses](#19-architectural-weaknesses)
20. [Prioritized Implementation Roadmap](#20-prioritized-implementation-roadmap)
21. [Final Production Readiness Verdict](#21-final-production-readiness-verdict)

---

## 1. Executive Summary

The codebase is genuinely well-engineered for an animation-heavy portfolio SPA. It demonstrates clear architectural decisions, documented trade-offs in code comments, proper accessibility foundations, and thoughtful performance considerations. The engineering quality is well above the typical AI-assisted portfolio.

However, **the site cannot be considered production-ready as delivered**. Five categories of issues block launch or will cause material user-facing failures:

1. **Missing OG image** — `og-image.png` is referenced on every page but does not exist in `public/` or the build output. Every social share card is broken.
2. **Placeholder testimonials** — `src/data/testimonials.ts` contains an explicit `// Placeholder content — swap for real client quotes` comment at the top of the file. These are rendered live on the About page as if they are real client feedback.
3. **Static fake dashboard data** — The hero `ProductPreview` widget shows hard-coded `"12,543 docs indexed"`, `"1,247 queries per day"`, `"99.6% uptime"` — presented visually as live metrics.
4. **Stub resume** — `/public/Jatin_Basantani_Resume.pdf` is 6.7 KB (a 2-page outline). It is publicly downloadable and linked from the About page.
5. **Multiple `<h1>` per page** — `about.tsx`, `process.tsx`, and `contact.tsx` each render two `<h1>` elements via the `RevealText as="h1"` component, which is a WCAG 1.3.1 accessibility failure.

All five are content or configuration issues, not engineering problems. They can be resolved in one focused workday without touching the core codebase.

---

## 2. Overall Production Readiness Score

> **72 / 100 — NOT READY FOR LAUNCH**

**Delta from prior audit:** +4 points (previous: 68/100, dated 2026-06-26)

**Score drivers:**

- +4: Security headers added (`X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Permissions-Policy`), per-page SEO implemented on all routes, hardcoded fake login credentials removed.
- −0: Score held from progressing further by the missing OG image, placeholder content, dead code accumulation, and zero test coverage.

**Threshold for launch-ready:** 80+

---

## 3. Scorecard Summary

| Dimension                    |    Score | Confidence | Notes                                               |
| ---------------------------- | -------: | ---------- | --------------------------------------------------- |
| Overall Production Readiness | 72 / 100 | High       |                                                     |
| Repository Health            | 71 / 100 | High       | 12 dead files, debris in reports/                   |
| Architecture                 | 82 / 100 | High       | Solid routing, animation, cleanup                   |
| Security                     | 74 / 100 | High       | Good headers; missing CSP                           |
| Performance                  | 70 / 100 | Medium     | No Lighthouse run; static analysis only             |
| Accessibility                | 75 / 100 | High       | Multiple h1 per page; calendar focus issues         |
| SEO                          | 62 / 100 | High       | OG image missing; og:url missing; duplicate JSON-LD |
| Mobile Readiness             | 78 / 100 | Medium     | No poster on videos; menu has no focus trap         |
| Dependency Health            | 68 / 100 | High       | 2 unused prod deps; 3 npm audit vulns               |
| Code Quality                 | 78 / 100 | High       | 0 TS errors; 547 Prettier-only lint errors          |
| Runtime Stability            | 80 / 100 | High       | Contact form false-positive success state           |
| Maintainability              | 76 / 100 | High       | Dead components confuse future contributors         |
| AI-Generated Risk            |   Medium | High       | Clear layered-session artifacts                     |
| Test Coverage                |       0% | Verified   | `playwright` installed; zero test files             |

---

## 4. Repository Health Assessment

**Score: 71 / 100**

### Dead Source Components (confirmed — 0 imports from any other file)

| File                                        | Evidence                                                                    | Bundle Impact                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/components/InteractiveParticles2D.tsx` | `grep -r "InteractiveParticles2D" src/` → 0 results outside the file itself | None (Vite tree-shakes unused exports)                                                           |
| `src/components/SVGPathReveal.tsx`          | `grep -r "SVGPathReveal" src/` → 0 results                                  | Contains `gsap.registerPlugin(ScrollTrigger)` at module level — dead parse cost if ever imported |
| `src/components/MagneticText.tsx`           | `grep -r "MagneticText" src/` → 0 results                                   | —                                                                                                |
| `src/components/VideoPreview.tsx`           | `grep -r "VideoPreview" src/` → 0 results                                   | —                                                                                                |

### Dead UI Components (confirmed — 0 imports)

| File                                   | Evidence  |
| -------------------------------------- | --------- |
| `src/components/ui/animated-badge.tsx` | 0 imports |
| `src/components/ui/badge.tsx`          | 0 imports |
| `src/components/ui/dialog.tsx`         | 0 imports |
| `src/components/ui/input.tsx`          | 0 imports |
| `src/components/ui/label.tsx`          | 0 imports |
| `src/components/ui/neon-button.tsx`    | 0 imports |
| `src/components/ui/textarea.tsx`       | 0 imports |
| `src/components/ui/tooltip.tsx`        | 0 imports |

**Total dead files: 12** (4 components + 8 UI components)

### Debris in `reports/` Directory

`reports/` is not .gitignored. The following files are committed to the repository:

| File                                       | Type    | Issue                                          |
| ------------------------------------------ | ------- | ---------------------------------------------- |
| `Orvion-Pricing-Intelligence-Report-1.pdf` | PDF     | Committed; likely stale version                |
| `Orvion-Pricing-Matrix-v2.pdf`             | PDF     | Committed; `reports/*.pdf` not in `.gitignore` |
| `Orvion-Pricing-Matrix-v2.xlsx`            | Excel   | Committed                                      |
| `Orvion-Pricing-Matrix-Updated.xlsx`       | Excel   | Committed                                      |
| `Orvion-Pricing-Matrix.xlsx`               | Excel   | Committed                                      |
| `build-pdfs.mjs`, `check4.mjs`, etc.       | Scripts | Devtools committed to main repo                |

Scripts use `exceljs` and `playwright` which are devDependencies, but their output files are committed as repo artifacts.

### Framework Directive Artifact

`src/components/ui/booking-calendar.tsx` line 1:

```tsx
"use client";
```

This is a Next.js App Router directive. It has **no effect** in a Vite/React project. It was copied from a Next.js component library without cleanup.

### GSAP Plugin Registered 11 Times

`gsap.registerPlugin(ScrollTrigger)` appears at module level in:

1. `src/components/layout/LenisProvider.tsx`
2. `src/components/canvas/CinematicHero.tsx`
3. `src/components/SVGPathReveal.tsx` (dead file)
4. `src/components/AnimatedTitle.tsx`
5. `src/hooks/useStickyHorizontalScroll.ts`
6. `src/components/RevealText.tsx`
7. `src/components/TextRevealByWord.tsx`
8. `src/components/layout/PageTransition.tsx`
9. `src/routes/index.tsx`
10. `src/routes/about.tsx`
11. `src/routes/process.tsx`

GSAP handles duplicate registration safely (idempotent). However each call executes synchronously at module parse time, adding marginal overhead across lazy-loaded route chunks.

### Folder Naming Inconsistency

Repository folder is named `orivon-re` (vowels transposed — should be `orvion-re`). Not user-visible but confirms organic naming history.

---

## 5. Architecture Assessment

**Score: 82 / 100**

### Stack

```
React 19
├── TanStack Router v1.168  (file-based routing, autoCodeSplitting: true)
├── Vite 7                  (build, @tanstack/router-plugin/vite)
├── Tailwind CSS v4         (@tailwindcss/vite plugin)
├── GSAP 3.15               (ScrollTrigger, gsap.context, gsap.ticker)
├── Framer Motion 12.38     (AnimatePresence, motion.div, spring physics)
├── Lenis 1.3.3             (smooth scroll, synced to GSAP ticker)
└── Vercel                  (hosting, SPA rewrite, security headers)
```

### What Is Well-Designed

**Routing:**

- TanStack Router file-based routes with `autoCodeSplitting: true` correctly emits separate JS chunks per route, verified in `dist/assets/`.
- `defaultErrorComponent`, `defaultPendingComponent`, `defaultPendingMs`, `defaultPendingMinMs` are all properly configured in `__root.tsx`.
- `notFoundComponent` is wired on both the root route and the `/work/$slug` loader, so 404 states are handled cleanly.
- SPA rewrite in `vercel.json` (`"source": "/(.*)", "destination": "/index.html"`) correctly handles direct URL navigation and browser refresh on any route.

**Smooth Scroll Architecture:**

- `LenisProvider` correctly calls `gsap.ticker.add(lenis.raf)` and `gsap.ticker.lagSmoothing(0)` to synchronize Lenis and GSAP to a single RAF tick, preventing double-frame animation stutter.
- `prefers-reduced-motion` is respected in `LenisProvider`: `smoothWheel: false` and `smoothTouch: false` are set when `prefers-reduced-motion: reduce` is detected.
- `ScrollTrigger.config({ ignoreMobileResize: true })` prevents address-bar resize from mis-firing scroll triggers on iOS.

**Horizontal Scroll:**

- `useStickyHorizontalScroll` uses native CSS `position: sticky` for the track container and `translateX` for the inner panel, explicitly documenting in a comment why it chose this over `ScrollTrigger.pin()` (mobile jiggle avoidance). This is an informed, well-reasoned engineering decision.

**Custom Cursor:**

- Disabled entirely on mobile (`window.innerWidth < 768`) and when `prefers-reduced-motion` is active.
- All cursor DOM elements carry `aria-hidden="true"`.
- Spring physics implementation uses `getBoundingClientRect` for magnetic target snapping — does not use React state, avoiding React re-renders for cursor movement.

**Canvas Architecture:**

- `DottedSurface` uses `isDesktop` state to disable on mobile entirely.
- `CinematicHero` particle canvas defers initialization until `document.fonts.ready` to avoid layout shifts affecting particle positioning.
- `LazyVideo` correctly defers video load until `200px` before viewport entry via `IntersectionObserver` with `rootMargin: "200px"`.

**Error Handling:**

- `ErrorBoundary` at router level with Try Again + Go Home actions.
- `try/catch` around `openCompose` in the contact flow with clipboard fallback.

### What Is Weak

**`PageTransition` stale ref in `tlOut`:**

```tsx
// PageTransition.tsx
gsap.to(overlay, { ... onComplete: () => {
  const tlOut = gsap.timeline();   // created inside onComplete
  tlOut.from(overlay, { ... });    // no ref stored → no cleanup possible
}});
```

`tlOut` is created inside the GSAP `onComplete` callback and has no reference stored for cleanup. If the component unmounts while `tlOut` is playing (e.g., rapid navigation), the animation continues mutating the unmounted DOM node. GSAP does not error on this but it is a memory leak pattern.

**`useStickyHorizontalScroll` stale callback deps:**

```tsx
// useStickyHorizontalScroll.ts
useEffect(() => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // onSetup, onUpdate excluded from deps
```

The hook explicitly suppresses the exhaustive-deps lint warning with an inline comment. If a consumer component re-renders and passes new `onSetup`/`onUpdate` callbacks (even functionally equivalent ones), the scroll behavior silently uses the stale first-render versions.

**Dual animation libraries — GSAP + Framer Motion both fully loaded:**

- GSAP is used for all complex animations (scroll triggers, particle timelines, page transitions, cursor, horizontal scroll).
- Framer Motion is used only for: `AnimatePresence` + `motion.div` entrance animations on about/contact/work pages, and spring physics in `BookingCalendar` button hover.
- Both full libraries are shipped. Framer Motion contributes 142 KB / 47 KB gzipped for use cases that GSAP's `gsap.to()` with `ease: "back.out"` could cover.

---

## 6. Technical Debt Assessment

### Confirmed Debt Items (all evidence-based)

| #   | Item                             | Location                    | Root Cause                                                                        | Confidence |
| --- | -------------------------------- | --------------------------- | --------------------------------------------------------------------------------- | ---------- |
| 1   | 8 dead UI component files        | `src/components/ui/`        | Speculative scaffold from component library, never used                           | Verified   |
| 2   | 4 dead top-level components      | `src/components/`           | Feature experiments abandoned mid-development                                     | Verified   |
| 3   | `next-themes` in production deps | `package.json`              | Installed during early theme prototyping, manual implementation built instead     | Verified   |
| 4   | `zod` in production deps         | `package.json`              | Added preemptively for form validation that was never implemented                 | Verified   |
| 5   | `exceljs` in devDependencies     | `package.json`              | Used only for `reports/` scripts, not app code                                    | Verified   |
| 6   | `playwright` in devDependencies  | `package.json`              | Test infrastructure set up; zero test files ever written                          | Verified   |
| 7   | `"use client"` directive         | `booking-calendar.tsx:1`    | Copied from Next.js component source without cleanup                              | Verified   |
| 8   | 547 ESLint Prettier errors       | All source files            | Prettier was not run before commits                                               | Verified   |
| 9   | 11 redundant GSAP registrations  | 11 files                    | Each component/route generated independently, each added registration defensively | Verified   |
| 10  | Duplicate font loading           | `index.html` + `styles.css` | Two separate font-loading strategies layered without removing the previous        | Verified   |

---

## 7. Security Assessment

**Score: 74 / 100**

### Security Headers (from `vercel.json`)

```json
{
  "headers": [
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
    { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
  ]
}
```

**Status:** Present, correct, appropriate values. ✓

### Critical Gap: No Content-Security-Policy

`vercel.json` has no `Content-Security-Policy` header.

**Why this matters here:**

- `SEO.tsx` uses `dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}` for JSON-LD injection
- `AnimatedTitle.tsx` uses `dangerouslySetInnerHTML={{ __html: word }}` where `word` comes from the `title` prop split on spaces

Both are currently safe (data is static, not user-supplied). Without CSP, however:

1. Any future addition of user-controlled content renders these vectors XSS-capable
2. Browser extensions and third-party scripts have no execution restriction
3. The site has no defense-in-depth layer

**Current risk level: Low** (all data is static)
**Future risk level: High** if dynamic content is ever added

**Recommended CSP** for this stack:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com api.fontshare.com;
  font-src 'self' fonts.gstatic.com api.fontshare.com;
  img-src 'self' data:;
  media-src 'self';
  frame-ancestors 'none';
  connect-src 'self';
```

Note: `'unsafe-inline'` is required for Tailwind v4's runtime CSS injection and GSAP's inline style mutations.

### `dangerouslySetInnerHTML` Usage Map

| File                   | Data Source                                                  | User-Controlled | Risk |
| ---------------------- | ------------------------------------------------------------ | --------------- | ---- |
| `SEO.tsx:90`           | `JSON.stringify(schemaObj)` — prop from route files          | No              | None |
| `AnimatedTitle.tsx:28` | `title.split(" ")` — hardcoded string from `StoryTeller.tsx` | No              | None |

### Email Addresses in Client-Side JS

`src/routes/contact.tsx` assembles email addresses from array joins:

```tsx
const PRIMARY = ["hello", "@", "orvion", ".co"].join("");
```

This is a basic obfuscation against dumb scrapers but not against any browser-rendered page scraper. The email is exposed in `<a href="mailto:...">` in the rendered DOM regardless. This is an accepted trade-off for a contact page.

### No Spam Protection on Contact Form

The contact "form" opens a mailto/webmail compose window — no server-side processing occurs, so CAPTCHA and honeypot are not strictly necessary. However, the email address is visible in the source DOM.

### npm Audit Results

```
3 vulnerabilities found (1 low, 2 moderate)

Dependency chain:
exceljs → uuid < 11.1.1
  - Missing buffer bounds check in v3/v5/v6 functions
  - CVSS: 5.3 (moderate)
```

**Production impact: None.** `exceljs` is a devDependency used only in `reports/` scripts. It is not shipped to production in any bundle.

**Developer machine impact: Low.** The uuid vulnerability is a bounds-check issue in version-namespaced UUID generation — not an RCE or credential leak.

---

## 8. Performance Assessment

**Score: 70 / 100**
_(Static analysis only — no Lighthouse run performed. Scores are estimates.)_

### Production Bundle Inventory (`dist/assets/`)

Sizes measured via `gzip -k -c <file> | wc -c`:

| Chunk                            | Raw Size     | Gzipped     | Assessment                                                |
| -------------------------------- | ------------ | ----------- | --------------------------------------------------------- |
| `index-CwTw2a3_.js` (main entry) | 391 KB       | 127.7 KB    | Heavy; contains React + Router + cursor + utilities       |
| `framer-Bs15Q19t.js`             | 142 KB       | 46.8 KB     | Large relative to its usage in the app                    |
| `gsap-xgxdCp6f.js`               | 70 KB        | 26.8 KB     | Appropriate for the animation complexity                  |
| `index-BEwfKtKm.js` (secondary)  | 43 KB        | ~15 KB      | Lenis + supplementary utilities                           |
| Route chunks (×7)                | ~90 KB total | ~30 KB      | Good — code-split per route                               |
| `index-CSq6xJiY.css`             | 99 KB        | 17.1 KB     | Large CSS; many unused Tailwind utilities likely included |
| **Total JS (uncompressed)**      | **~739 KB**  | —           |                                                           |
| **Total gzipped (JS + CSS)**     | —            | **~263 KB** | Exceeds 150 KB initial load recommendation                |

**Initial critical-path payload** (main entry + CSS + framer chunk all loaded on first page view):

- Gzipped: ~192 KB (main 128 KB + framer 47 KB + CSS 17 KB)
- This is **above** the recommended 150 KB for initial load on a 3G connection

### Video Asset Analysis

| File                          | Size        | Format    | WebM? | Poster? |
| ----------------------------- | ----------- | --------- | ----- | ------- |
| `public/videos/feature-2.mp4` | 4.9 MB      | MP4 H.264 | No    | No      |
| `public/videos/feature-3.mp4` | 4.8 MB      | MP4 H.264 | No    | No      |
| `public/videos/hero-2.mp4`    | 1.7 MB      | MP4 H.264 | No    | No      |
| **Total**                     | **11.4 MB** |           |       |         |

Videos are deferred via `LazyVideo` (200px root margin) — good. However:

- No WebM alternatives (VP9 WebM would be ~30–40% smaller on Chrome/Edge/Firefox/Android)
- No `poster` attribute — browsers show a blank/black frame while the first video frame loads

### Font Loading: Double Request Confirmed

**In `index.html`:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda...&family=JetBrains+Mono..." />
<link rel="preconnect" href="https://api.fontshare.com" />
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@..." />
```

**In `src/styles.css`:**

```css
@import url("https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@...");
@import url("https://fonts.googleapis.com/css2?family=Bodoni+Moda...");
```

**Net effect:**

- Cabinet Grotesk: loaded from Fontshare (HTML) AND Fontshare (CSS) — duplicate from the same CDN
- Bodoni Moda: loaded from Google Fonts (HTML) AND Google Fonts (CSS) — duplicate from the same CDN
- JetBrains Mono: loaded from Google Fonts (HTML) only — no CSS duplicate

This fires 4 font CDN requests instead of 2 on first load. If the browser de-duplicates by URL the impact is minimal; if not (due to slightly different query string ordering), fonts are downloaded twice.

### Canvas Render Loops on Homepage

The homepage runs the following simultaneous animation loops:

| Loop                          | Location            | Throttle                       |
| ----------------------------- | ------------------- | ------------------------------ |
| Particle canvas rAF           | `CinematicHero.tsx` | None (unthrottled)             |
| Dotted surface canvas         | `DottedSurface.tsx` | 30 fps cap via timestamp delta |
| Flow field canvas             | `StoryTeller.tsx`   | Not confirmed                  |
| GSAP ticker (Lenis sync)      | `LenisProvider.tsx` | None (drives scroll)           |
| `CustomCursor` particle burst | `CustomCursor.tsx`  | `requestAnimationFrame`        |

All have `IntersectionObserver`-based pause when off-screen. The compound main-thread animation load on the homepage is the highest in the codebase. On mid-range mobile this could cause jank during initial scroll.

### Tailwind CSS v4 — 99 KB Uncompressed

Tailwind v4 moves from a build-time utility scan to a JIT CSS engine. The 99 KB uncompressed CSS (`17.1 KB gzipped`) suggests the CSS custom property tree and base styles are included in full. This is expected for Tailwind v4 but worth noting as larger than a typical Tailwind v3 production build.

---

## 9. Accessibility Assessment

**Score: 75 / 100**

### What Is Correctly Implemented

| Feature                      | Implementation                                                       | Location                          |
| ---------------------------- | -------------------------------------------------------------------- | --------------------------------- |
| Skip-to-content link         | Visually hidden, revealed on focus                                   | `__root.tsx`                      |
| `prefers-reduced-motion`     | `Lenis` smooth scroll disabled; all CSS animations disabled          | `LenisProvider.tsx`, `styles.css` |
| ARIA labels on icon buttons  | `aria-label` on mobile toggle, calendar nav, resume download         | Multiple                          |
| Custom cursor hidden from AT | `aria-hidden="true"` on all cursor DOM nodes                         | `CustomCursor.tsx`                |
| Preloader progress role      | `role="progressbar"` + `aria-valuenow/min/max/label`                 | `Preloader.tsx`                   |
| Carousel semantics           | `role="region"` + `aria-roledescription="carousel"` + pause-on-focus | `AnimatedTestimonials.tsx`        |
| External link attributes     | `rel="noopener noreferrer"` on all external `<a>`                    | Multiple                          |
| Focus visible styles         | Tailwind `focus-visible:ring` on interactive elements                | Multiple                          |

### Issues Found

#### H03 — Multiple `<h1>` per Page (WCAG 1.3.1, Severity: High)

Three pages render two separate `<h1>` elements:

**`src/routes/about.tsx`:**

```tsx
<RevealText as="h1" ...>Two engineers.</RevealText>
// later:
<RevealText as="h1" ...>real systems.</RevealText>
```

Both are visually intentional (two-part headline split across the viewport). However, screen readers announce both as top-level page headings, making the page structure ambiguous.

**`src/routes/process.tsx`:**

```tsx
<RevealText as="h1" ...>How we work</RevealText>
// later:
<RevealText as="h1" ...>when it matters.</RevealText>
```

**`src/routes/contact.tsx`:**

```tsx
<RevealText as="h1" ...>Let's build</RevealText>
// later:
<RevealText as="h1" ...>something real.</RevealText>
```

**Fix:** The second `RevealText` on each page should use `as="h2"` or `as="p"` to maintain the visual design while producing a valid heading hierarchy.

#### M06 — `aria-disabled` Link Not Keyboard-Blocked (Severity: Medium)

**`src/components/ui/booking-calendar.tsx`:**

```tsx
<a href={calendarUrl} aria-disabled={!selected} className={!selected ? "pointer-events-none" : ""}>
  Book a date
</a>
```

`aria-disabled` is purely informational for `<a>` elements — it does not prevent keyboard activation. `pointer-events-none` prevents mouse clicks but not `Enter` keypresses. A keyboard user on an unselected state can press `Enter` and navigate to `calendarUrl` which may be `undefined`.

**Fix:** Use `<button type="button" disabled={!selected}>` or conditionally omit the `href`.

#### M07 — Mobile Menu Has No Focus Trap (Severity: Medium)

When the mobile navigation menu opens (via hamburger toggle), focus is not moved into the menu. A keyboard user pressing `Tab` after clicking the toggle will Tab through the header links before entering the menu items. Standard accessible pattern requires `focus()` on the first menu item when the menu opens.

The menu also has no close-on-Escape behavior confirmed in the source.

#### L06 — Cursor Text Labels Not Accessible (Severity: Low)

Interactive sections use `data-cursor-text="HONORS"`, `data-cursor-text="STATS"`, etc. These reveal contextual labels in the custom cursor. Screen reader users receive no equivalent information since the cursor is `aria-hidden`.

---

## 10. SEO Assessment

**Score: 62 / 100**

### Meta Infrastructure

Every route has a `<SEO>` component call with unique `title`, `description`, and `keywords`. The `SEO` component renders via React's `<title>` and `<meta>` elements client-side. Sitemap and robots.txt are present.

### Critical Issues

#### C01 — `og:image` Does Not Exist (LAUNCH BLOCKER)

**Evidence:**

- `SEO.tsx` line 32: `const ogImage = ogImageUrl ?? "https://orviontech/og-image.png";`
- `public/og-image.png`: **file does not exist**
- `dist/og-image.png`: **file does not exist**
- `grep -r "og-image" public/ dist/`: no results

**Impact:** Every social share of the site (Twitter/X, LinkedIn, Slack, iMessage, Messenger, WhatsApp, Facebook) shows a broken image card or uses the platform's fallback. For a design/engineering portfolio competing for client attention, this is a first-impression failure on the highest-traffic discovery channel.

**Resolution:** Create a 1200×630px image (`og-image.png`) and add to `public/`. Should include Orvion branding, tagline, and visual style consistent with the site.

#### H03 — `og:url` Not Set

`SEO.tsx` has no `og:url` output. The rendered Open Graph tags on every page are missing:

```html
<meta property="og:url" content="https://orviontech/..." />
```

Without `og:url`, crawlers may deduplicate all routes to the same canonical, or use the referring URL unpredictably.

#### H05 — Duplicate JSON-LD on Homepage

The homepage renders two separate JSON-LD `<script>` blocks:

**In `index.html` (static):**

```json
{
  "@type": "Organization",
  "name": "Orvion",
  ...
}
```

**In `routes/index.tsx` via `SEO.tsx`:**

```json
{
  "@type": "ProfilePage",
  "mainEntity": { "@type": "Person", ... }
}
```

Two separate structured data blocks representing the same entity in different ways. Google's documentation does not prohibit multiple JSON-LD blocks, but overlapping entity definitions can cause the Search Console to flag inconsistencies.

**Resolution:** Remove the Organization schema from `index.html` and consolidate all structured data into the `SEO` component calls.

#### M08 — No JSON-LD on Case Study Pages

`src/routes/work.$slug.tsx` calls `<SEO>` with title/description but passes no `schema` prop. Each case study page could benefit from `SoftwareApplication`, `CreativeWork`, or `TechArticle` structured data to enable rich results in Google Search.

#### M13 — Twitter Handle Never Provided

`SEO.tsx` accepts `twitterSite` and `twitterCreator` props:

```tsx
{
  twitterSite && <meta name="twitter:site" content={twitterSite} />;
}
```

No route passes these props. The rendered Twitter Card has no `@handle` attribution. This affects how cards appear and how the account gets credited when the page is shared.

#### M14 — Sitemap Missing `<lastmod>` and `<changefreq>`

`public/sitemap.xml` contains only `<loc>` and `<priority>`. The absence of `<lastmod>` means search engines cannot schedule recrawls based on content age.

#### Client-Side-Only Meta Tags

The `SEO` component renders all meta tags in React. Social media crawlers (LinkedIn, Twitter, Slack, WhatsApp, iMessage) **do not execute JavaScript** — they read only the static HTML served by the server. The static `index.html` contains:

```html
<title>Orvion — Product Engineers</title>
<meta name="description" content="..." />
<meta property="og:image" content="https://orviontech/og-image.png" />
```

These are the homepage values only. When these crawlers fetch `/work/neurodashboard`, they receive the same static `index.html` with homepage meta — not the case study's title and description.

**Google's crawler** generally executes JavaScript and sees the correct per-page meta. LinkedIn, Twitter, Slack, and WhatsApp do not. This is a fundamental SPA limitation.

---

## 11. Mobile Readiness Assessment

**Score: 78 / 100**

### What Is Correctly Implemented

| Feature                | Implementation                                       | Evidence                       |
| ---------------------- | ---------------------------------------------------- | ------------------------------ |
| Viewport height units  | `100svh` used (not `100vh`)                          | Multiple component files       |
| Address bar resize     | `ScrollTrigger.config({ ignoreMobileResize: true })` | `LenisProvider.tsx`            |
| Touch scroll axis      | `touch-pan-y` class on horizontal scroll track       | `useStickyHorizontalScroll.ts` |
| Custom cursor disabled | `window.innerWidth < 768` check                      | `CustomCursor.tsx`             |
| DottedSurface disabled | `isDesktop` state check                              | `DottedSurface.tsx`            |
| Touch smooth scroll    | `smoothTouch: false` for reduced-motion users        | `LenisProvider.tsx`            |

### Issues

#### M02 — Videos Have No `poster` Attribute (Severity: Medium)

All three `<video>` elements in `LazyVideo` and direct usage render without a `poster` attribute. On mobile connections where the video data takes time to buffer, users see a blank/black rectangle until the first frame loads. A `poster` image (which can be a screenshot from the video) would show a relevant preview immediately.

#### M01 — Videos Have No WebM Alternatives (Severity: Medium)

All videos are MP4/H.264. Chrome, Edge, Firefox, and Android natively support VP9 WebM, which compresses ~30–40% smaller than H.264 for equivalent quality. Adding WebM alternatives via `<source>`:

```html
<video>
  <source src="/videos/feature-2.webm" type="video/webm" />
  <source src="/videos/feature-2.mp4" type="video/mp4" />
</video>
```

Would reduce the 11.4 MB video payload by 3–4 MB for most visitors.

#### M06 — Booking Calendar `aria-disabled` Link on Touch (Severity: Medium)

On touch devices, `pointer-events-none` blocks taps. However, if the element is focused via the virtual keyboard or accessibility swipe navigation, a tap can activate the `<a>` tag and navigate to `mailto:undefined` or a broken Gmail URL.

#### M04 — Mobile Menu Has No Entrance Animation (Severity: Low)

The mobile navigation opens with a bare `{open && <nav>}` React conditional — no CSS transition or GSAP animation. This is jarring relative to the premium animation feel of the rest of the site. The issue is UX, not functional.

---

## 12. Dependency Health Assessment

**Score: 68 / 100**

### Production Dependencies (installed, never imported in `src/`)

| Package       | Version   | Evidence of Unused Status               | Bundle Impact                |
| ------------- | --------- | --------------------------------------- | ---------------------------- |
| `next-themes` | `^0.4.6`  | `grep -r "next-themes" src/`: 0 results | Unknown — may be tree-shaken |
| `zod`         | `^3.24.2` | `grep -r "from 'zod'" src/`: 0 results  | ~13 KB if not tree-shaken    |

**`next-themes` root cause:** A custom `ThemeToggle.tsx` was built that manually manipulates `document.documentElement.classList` and dispatches a `themechange` event. `next-themes` was the original plan but abandoned in favor of the manual implementation. Both coexist in `package.json`.

**`zod` root cause:** Added preemptively for contact form validation. The contact form never used server-side validation (it's a mailto link opener). Zod was never imported.

### DevDependencies Without Corresponding Work

| Package      | Version   | Evidence                                                    | Status                                     |
| ------------ | --------- | ----------------------------------------------------------- | ------------------------------------------ |
| `playwright` | `^1.61.1` | `find src/ -name "*.test.*" -o -name "*.spec.*"`: 0 results | Infrastructure set up, tests never written |
| `exceljs`    | `^4.4.0`  | Used in `reports/*.mjs` only                                | Devtool for pricing scripts, not app       |

### npm Audit Output

```
npm audit report

uuid  <11.1.1
Severity: moderate
uuid: Missing bounds checking in v3, v5 and v6 of uuid library
Fix Available: npm audit fix
Dependency: exceljs > uuid

3 vulnerabilities (1 low, 2 moderate)
```

**Risk to production:** None. `exceljs` and its dependency chain are not included in any webpack/Vite build.

### Version Currency

| Package                  | Installed  | Latest | Status  |
| ------------------------ | ---------- | ------ | ------- |
| `react`                  | `^19.0.0`  | 19.x   | Current |
| `@tanstack/react-router` | `^1.168.0` | 1.x    | Current |
| `vite`                   | `^7.0.0`   | 7.x    | Current |
| `gsap`                   | `^3.15.0`  | 3.x    | Current |
| `framer-motion`          | `^12.38.0` | 12.x   | Current |
| `lenis`                  | `^1.3.3`   | 1.x    | Current |
| `tailwindcss`            | `^4.1.8`   | 4.x    | Current |

All major dependencies are on current major versions. No outdated major version risks.

---

## 13. Code Quality Assessment

**Score: 78 / 100**

### TypeScript

**Result: 0 errors** (`npx tsc --noEmit`)

`tsconfig.json` configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "skipLibCheck": true
  }
}
```

`strict: true` enforces: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict`. The type safety baseline is solid.

`noUnusedLocals: false` and `noUnusedParameters: false` mean that unused variables and function parameters do not produce TypeScript errors — dead code is invisible to the compiler.

### ESLint

**Result: 547 errors, 11 warnings**

```bash
$ npx eslint src/ --no-fix 2>&1 | grep -v "prettier/prettier" | head -60
```

After filtering Prettier violations:

| Category                               | Count | Files                                                   |
| -------------------------------------- | ----: | ------------------------------------------------------- |
| `prettier/prettier` violations         |   547 | All source files                                        |
| `react-hooks/exhaustive-deps`          |     7 | CinematicHero, LenisProvider, PageTransition, about.tsx |
| `react-refresh/only-export-components` |     4 | Multiple route files                                    |

**All 547 errors are Prettier formatting violations** — whitespace, quote style, trailing commas, bracket spacing. They are all auto-fixable via `npx prettier --write src/`. None indicate logic bugs.

**Real issues in the 11 genuine warnings:**

| Warning                                              | File                | Line | Risk                                                                                                              |
| ---------------------------------------------------- | ------------------- | ---- | ----------------------------------------------------------------------------------------------------------------- |
| `react-hooks/exhaustive-deps`: `canvasRef` missing   | `CinematicHero.tsx` | 325  | Low — canvasRef is a stable ref                                                                                   |
| `react-hooks/exhaustive-deps`: `lenis` missing       | `LenisProvider.tsx` | ~95  | Low — lenis is a stable value                                                                                     |
| `react-hooks/exhaustive-deps`: `codeSnippet` missing | `about.tsx`         | 54   | Medium — `codeSnippet` is defined in function body, new array each render; interval never updates if prop changes |
| `react-hooks/exhaustive-deps`: `logPool` missing     | `about.tsx`         | 96   | Medium — same pattern                                                                                             |
| `react-refresh/only-export-components`               | Multiple            | —    | Dev-only: HMR may behave unexpectedly in development                                                              |

### `any` Usage (3 instances)

All are documented with ESLint disable comments, not accidental:

**`MagneticButton.tsx`:**

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MagneticButtonProps {
  [key: string]: any;
}
```

Root cause: The component passes arbitrary props to its children, requiring a generic prop signature. A more type-safe approach would use `React.ComponentPropsWithRef<"button">` but the current approach is intentional and commented.

**`RevealText.tsx`:**

```tsx
(ref as any).current; // eslint-disable-next-line @typescript-eslint/no-explicit-any
```

Root cause: Merging forwarded ref with internal ref requires a type assertion because TypeScript cannot narrow the ref type in this context.

---

## 14. Runtime Stability Assessment

**Score: 80 / 100**

### Error Handling Coverage

| Scenario                                 | Handling                                                     | Location                       |
| ---------------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| Route not found                          | `notFoundComponent` → custom 404 page                        | `__root.tsx`, `work.$slug.tsx` |
| Route error (thrown in loader/component) | `defaultErrorComponent` with Try Again + Go Home             | `__root.tsx`                   |
| Pending route load (>150ms)              | `PageSkeleton` spinner                                       | `__root.tsx`                   |
| Canvas API unavailable                   | No explicit check — `getContext('2d')` returns null silently | `CinematicHero.tsx`            |
| Video load failure                       | No error state — `<video>` element handles natively          | `LazyVideo.tsx`                |
| Contact compose open failure             | `try/catch` → clipboard fallback → user instruction          | `contact.tsx`                  |

### Contact Form False-Positive Success State (Risk: Medium)

**`src/routes/contact.tsx` — `handleSubmit` function:**

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    openCompose({ ... });   // opens Gmail/mailto window
    setSent(true);          // ← fires regardless of whether compose succeeded
  } catch (err) {
    // fallback handled
  }
};
```

`openCompose()` calls `window.open()` internally. If the browser blocks the popup (Safari with strict popup blocking, incognito mode, popup blocker extensions), `window.open()` returns `null` and throws no error — it silently fails. `setSent(true)` fires, the success panel shows "Your message is ready", and **no email was composed**.

The clipboard copy fallback is a good mitigation but the user may not understand why they're being asked to copy text after "success" was shown.

### `PageTransition` Animation Cleanup Gap (Risk: Low-Medium)

**`src/components/layout/PageTransition.tsx`:**

```tsx
useEffect(() => {
  if (animating) {
    const tl = gsap.timeline({
      onComplete: () => {
        const tlOut = gsap.timeline();   // no cleanup reference
        tlOut.from(overlayRef.current, { ... });
        setDisplayChildren(nextChildren);
        setAnimating(false);
      }
    });
    tl.to(overlayRef.current, { ... });
    return () => { tl.kill(); };        // tl is cleaned up; tlOut is not
  }
}, [animating, nextChildren]);
```

If the component unmounts between `tl.onComplete` firing and `tlOut` finishing (e.g., unmounting during rapid navigation), `tlOut` continues mutating the unmounted `overlayRef.current`. GSAP does not error, but it can produce memory pressure and unexpected style mutations.

### Preloader Not Tied to Actual Load Progress (Risk: Low)

**`src/components/layout/Preloader.tsx`:**

```tsx
useEffect(() => {
  const timer = setTimeout(() => setProgress(100), 2000);
  return () => clearTimeout(timer);
}, []);
```

The preloader runs a fixed 2-second countdown. It is not connected to `window.onload`, `document.readyState`, or any resource tracking. On a slow mobile connection where actual resources (fonts, videos, JS chunks) take >2 seconds to fully load, the preloader completes to 100% and hides while content is still loading. This is cosmetic but misleading.

---

## 15. AI-Generated Repository Risk Assessment

**Risk Level: Medium**
**Confidence: High**

This section identifies patterns characteristic of AI-assisted development that introduce compounding technical debt and maintenance risk.

### Indicators Found

#### Layered Font-Loading Strategies

The clearest indicator of layered AI sessions:

- `index.html` adds preconnect + stylesheet links for Cabinet Grotesk (Fontshare), Bodoni Moda (Google Fonts), JetBrains Mono (Google Fonts)
- `styles.css` adds `@import` for Cabinet Grotesk (Fontshare) and Bodoni Moda (Google Fonts)

Each session added its own font-loading strategy without removing the previous one. The result is 2× font CDN requests per page.

#### Placeholder Content Shipped as Real

`src/data/testimonials.ts` line 1:

```ts
// Placeholder content — swap these for real client quotes as they come in.
```

Content was scaffolded by one AI session and marked as temporary. A subsequent session or human review did not replace it before launch preparation.

Similarly, `CinematicHero.tsx` contains:

```tsx
{ label: "Docs Indexed", value: "12,543", live: true }
{ label: "Queries / Day", value: "1,247", live: true }
{ label: "Uptime", value: "99.6%", live: true }
```

These are hardcoded strings with `live: true` — they present static data as live metrics.

#### Brand Voice Inconsistency

Multiple pages use inconsistent first-person voice, characteristic of different AI sessions using different system prompts:

| Page          | Voice | Quote                                                                                 |
| ------------- | ----- | ------------------------------------------------------------------------------------- |
| Homepage hero | Mixed | "Hi, we're Saral x Jatin" + "I build software that solves real problems"              |
| About         | We    | "We've spent the last 4 years building at the intersection..."                        |
| Contact       | Mixed | "Tell me about the project" + "We reply within 48 hours" + "I reply to every message" |
| Footer        | I     | "Product engineer. I design, build, and ship complete systems"                        |

#### 11 GSAP Plugin Registrations

Each component and route file independently calls `gsap.registerPlugin(ScrollTrigger)`. This is the signature behavior of AI-generated components that each include the registration defensively, without awareness of what other components have already done.

#### Speculative Dead Code Accumulation

4 top-level dead components + 8 dead UI components = 12 files that were generated, possibly tested in isolation, but never integrated into the actual application. Speculative generation without pruning is a consistent pattern in AI-assisted development.

#### Framework Directive Artifact

`"use client"` at the top of `booking-calendar.tsx` — a Next.js App Router directive meaningless in a Vite project — indicates the component was generated in a Next.js context and transplanted without the directive being removed.

---

## 16. Complete Issue Inventory

### CRITICAL — Launch Blockers (must fix before going live)

| ID      | Issue                                  | File(s)                                   | Evidence                                                                | Business Impact                                                                 |
| ------- | -------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **C01** | `og-image.png` does not exist          | `SEO.tsx:32`, `index.html:28`             | `ls public/og-image.png` → No such file                                 | Every social share shows blank card; first impression failure                   |
| **C02** | Placeholder testimonials in production | `src/data/testimonials.ts:1`              | File comment: "Placeholder content — swap these for real client quotes" | Credibility risk if discovered; fake social proof is a trust violation          |
| **C03** | Static fake live metrics in hero       | `CinematicHero.tsx` ProductPreview        | Hardcoded `"12,543"`, `"1,247"`, `"99.6%"` with `live: true` flag       | Technical visitors who inspect source discover manufactured credibility signals |
| **C04** | Multiple `<h1>` per page               | `about.tsx`, `process.tsx`, `contact.tsx` | Two `<RevealText as="h1">` calls per page                               | WCAG 1.3.1 failure; fails automated accessibility audits                        |

### HIGH — Should Fix Before Launch

| ID      | Issue                                     | File(s)                             | Evidence                                                     | Impact                                                                 |
| ------- | ----------------------------------------- | ----------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **H01** | Resume is a 6.7 KB stub                   | `public/Jatin_Basantani_Resume.pdf` | `ls -lh public/*.pdf` → 6.7K                                 | Publicly downloadable; visitors receive an empty outline               |
| **H02** | Duplicate font loading                    | `index.html`, `src/styles.css`      | Both load Cabinet Grotesk + Bodoni Moda                      | 2× CDN requests; potential FOUT/CLS                                    |
| **H03** | No `og:url` meta tag                      | `SEO.tsx`                           | No `og:url` output in component                              | Social share deduplication and canonical attribution may fail          |
| **H04** | No `poster` on video elements             | `LazyVideo.tsx`                     | `grep -r "poster" src/` → 0 hits on video elements           | Blank/black frame on mobile before video buffers                       |
| **H05** | Duplicate JSON-LD on homepage             | `index.html`, `routes/index.tsx`    | Two `<script type="application/ld+json">` blocks             | Crawler may see conflicting entity definitions for same page           |
| **H06** | `aria-disabled` link not keyboard-blocked | `booking-calendar.tsx:127`          | `<a aria-disabled={!selected}>` without `disabled` attribute | Keyboard users can activate broken/undefined booking URL               |
| **H07** | Mobile menu has no focus trap             | `SiteHeader.tsx`                    | No `focus()` call on menu open                               | Keyboard users cannot navigate menu without Tab-cycling through header |
| **H08** | 547 Prettier lint errors                  | All source files                    | `npm run lint` output                                        | CI/CD failures if linting enforced on deploy pipeline                  |

### MEDIUM — Important but Not Blocking

| ID      | Issue                                        | File(s)                                 | Evidence                                                      | Impact                                                              |
| ------- | -------------------------------------------- | --------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **M01** | Videos have no WebM alternatives             | `public/videos/`                        | No `.webm` files in directory                                 | ~30–40% larger than necessary on Chrome/Edge/Firefox                |
| **M02** | 4 dead top-level components                  | `src/components/`                       | 0 import results for each                                     | Maintenance confusion; future contributors will assume they're used |
| **M03** | 8 dead UI components                         | `src/components/ui/`                    | 0 import results for each                                     | Dead code misleads contributors                                     |
| **M04** | `next-themes` unused in production           | `package.json`                          | `grep -r "next-themes" src/`: 0 results                       | May add to bundle if not fully tree-shaken                          |
| **M05** | `zod` unused in production                   | `package.json`                          | `grep -r "from 'zod'" src/`: 0 results                        | ~13 KB potential dead bundle weight                                 |
| **M06** | Brand voice inconsistency (I vs We)          | `index.tsx`, `about.tsx`, `contact.tsx` | Mixed first-person voice across pages                         | Professionalism concern; client may notice the inconsistency        |
| **M07** | `"use client"` in Vite project               | `booking-calendar.tsx:1`                | Next.js directive, no Vite equivalent                         | Confuses readers; dead code                                         |
| **M08** | No per-project structured data               | `work.$slug.tsx`                        | No `schema` prop passed to SEO                                | SEO opportunity missed for case studies                             |
| **M09** | No Content-Security-Policy header            | `vercel.json`                           | No `Content-Security-Policy` in headers array                 | Low current risk; becomes high risk if dynamic content added        |
| **M10** | Stale closure in `about.tsx` effects         | `about.tsx:54,96`                       | `codeSnippet` + `logPool` missing from deps                   | Interval never updates on re-render (benign but incorrect)          |
| **M11** | BookingCalendar hardcodes Gmail              | `booking-calendar.tsx:127`              | `https://mail.google.com/mail/?view=cm&fs=1&to=...` hardcoded | Inconsistent with `mail.ts`'s provider detection pattern            |
| **M12** | PDFs committed to `reports/`                 | `reports/*.pdf`                         | 2 PDFs in `reports/` directory                                | Repo bloat; stale files committed                                   |
| **M13** | Twitter handle never set                     | All routes via `SEO.tsx`                | `twitterSite` prop never passed                               | Incomplete Twitter Cards                                            |
| **M14** | Sitemap missing `<lastmod>`                  | `public/sitemap.xml`                    | Only `<loc>` and `<priority>` in each entry                   | Search engine recrawl scheduling suboptimal                         |
| **M15** | Framer Motion fully loaded for minimal usage | `package.json`, multiple routes         | 142 KB / 47 KB gzipped for AnimatePresence + motion.div       | ~47 KB gzipped savings available via GSAP migration                 |

### LOW — Polish / Nice-to-Have

| ID      | Issue                                   | File(s)                                  | Impact                                            |
| ------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| **L01** | 11 redundant GSAP plugin registrations  | 11 files                                 | Marginal parse overhead per chunk                 |
| **L02** | Mobile menu has no animation            | `SiteHeader.tsx`                         | Inconsistent with premium site feel               |
| **L03** | Preloader not tracking real load        | `Preloader.tsx`                          | Misleading on slow connections                    |
| **L04** | Cursor context labels not accessible    | All pages with `data-cursor-text`        | Screen reader users miss contextual labels        |
| **L05** | Sitemap missing `<changefreq>`          | `public/sitemap.xml`                     | Minor SEO completeness gap                        |
| **L06** | `PageTransition` `tlOut` has no cleanup | `PageTransition.tsx`                     | Memory leak pattern on rapid navigation           |
| **L07** | Canvas API null-check absent            | `CinematicHero.tsx`, `DottedSurface.tsx` | Silent failure on environments without canvas API |

---

## 17. Hidden Risks

### HR01 — Contact Form Silent Failure on Popup Block

The `handleSubmit` function in `contact.tsx` calls `openCompose()` then immediately calls `setSent(true)`. `openCompose()` wraps `window.open()`. Modern browsers (Safari, Chrome incognito, Firefox with strict settings) silently return `null` from `window.open()` without throwing an exception. The success state fires regardless.

**User experience on popup-blocked submit:** The success panel shows "Your message is ready. Check your compose window." — but no compose window opened. The clipboard fallback text appears, but the user may not understand why they're seeing it after "success."

**Risk: Silent message loss.** A prospective client submits the contact form and believes they've sent a message, when in reality nothing was sent.

### HR02 — `CinematicHero` Canvas Captures Stale Ref on Theme Change

The `themechange` event listener is registered inside the `useEffect` closure:

```tsx
useEffect(() => {
  const canvas = canvasRef.current; // captured at effect run time

  const handleThemeChange = () => {
    initParticles(); // uses captured `canvas`, not current ref
  };

  document.addEventListener("themechange", handleThemeChange);
  return () => document.removeEventListener("themechange", handleThemeChange);
}, []); // canvasRef excluded from deps (lint warning)
```

If `canvasRef.current` changes after the effect runs (unlikely, but possible on HMR or concurrent mode re-renders), `handleThemeChange` will call `initParticles()` with a stale reference and attempt to draw on a detached canvas.

### HR03 — Static Metrics Will Damage Credibility with Technical Visitors

The `ProductPreview` widget in `CinematicHero` renders:

```tsx
const LIVE_METRICS = [
  { label: "Docs Indexed", value: "12,543", trend: "+127 today", live: true },
  { label: "Queries / Day", value: "1,247", trend: "+8.3% week", live: true },
  { label: "Uptime", value: "99.6%", trend: "30-day avg", live: true },
];
```

The `live: true` flag renders a pulsing green dot suggesting real-time data. A developer viewing source or using DevTools will immediately see hardcoded strings. The studio positions itself as "we only ship what's real" — this directly contradicts that positioning.

### HR04 — Reports PDFs Committed to Git History

`reports/Orvion-Pricing-Intelligence-Report-1.pdf` and `reports/Orvion-Pricing-Matrix-v2.pdf` are committed to the repository. Even if they are later removed from HEAD, they remain in git history and are accessible via `git checkout <old-commit> reports/`. If these pricing documents contain strategic information, their permanent presence in git history is a disclosure risk.

### HR05 — `useStickyHorizontalScroll` Silently Ignores New Callbacks

The hook excludes `onSetup` and `onUpdate` from its effect dependencies with an explicit `eslint-disable` comment. If a consumer passes new callback functions on re-render (e.g., due to a state change in the parent), the scroll hook continues using the original callbacks. There is no error or warning. This is likely correct for the current usage (callbacks are defined as stable constants), but it is a hidden gotcha for any future contributor who moves a callback definition.

---

## 18. Technical Debt Hotspots

### Hotspot 1: `src/components/ui/` — Dead Design System

8 of the components in this directory are unused. Future contributors will import from here assuming they are part of the active design system. The dead files create a false impression of available components and will accumulate further dead additions.

**Files to remove:** `animated-badge.tsx`, `badge.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `neon-button.tsx`, `textarea.tsx`, `tooltip.tsx`

### Hotspot 2: Animation Layer Complexity

Five concurrent animation systems on the homepage:

1. GSAP (ScrollTrigger, timelines)
2. Framer Motion (AnimatePresence, motion.div)
3. Lenis (smooth scroll)
4. Three independent `requestAnimationFrame` loops (particle canvases)
5. CSS transitions

Consolidating to GSAP + Lenis would reduce bundle size by ~47 KB gzipped and simplify the mental model significantly.

### Hotspot 3: `package.json` Dependency Hygiene

4 packages that do nothing for the production site (`next-themes`, `zod`, `exceljs`, `playwright`) add noise to `package.json` and slow `npm install` in CI. The presence of `playwright` with zero tests is particularly misleading — it implies test infrastructure that does not exist.

### Hotspot 4: `index.html` vs `styles.css` Duplication

The font-loading configuration exists in two places using two different mechanisms. Any future font change requires updating both files independently. This is a consistency-maintenance burden.

### Hotspot 5: `reports/` Directory

A mix of one-off pricing scripts, Excel outputs, HTML previews, and PDF reports — all committed to the main repository. This directory serves no purpose in the production codebase and should be moved to a separate repository or fully .gitignored.

---

## 19. Architectural Weaknesses

### AW01 — SPA with Client-Side-Only Meta: Social Crawlers Receive Wrong Meta

Social preview crawlers (LinkedIn, Twitter/X, WhatsApp, iMessage, Slack) do not execute JavaScript. They receive the static `index.html` which contains:

```html
<title>Orvion — Product Engineers</title>
<meta name="description" content="We build software that solves real problems." />
<meta property="og:image" content="https://orviontech/og-image.png" />
```

These are the **homepage values only**, regardless of which route the shared URL points to.

When `/work/neurodashboard` is shared on LinkedIn, the LinkedIn scraper receives the homepage title and description. The case study's unique meta is never seen.

This is a fundamental SPA limitation. Mitigations range from server-side rendering (SSR) — a significant architectural change — to a static prerender step at build time using tools like `vite-plugin-ssr` or `@vitejs/plugin-prerender`. The current implementation prioritizes the interactive experience over social sharing fidelity.

### AW02 — No Global State or Server Communication Layer

The site has no mechanism for:

- Dynamic content updates
- Analytics collection (beyond what Vercel provides)
- A/B testing
- Feature flags
- Backend API calls

This is appropriate for a static portfolio today. However, the `pricingRoute.tsx` includes a detailed pricing table and "Book a call" flow. If these ever need personalization (tracking which plan a visitor viewed, prefilling booking with context), there is no state management layer to add onto.

### AW03 — Particle Canvases Are CPU-Bound

`CinematicHero.tsx` samples `canvas.getImageData()` to detect particle positions — a CPU-intensive operation that runs every animation frame. Combined with the 3 other canvas loops and GSAP ticker on the homepage, the main thread is under significant load on the most-viewed page. On devices with throttled CPUs (mid-range Android, throttled MacBooks), this could produce visible scroll jank.

No `OffscreenCanvas` or Web Worker is used for these canvases — all rendering happens on the main thread.

### AW04 — No Automated Test Coverage

`playwright` is installed as a devDependency but zero test files exist. There are no:

- End-to-end tests (navigation, contact form, routing)
- Component tests
- Accessibility automated checks (axe-core integration)
- Visual regression tests

The only quality gate is `tsc --noEmit` (0 errors) and `eslint` (547 Prettier-only errors). Any regression in animation, routing, or accessibility is invisible until a human reviews the live site.

---

## 20. Prioritized Implementation Roadmap

### Phase 1-A: Pre-Launch Fixes (1–2 days, blocks launch)

| Priority | Task                                                                                           | ID  | Effort             |
| -------- | ---------------------------------------------------------------------------------------------- | --- | ------------------ |
| 1        | Create `og-image.png` (1200×630px) and add to `public/`                                        | C01 | 2–4 hrs            |
| 2        | Replace placeholder testimonials with real quotes or remove section                            | C02 | 1–2 hrs            |
| 3        | Remove or relabel fake hero dashboard metrics                                                  | C03 | 30 min             |
| 4        | Fix `<h1>` structure: change second `RevealText as="h1"` to `as="h2"` on about/process/contact | C04 | 30 min             |
| 5        | Replace or complete Jatin's resume PDF                                                         | H01 | Depends on content |
| 6        | Run `npx prettier --write src/` to clear all 547 lint errors                                   | H08 | 5 min              |

### Phase 1-B: High Priority (2–3 days, should fix before launch)

| Priority | Task                                                                                          | ID       | Effort                        |
| -------- | --------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| 7        | Fix `aria-disabled` in `booking-calendar.tsx`: use `<button disabled>` or conditional `href`  | H06      | 30 min                        |
| 8        | Add focus trap to mobile menu + close-on-Escape                                               | H07      | 2–3 hrs                       |
| 9        | Remove duplicate font loading: keep `index.html` `<link>`, remove `@import` from `styles.css` | H02      | 15 min                        |
| 10       | Add `og:url` to `SEO.tsx`                                                                     | H03      | 30 min                        |
| 11       | Add `poster` attribute to all `<video>` elements                                              | H04      | 1 hr (requires poster images) |
| 12       | Remove Organization JSON-LD from `index.html`, consolidate to `SEO` component                 | H05      | 30 min                        |
| 13       | Delete 12 dead component files (4 + 8)                                                        | M02, M03 | 30 min                        |

### Phase 1-C: Medium Priority (3–5 days)

| Priority | Task                                                              | ID       | Effort             |
| -------- | ----------------------------------------------------------------- | -------- | ------------------ |
| 14       | Remove `next-themes` and `zod` from `package.json`                | M04, M05 | 15 min             |
| 15       | Standardize brand voice (I vs We) across all pages                | M06      | 2–3 hrs            |
| 16       | Remove `"use client"` from `booking-calendar.tsx`                 | M07      | 5 min              |
| 17       | Add Twitter `@handle` to SEO calls on all routes                  | M13      | 30 min             |
| 18       | Encode MP4 videos as WebM and add `<source type="video/webm">`    | M01      | 4–6 hrs (encoding) |
| 19       | Fix mobile menu entrance animation                                | L02      | 2–3 hrs            |
| 20       | Move `reports/` contents out of repository or add to `.gitignore` | M12      | 30 min             |
| 21       | Add `sitemap.xml` `<lastmod>` dates                               | M14      | 30 min             |
| 22       | Add per-project JSON-LD to case study pages                       | M08      | 2–3 hrs            |
| 23       | Add Content-Security-Policy header to `vercel.json`               | M09      | 1 hr               |

### Phase 2: Optimization (ongoing)

| Priority | Task                                                                            | ID   | Effort   |
| -------- | ------------------------------------------------------------------------------- | ---- | -------- |
| 24       | Evaluate replacing Framer Motion with GSAP equivalents (~47 KB gzipped savings) | M15  | 1–2 days |
| 25       | Consolidate GSAP plugin registration to `LenisProvider` only                    | L01  | 2 hrs    |
| 26       | Fix `PageTransition` `tlOut` cleanup gap                                        | L06  | 1 hr     |
| 27       | Add canvas API null-check in CinematicHero / DottedSurface                      | L07  | 30 min   |
| 28       | Fix contact form false-positive success on popup block                          | HR01 | 2 hrs    |
| 29       | Write first end-to-end tests with Playwright                                    | AW04 | 1–2 days |
| 30       | Add `axe-core` accessibility smoke tests                                        | AW04 | 4 hrs    |

---

## 21. Final Production Readiness Verdict

> **VERDICT: NOT READY FOR LAUNCH**
> **Confidence: High**

### Rationale

The engineering quality of this codebase is genuinely strong. The routing architecture is correct, the animation systems are well-integrated, TypeScript is clean, and the Vercel deployment configuration is solid. A developer reading this code would respect the thoughtfulness of the implementation decisions.

Despite this, the site cannot launch because:

1. **Every social share is broken** (C01 — missing `og-image.png`). For a design portfolio competing for client attention, this is the highest-impact failure mode. The moment someone shares the URL on LinkedIn or Twitter, the broken card is the first impression.

2. **The credibility foundation is fabricated** (C02, C03). Placeholder testimonials labeled as real client quotes and manufactured "live" uptime metrics undermine the studio's central positioning ("we only ship what's real"). Technical visitors who inspect source code will find the evidence immediately.

3. **The accessibility baseline fails** (C04). Multiple `<h1>` elements per page is a WCAG 1.3.1 failure that will show up in any automated audit report a client might run.

4. **The resume is a stub** (H01). A publicly linked PDF that is 6.7 KB sends precisely the wrong signal about the studio's attention to detail.

### Path to Launch

None of the launch blockers require architectural changes. All four can be fixed in one focused day:

- Create the OG image (design work, 2–4 hours)
- Replace testimonials (content work, dependent on having real client quotes)
- Remove or relabel the fake metrics (15 minutes of code)
- Fix the `h1` hierarchy (30 minutes of code)

Once those are resolved and Prettier is run, the site is **ready for production deployment**.

**Estimated time from now to launch-ready: 1–2 working days** (limited by content availability, not engineering).

---

_End of Phase 1 Production Readiness Report_

_Audit scope: 65 source files examined · Full build artifact analysis (dist/assets/) · ESLint diagnostics · TypeScript compile (0 errors) · npm audit · Manual SEO/accessibility inspection · Bundle size measurement via gzip · Prior audit comparison (docs/AUDIT-REPORT.md, dated 2026-06-26)_

_No code was modified during this investigation._
