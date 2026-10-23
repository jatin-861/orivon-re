# Forensic Performance Investigation — Production Launch Audit

**Date:** 2026-07-07
**Method:** Production build (`vite build`), source-map bundle analysis, Lighthouse (mobile, simulated throttling), Playwright runtime probes across all 8 routes (console/network/long-task/memory/overflow), controlled falsification experiments for rendering cost.
**Scope:** Investigation only. No changes made.

---

## 1. Executive Summary

The site is functionally clean — zero console errors, zero failed requests, no memory growth, small DOM, no horizontal overflow on any route. But it is **not production-ready** for two reasons that have nothing to do with visual quality:

1. **The production CSP in `vercel.json` blocks every font stylesheet.** All three font CSS requests (Google Fonts ×2, Fontshare) violate `style-src 'self' 'unsafe-inline'`. In production, **no brand font loads at all** — the entire typographic identity silently falls back to system fonts. Local preview doesn't apply these headers, which is why it was never seen.
2. **First paint is ~4.3s and first useful content ~7s on mobile** (Lighthouse: Perf 56/100, FCP 4.3s, LCP 5.1s, Speed Index 7.1s). This is the compound of four root causes: a serialized render-blocking font chain (~2.0s), a fully client-rendered app that paints nothing until 645KB of JS executes, framer-motion + gsap forced onto the critical path by root-layout components, and a hard-coded 2.6-second fake preloader on top of all of it.

Separately, a controlled experiment proved the **giant blurred background blobs are the dominant scroll-rendering cost** (4.3× frame-time difference), and **12MB of videos ship to production dead** — nothing references them.

---

## 2. Production Readiness Assessment

| Area                      | Verdict       | Evidence                                                       |
| ------------------------- | ------------- | -------------------------------------------------------------- |
| Build integrity           | ✅ Clean      | Builds in 3.7s, 2277 modules, route-level code splitting works |
| Console / runtime errors  | ✅ Clean      | 0 errors across all 8 routes (Playwright)                      |
| Memory                    | ✅ Clean      | Flat 10MB heap on every route                                  |
| Responsiveness (layout)   | ✅ Clean      | No horizontal overflow at 390px on any route                   |
| Fonts in production       | ❌ **BROKEN** | CSP blocks all 3 font stylesheets                              |
| Load performance (mobile) | ❌ Poor       | Perf 56, FCP 4.3s, LCP 5.1s, SI 7.1s, TBT 420ms                |
| Scroll rendering          | ⚠️ At risk    | Blur-blob background dominates frame cost                      |
| Accessibility             | ⚠️ Minor      | 0.96; brand-pink text fails contrast (4.44:1)                  |

---

## 3. Root Cause Matrix

### RC-1 — CSP blocks all font stylesheets in production 🚫 LAUNCH BLOCKER

- **Root cause:** `vercel.json` CSP `style-src 'self' 'unsafe-inline'` omits `https://fonts.googleapis.com` and `https://api.fontshare.com`. The `font-src https://fonts.gstatic.com` entry is dead — the CSS that would reference those fonts can never load.
- **Evidence:** `vercel.json` headers vs. font URLs in `index.html:33-38` and `src/styles.css:1-2`.
- **Confidence:** High. **Effort:** Trivial (one line).
- **User impact:** Entire site renders in system fallback fonts. Serif display (Bodoni Moda), sans (Cabinet Grotesk), and mono (JetBrains Mono) all missing.
- **Files:** `vercel.json`, `index.html`, `src/styles.css`.

### RC-2 — Serialized render-blocking font chain (~2.0s of blocking)

- **Root cause:** Fonts load through _three_ render-blocking stylesheets on two paths:
  1. `index.html` `<link>` to Google Fonts requesting **Cabinet Grotesk — which Google Fonts does not carry and silently drops** (verified: returned CSS contains only Bodoni Moda + JetBrains Mono). The request is pure waste.
  2. `src/styles.css` top-of-file `@import`s (Fontshare Cabinet Grotesk + a _second, different_ Bodoni Moda config). CSS `@import`s can't start until the main bundle CSS downloads → serialized chain. Fontshare has no `preconnect`, adding DNS+TLS to the chain.
- **Evidence:** Lighthouse `render-blocking-insight`: fontshare 1,316ms wasted, googleapis 974ms + 180ms; total est. savings 1,990ms. Bodoni Moda requested twice with conflicting weight ranges (400..900 both italics vs 400–700 + italic 400) → duplicate font binaries.
- **Confidence:** High. **Effort:** Low (self-host or single preloaded stylesheet).
- **Impact:** Directly on FCP/LCP for every visitor, worst on mobile RTT.
- **Files:** `index.html:33-38`, `src/styles.css:1-2`.

### RC-3 — Hard-coded 2.6s artificial preloader

- **Root cause:** `Preloader.tsx` runs a fixed 2000ms fake progress interval + 600ms exit delay on every first visit per tab session, covering the page (z-index 99999) and locking body scroll. It measures nothing — content is typically ready long before it finishes.
- **Evidence:** `src/components/layout/Preloader.tsx` (`duration = 2000`, `setTimeout(..., 600)`). Speed Index 7.1s vs LCP 5.1s delta; Playwright first-visit settle times 4.1–6.8s per route.
- **Confidence:** High. **Effort:** Low (tie to actual readiness, or cap at a few hundred ms).
- **Impact:** +2.6s to first interaction for every new visitor — the single largest self-inflicted delay.
- **Files:** `src/components/layout/Preloader.tsx`.

### RC-4 — framer-motion + gsap + lenis on the critical path of a CSR-only app

- **Root cause:** The app is fully client-rendered (empty `<div id="root">`), so nothing paints until JS executes. Root layout (`__root.tsx`) eagerly mounts `Preloader`/`PageTransition` (framer-motion) and `LenisProvider` (gsap + ScrollTrigger + lenis), so Vite `modulepreload`s all of it: **645KB raw / ~207KB gzip before first paint**. Lighthouse: 3.1s main-thread work, 1.3s script bootup, TBT 420ms, 71KB of it unused at load (framer chunk is 52% unused — drag/pan/projection code never exercised).
- **Evidence:** Build output; `dist/index.html` modulepreloads `framer` + `gsap`; source-map-explorer (react-dom 177KB, ScrollTrigger 35KB in _index_ chunk — it escaped the manual `gsap` chunk — tailwind-merge 27KB, lenis 18KB); Lighthouse `unused-javascript`, `bootup-time`.
- **Confidence:** High. **Effort:** Medium (defer animation stack until after first paint; or prerender/SSG the shell).
- **Impact:** LCP element render delay measured at 3,241ms of the 5.1s LCP.
- **Files:** `src/routes/__root.tsx`, `src/components/layout/LenisProvider.tsx`, `src/components/PageTransition.tsx`, `vite.config.ts`.

### RC-5 — Giant blurred background blobs dominate rendering cost

- **Root cause:** `SiteBackground.tsx` renders three fixed 35–45vw circles with `filter: blur(130–150px)`, one retransformed on every pointer move. Large-radius blur over huge layers is a fill-rate killer, and **the blobs are not gated on mobile** (only the DottedSurface canvas is desktop-only).
- **Evidence (falsification experiment, homepage scripted scroll, headless/software raster):** baseline avg frame 157ms → **36.6ms with background hidden (4.3×)** → 50ms with only `filter: none` (blur alone is most of the cost). Hiding the cursor canvas changed nothing (156.9ms) — cursor exonerated. Real GPUs render blur cheaper, so absolute numbers are inflated, but the _ratio_ identifies the dominant cost, and low-end mobile GPUs are exactly where large blurs collapse.
- **Confidence:** High for "dominant paint cost"; Medium for exact real-device magnitude.
- **Effort:** Low (pre-rendered radial-gradient images or drastically smaller blur radii; gate on mobile).
- **Files:** `src/components/SiteBackground.tsx`.

### RC-6 — 12MB of dead video assets ship to production

- **Root cause:** `public/videos/` (feature-2.mp4 5.1MB, feature-3.mp4 4.9MB, hero-2.mp4 1.7MB) is referenced by nothing. `LazyVideo.tsx` and `VideoPreview.tsx` are imported by zero files; no `.mp4` string exists in any built chunk.
- **Evidence:** grep of `src/` and `dist/assets/` — zero references.
- **Confidence:** High. **Effort:** Trivial (delete).
- **Impact:** No runtime cost (never fetched), but 12MB per deploy and a misleading codebase.
- **Files:** `public/videos/*`, `src/components/LazyVideo.tsx`, `src/components/VideoPreview.tsx`.

---

## 4. Ranked Bottlenecks

**P0 — delays first interaction / breaks production**

1. RC-1 CSP font blockade (launch blocker — correctness, not speed)
2. RC-3 2.6s artificial preloader
3. RC-2 font stylesheet chain (~2.0s blocking)

**P1 — page load time** 4. RC-4 645KB eager JS on a CSR-only shell (LCP render delay 3.2s)

**P2 — mobile experience / runtime** 5. RC-5 blur-blob rendering cost (ungated on mobile) 6. `favicon.ico` is 104KB (typical is 5–15KB); requested on every page. 7. No explicit immutable `Cache-Control` for `/assets/*` in `vercel.json` — Vercel defaults to `max-age=0, must-revalidate` on static files, forcing revalidation of content-hashed assets on repeat visits.

**P3 — maintenance / polish** 8. RC-6 dead videos + dead components 9. `ScrollTrigger`/`Observer` (44KB) land in the `index` chunk despite the manual `gsap` chunk (manualChunks only captures the `gsap` entry module, not subpath imports) — the chunking intent isn't achieved. 10. Forced reflows during load (~128ms + ~85ms, Lighthouse `forced-reflow-insight`) traced to index-chunk layout reads (ScrollTrigger refresh + component measurement). Acceptable magnitude; not worth chasing before the above. 11. Contrast failures: brand-pink `#c75b3a` text on card backgrounds at 4.44:1 (needs 4.5:1); one decorative serif element at 1.17:1. 12. 404 page keeps the homepage `<title>`; SPA rewrite serves it with HTTP 200 (soft-404 for crawlers). 13. Mount-time-only `window.innerWidth < 768` gates in `CustomCursor`/`SiteBackground` don't respond to rotation/resize — cosmetic edge case. 14. Intermittent `ERR_BLOCKED_BY_ORB` on the Fontshare CSS observed in one probe run — becomes moot if fonts are self-hosted (recommended anyway given RC-1/RC-2).

---

## 5. Dependency Map

```
RC-1 CSP (vercel.json)
  └─ blocks → fonts.googleapis.com CSS, api.fontshare.com CSS
      └─ affects → every text node site-wide → brand typography absent in prod

RC-2/RC-4 critical path (index.html, styles.css, __root.tsx)
  index.html → main CSS → @import fontshare + @import google (serial)
  index.html → modulepreload index + framer + gsap (645KB) → React boot → first paint
      └─ affects → FCP 4.3s, LCP 5.1s on every route (root layout is shared)

RC-3 Preloader (__root.tsx → Preloader.tsx)
  └─ covers viewport 2.6s, locks scroll → first interaction ≥ ~5s even after paint

RC-5 SiteBackground (__root.tsx → SiteBackground.tsx)
  └─ fixed blur layers repainted under every scroll/pointer-move
      └─ affects → scroll smoothness on ALL routes, worst on mobile GPUs
```

## 6. Dead Code Report (verified unreachable)

- `public/videos/` — 12MB, zero references in source or built output.
- `src/components/LazyVideo.tsx`, `src/components/VideoPreview.tsx` — imported by nothing (tree-shaken from bundle; dead in repo).
- `index.html` Cabinet Grotesk request — Google Fonts does not serve this family; parameter verified dropped from response.

(`InteractiveParticles2D.tsx`, `InteractiveGrid2D.tsx` also appear unimported by any route; tree-shaken from the bundle — repo-level dead weight only.)

## 7. Runtime Hotspots (ranked by measured cost)

1. Blur-blob compositing/paint — 4.3× total frame cost (isolation experiment).
2. Script bootup 1.3s / main-thread 3.1s on mobile-class CPU (Lighthouse) — react-dom + router + framer + gsap + lenis parse/execute.
3. Load-time forced reflows ~215ms total.
4. CustomCursor rAF loop (per-frame `getBoundingClientRect` over cached magnetic elements) — **measured innocent** in the scroll experiment (already skipped mid-scroll); desktop-only. No action needed before launch.

## 8. Mobile Performance Findings (verified)

- Lighthouse mobile: **Perf 56/100** — FCP 4.3s, LCP 5.1s, SI 7.1s, TBT 420ms, TTI 5.3s, CLS 0.035 (good).
- Blur blobs render on mobile (no gate) — fill-rate cost on exactly the devices least able to afford it.
- No viewport overflow, touch targets fine, CLS excellent.

## 9. Production Defects (verified)

1. **CSP blocks all web fonts in production** (RC-1). Launch blocker.
2. Google Fonts request for a family Google doesn't carry (silent waste, masks the Fontshare dependency).
3. Duplicate, conflicting Bodoni Moda pipelines (HTML link vs CSS @import) — double downloads, inconsistent weights available depending on which wins.
4. Soft-404: unknown routes return HTTP 200 with homepage title.
5. Contrast failures on brand-pink text (WCAG AA).

## 10. High-Level Remediation Strategy (no implementation)

**Tier 1 — hours of work, transforms launch metrics:**

- Fix CSP (or better: **self-host all three fonts** as woff2 + preload — simultaneously fixes RC-1, RC-2, the duplicate Bodoni pipelines, the dead Cabinet Grotesk request, the Fontshare ORB flake, and removes 2s of render blocking).
- Remove or drastically shorten the fake preloader; if kept for brand, cap ≤800ms and don't lock scroll.
- Delete dead videos + dead components.

**Tier 2 — a day, fixes scroll on mobile:**

- Replace blur-filter blobs with pre-blurred static assets or radial gradients; gate ambience on mobile.
- Add immutable cache headers for `/assets/*`; shrink favicon.

**Tier 3 — larger, post-launch acceptable:**

- Defer the animation stack (framer/gsap/lenis) out of the first-paint path, or prerender the shell (vite-prerender/SSG) so HTML paints before JS.
- Fix contrast tokens; give 404 a real title.

## 11. Final Verdict

- **Launch blockers:** RC-1 (CSP kills all fonts in production).
- **Recommended before launch:** RC-3 (preloader), RC-2 (font chain — solved together with RC-1 by self-hosting), RC-5 mobile gating of blur blobs, dead-video deletion.
- **Safe after launch:** RC-4 (JS critical-path restructuring / prerender), cache headers, favicon, contrast, soft-404, chunking cleanup.

Investigation stopped at diminishing returns: all major symptoms have identified root causes with High confidence, verified by runtime measurement or controlled falsification.
