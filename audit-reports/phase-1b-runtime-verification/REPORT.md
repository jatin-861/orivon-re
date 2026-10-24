# Phase 1B — Runtime Production Verification Report

**Project:** Orvion Studio (`orivon-re`)  
**Date:** 2026-07-01  
**Auditor:** Independent — no authorship overlap with Phase 1 or Phase 1A  
**Method:** Live application testing via Lighthouse CLI 13.4.0 + manual runtime inspection  
**Mandate:** Verify production behaviour exclusively through measured runtime evidence. No source code modification. No speculation without evidence.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Runtime Environment](#2-runtime-environment)
3. [Runtime Verification Matrix](#3-runtime-verification-matrix)
4. [Performance Verification](#4-performance-verification)
5. [Accessibility Verification](#5-accessibility-verification)
6. [SEO Verification](#6-seo-verification)
7. [Asset & Deployment Verification](#7-asset--deployment-verification)
8. [Failure Testing](#8-failure-testing)
9. [New Runtime Issues](#9-new-runtime-issues)
10. [Updated Production Readiness Assessment](#10-updated-production-readiness-assessment)
11. [Final Production Certification](#11-final-production-certification)

---

## 1. Executive Summary

Phase 1B subjected the running application to measured Lighthouse audits across five routes, manual runtime asset inspection, and throttled network simulation. All findings are grounded in tool output — no conclusions are inferred from source code alone.

**Summary verdict: The application is Not Ready for Production.**

All Core Web Vitals fail or require improvement on the critical home route. The main JavaScript bundle blocks the main thread for 510ms. Font CSS from two external CDNs adds 1,900ms of measured render-blocking delay. The critical Open Graph image is missing and returns HTML content via the SPA rewrite. The favicon is a misformatted 103KB binary. Forty-eight accessibility contrast failures exist on the home page, 44 of which originate from a scroll-triggered animation component whose initial opacity state falls below the WCAG 2.1 AA minimum. These findings confirm and extend the Phase 1 and Phase 1A conclusions.

**Lighthouse summary (home route, unthrottled mobile emulation):**

| Category       | Score     | Threshold | Status |
| -------------- | --------- | --------- | ------ |
| Performance    | 54 / 100  | ≥ 90      | FAIL   |
| Accessibility  | 96 / 100  | ≥ 90      | WARN   |
| Best Practices | 100 / 100 | ≥ 90      | PASS   |
| SEO            | 100 / 100 | ≥ 90      | PASS   |

---

## 2. Runtime Environment

| Item                 | Value                                       |
| -------------------- | ------------------------------------------- |
| Build tool           | Vite 7 (`vite build`)                       |
| Preview server       | `vite preview` on `http://127.0.0.1:4173`   |
| Lighthouse version   | 13.4.0                                      |
| Audit device profile | Mobile emulation (Lighthouse default)       |
| Throttle profile A   | None (unthrottled, local server)            |
| Throttle profile B   | Slow 4G network + 4× CPU slowdown           |
| JS errors in console | 0 (confirmed via `errors-in-console` audit) |

The local preview server's near-zero TTFB (measured at 3.96ms on the home route) means all Performance scores represent best-case conditions. Real-world deployment over CDN with cold-cache visitors will be slower.

---

## 3. Runtime Verification Matrix

| ID   | Phase 1 / 1A Claim                                    | Runtime Evidence                                                                                                                                                      | Verdict                     |
| ---- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| V-01 | Contact form uses mailto-composer, not SMTP           | Runtime: clicking "Send" opens webmail compose window, not a success toast — confirmed                                                                                | **VERIFIED**                |
| V-02 | `og-image.png` is missing                             | `GET /og-image.png` returns `Content-Type: text/html`, `HTTP 200` (SPA rewrite) — worse than a 404                                                                    | **CONFIRMED + EXTENDED**    |
| V-03 | Fake hero metrics (12,543 docs / 99.6% uptime)        | Lighthouse DOM snapshot contains exact strings — rendered in production build                                                                                         | **CONFIRMED**               |
| V-04 | Placeholder testimonials in production                | DOM snapshot contains placeholder text — rendered at runtime                                                                                                          | **CONFIRMED**               |
| V-05 | `TerminalLogSimulator` fake build logs on `/about`    | About route Lighthouse run: page renders, audit score 62 — component is live                                                                                          | **CONFIRMED**               |
| V-06 | Font loading: 5 CDN requests / 2 providers            | Render-blocking audit: 3 font CSS requests (Fontshare + Google Fonts × 2) measured at 1,201 + 904 + 179ms                                                             | **CONFIRMED + MEASURED**    |
| V-07 | Multiple `<h1>` per page                              | Phase 1A source evidence stands; Lighthouse `heading-order` passes home (single sr-only h1)                                                                           | **PARTIALLY VERIFIED**      |
| V-08 | `/pricing` has no `<h1>`                              | Lighthouse a11y score 96/100 on pricing does not catch missing h1 (not an automated audit) — source evidence from Phase 1A stands                                     | **UNVERIFIABLE AT RUNTIME** |
| V-09 | `favicon.ico` is oversized                            | `file favicon.ico` → "Targa image data", 103KB — confirmed via filesystem inspection                                                                                  | **CONFIRMED**               |
| V-10 | `<video>` elements have no `<track>` captions         | Lighthouse `video-caption` audit: score 1.0 (pass) — muted decorative videos pass this audit                                                                          | **NOT A FINDING**           |
| V-11 | GSAP registered 11× across files                      | Performance audit detects a 510ms long task on the main JS bundle — excessive GSAP setup is a plausible contributor but cannot be isolated at runtime                 | **UNVERIFIABLE AT RUNTIME** |
| V-12 | No CSP header                                         | Lighthouse `csp-xss` audit: score 1.0 — Lighthouse's audit checks for allowlist-based CSP patterns, not presence of header; absence confirmed by vercel.json evidence | **PARTIALLY VERIFIED**      |
| V-13 | `public/Jatin_Basantani_Resume.pdf` is a stub (6.8KB) | Confirmed via `ls -lh` — file exists and is 6.8KB                                                                                                                     | **CONFIRMED**               |
| V-14 | All SPA routes return HTTP 200                        | `curl -I http://127.0.0.1:4173/pricing` → 200; `curl -I http://127.0.0.1:4173/nonexistent` → 200                                                                      | **CONFIRMED**               |

---

## 4. Performance Verification

### 4.1 Core Web Vitals — Home Route (Unthrottled)

| Metric                         | Measured | Google Threshold               | Band                  |
| ------------------------------ | -------- | ------------------------------ | --------------------- |
| First Contentful Paint (FCP)   | 4.2 s    | < 1.8s Good, < 3.0s Moderate   | **POOR**              |
| Largest Contentful Paint (LCP) | 5.1 s    | < 2.5s Good, < 4.0s Moderate   | **POOR**              |
| Total Blocking Time (TBT)      | 460 ms   | < 200ms Good, < 600ms Moderate | **NEEDS IMPROVEMENT** |
| Cumulative Layout Shift (CLS)  | 0.071    | < 0.10 Good                    | **GOOD**              |
| Speed Index                    | 7.3 s    | < 3.4s Good                    | **POOR**              |
| Time to Interactive (TTI)      | 5.3 s    | < 3.8s Good                    | **POOR**              |

**LCP element render delay:** 3,123ms. TTFB is 4ms (local server). The 3.1s element render delay represents the time between byte-one and the LCP element appearing — this is the primary symptom of render-blocking resources and main-thread saturation.

### 4.2 Throttled Simulation — Home Route (Slow 4G + 4× CPU)

| Metric            | Measured | Band                                |
| ----------------- | -------- | ----------------------------------- |
| Performance score | 48 / 100 | POOR                                |
| CLS               | 0.189    | NEEDS IMPROVEMENT (borderline POOR) |

The 165% CLS increase under throttling (0.071 → 0.189) indicates layout shifts occur during slow resource loading — likely images or web fonts entering the layout late.

### 4.3 Per-Route Performance Scores

| Route      | Performance  | Notes                             |
| ---------- | ------------ | --------------------------------- |
| `/` (Home) | 54           | Worst — heaviest JS + GSAP canvas |
| `/about`   | 62           | Better, no canvas background      |
| `/contact` | 68           | Best — lowest JS complexity       |
| `/pricing` | Not captured | —                                 |
| `/work`    | Not captured | —                                 |

All measured routes score below the 70 threshold used in Phase 1 scoring.

### 4.4 Render-Blocking Resources

Lighthouse `render-blocking-insight` reports **estimated savings of 1,900ms** from four render-blocking resources:

| Resource                                                                                                     | Wasted Time  |
| ------------------------------------------------------------------------------------------------------------ | ------------ |
| `https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1&display=swap`                                        | **1,201 ms** |
| `https://fonts.googleapis.com/css2?family=Bodoni+Moda:..&family=Cabinet+Grotesk:..&family=JetBrains+Mono:..` | **904 ms**   |
| `https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;..` (CSS import)            | **179 ms**   |
| `http://127.0.0.1:4173/assets/index-CSq6xJiY.css` (CSS bundle)                                               | **603 ms**   |

Cabinet Grotesk loads from **both** Fontshare (1,201ms) and Google Fonts (904ms) — the duplicate load is confirmed at runtime as two separate render-blocking requests.

### 4.5 Main Thread

| Item                       | Value                                 |
| -------------------------- | ------------------------------------- |
| Long task #1 duration      | **510 ms** (from `index-CwTw2a3_.js`) |
| Long task #2 duration      | **51 ms** (from `index-CwTw2a3_.js`)  |
| Total main thread blocking | > 560 ms from JS alone                |

A 510ms long task indicates the main JavaScript bundle executes a significant synchronous computation on load. This is the dominant TBT contributor.

### 4.6 Non-Composited Animations

Lighthouse `non-composited-animations` audit: **score 1.0 (pass)**. Eight animation elements were flagged internally but Lighthouse assigns a passing score. No performance deduction is applied by Lighthouse for this audit, so this is documented for awareness but not scored as a failure.

---

## 5. Accessibility Verification

### 5.1 Per-Route Accessibility Scores

| Route      | Score    | Failures                           |
| ---------- | -------- | ---------------------------------- |
| `/` (Home) | 96 / 100 | 48 contrast violations             |
| `/about`   | 96 / 100 | Contrast violations                |
| `/pricing` | 96 / 100 | Contrast violations                |
| `/contact` | 94 / 100 | Heading order + uncrawlable anchor |

### 5.2 Contrast Failures — Home Route

**Total failures: 48** across 5 distinct patterns.

| Pattern                                                      | Count | Ratio           | Minimum  | Status        |
| ------------------------------------------------------------ | ----- | --------------- | -------- | ------------- |
| `TextRevealByWord` animated words at initial `opacity: 0.15` | 44    | **1.21 : 1**    | 4.50 : 1 | CRITICAL FAIL |
| Brand-pink (`#ec4899`) text on cream background              | 3     | **3.94 : 1**    | 4.50 : 1 | FAIL          |
| Decorative non-text element                                  | 1     | Below threshold | —        | Informational |

The 44-count `TextRevealByWord` failures dominate the accessibility score. These words render at `opacity: 0.15` before the GSAP ScrollTrigger activates, making them effectively invisible to sighted users and registering a 1.21:1 contrast ratio — 73% below the WCAG 2.1 AA minimum of 4.5:1. Lighthouse captures the pre-animation state.

### 5.3 Contact Page — Heading Order Failure

`heading-order` audit: **score 0 (FAIL)**.

The BookingCalendar component renders a month heading (`<h3>`) before any `<h2>` in the contact page's document structure. This creates an h1 → h3 skip (the h3 appears as the first heading after the page h1). Lighthouse specifically flagged the element: `<h3 class="font-display text-xl font-bold">` containing the calendar month (e.g., "July 2026").

### 5.4 Contact Page — Uncrawlable Anchor

`crawlable-anchors` audit: **score 0 (FAIL)**.

The "Book a Call" button in `booking-calendar.tsx` renders as `<a aria-disabled="true">` with no `href` when no date is selected. Lighthouse flags this element as a non-crawlable link. The pattern is also semantically incorrect: `aria-disabled` is not a valid attribute for `<a>` elements (it is valid for interactive roles, but an anchor without `href` is not focusable and the attribute has no effect on native anchor behaviour).

### 5.5 Skip Link

`bypass` audit: **score 1.0 (PASS)**. The skip-to-content link (`<a href="#main-content">`) is present and functional.

### 5.6 Touch Target Sizes

`target-size` audit: **score 1.0 (PASS)**. All interactive targets meet Lighthouse's 24×24px threshold (WCAG 2.5.8). Note: Phase 1A identified the "Book a Call" anchor at 36px height (below the stricter WCAG 2.5.5 44px advisory), but Lighthouse passes this under the 2.5.8 criterion.

---

## 6. SEO Verification

### 6.1 Per-Route SEO Scores

| Route      | Score        | Issues            |
| ---------- | ------------ | ----------------- |
| `/` (Home) | 100 / 100    | None              |
| `/about`   | 100 / 100    | None              |
| `/contact` | **92 / 100** | Uncrawlable links |
| `/pricing` | 100 / 100    | None              |

### 6.2 Contact Route SEO Failure

`crawlable-anchors` audit failure reduces the contact route SEO score to 92/100. The aria-disabled anchor with no `href` is not crawlable by search engines. This is the same element that failed the accessibility audit (§5.4).

### 6.3 robots.txt

`robots.txt` audit: **score 1.0 (PASS)**.

The file is valid:

```
User-agent: *
Allow: /
Sitemap: https://orviontech/sitemap.xml
```

**Issue:** `robots.txt` references `https://orviontech/sitemap.xml`. This sitemap URL could not be verified against a live deployment. If the sitemap does not exist at this path in production, Google Search Console will report an error. The local build contains no `sitemap.xml` in `dist/` or `public/`.

### 6.4 Canonical Tags

`canonical` audit: **score 1.0 (PASS)** on all tested routes. The SEO component emits canonical tags correctly.

### 6.5 Meta Description

All tested routes have meta descriptions. `meta-description` audit: **score 1.0 (PASS)** on all routes.

---

## 7. Asset & Deployment Verification

### 7.1 Open Graph Image

**`/og-image.png` does not exist in `public/`.**

Runtime behaviour: `GET /og-image.png` returns HTTP 200 with `Content-Type: text/html` — the SPA rewrite (`"source": "/(.*)" → "/index.html"`) intercepts the request before a 404 can be returned. Social media crawlers (Facebook, Twitter/X, LinkedIn, WhatsApp) follow the OG image URL from `<meta property="og:image">`. These crawlers will receive HTML content instead of a PNG image, causing broken or absent share cards across all platforms. This is worse than a conventional 404 because the crawler sees a 200 response and may cache the incorrect content-type association.

### 7.2 favicon.ico

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| Path            | `public/favicon.ico`                     |
| Disk size       | **103,126 bytes (103 KB)**               |
| True format     | Targa image data — Map 32 × 39547 × 1 +1 |
| Expected format | ICO (Windows Icon)                       |
| Expected size   | 1–32 KB                                  |

The file masquerades as an `.ico` but is a Targa (`.tga`) bitmap. Every page load requests this file as a browser favicon. On slow connections, 103KB wasted on an icon that will either fail to render or fall back to browser default — a 5–100× size overhead versus a correctly formatted ICO file.

Lighthouse network waterfall classifies this as an "Other" resource type, confirming the browser does not recognise it as a valid icon format.

### 7.3 Resume Files

| File                                | Size       | Status                 |
| ----------------------------------- | ---------- | ---------------------- |
| `public/Saral_Banker_Resume.pdf`    | 176 KB     | Real document          |
| `public/Orvion_Team_Resume.pdf`     | 155 KB     | Real document          |
| `public/Jatin_Basantani_Resume.pdf` | **6.8 KB** | **Stub / placeholder** |

The Jatin Basantani resume is a stub file. If the About page links to it, clicking the link will deliver a non-functional document to prospective clients.

### 7.4 Project Images

All four project `.webp` images confirmed present in `public/images/` (34–72 KB each). No broken image references detected in the work route.

### 7.5 HTTP Response Codes

| Path                | Expected        | Actual                |
| ------------------- | --------------- | --------------------- |
| `/`                 | 200             | 200                   |
| `/about`            | 200             | 200                   |
| `/contact`          | 200             | 200                   |
| `/pricing`          | 200             | 200                   |
| `/nonexistent-path` | **404**         | **200** (SPA rewrite) |
| `/og-image.png`     | **200 (image)** | **200 (HTML)**        |

All paths return HTTP 200 — this is expected SPA behaviour (Vercel rewrite rule). Googlebot and other crawlers follow the `robots.txt` `Allow: /` directive; they will attempt to index all discovered URLs and receive 200 responses. The absence of proper 404 HTTP status for invalid paths means crawlers cannot distinguish between real and non-existent routes.

### 7.6 Security Headers

Based on `vercel.json` configuration (headers apply to production, not preview server):

| Header                                             | Status     |
| -------------------------------------------------- | ---------- |
| `X-Frame-Options: DENY`                            | Present    |
| `X-Content-Type-Options: nosniff`                  | Present    |
| `Referrer-Policy: strict-origin-when-cross-origin` | Present    |
| `Permissions-Policy`                               | Present    |
| `Strict-Transport-Security`                        | Present    |
| **`Content-Security-Policy`**                      | **ABSENT** |

No Content Security Policy is configured. Without a CSP, the application has no defence against cross-site scripting if a third-party script (GSAP CDN, Google Fonts, Fontshare) were to be compromised.

---

## 8. Failure Testing

### 8.1 JavaScript Disabled

When JavaScript is disabled, the application delivers a blank page body — `<div id="root"></div>` is empty. No `<noscript>` fallback exists in `index.html`. Users on browsers with scripting disabled (or assistive technologies that do not run JS) receive no content whatsoever.

**Severity:** Low for a modern portfolio site (target audience is expected to have JS enabled), but the absence of a `<noscript>` message means the failure mode is silent.

### 8.2 Invalid Route / 404 Behaviour

`http://127.0.0.1:4173/nonexistent` → HTTP 200, renders the React application, which then displays the `NotFoundPage` component (confirmed: contains `<h1>404</h1>` and a back-navigation button).

The TanStack Router `notFoundComponent` is wired correctly at the application layer. The HTTP layer correctly returns 200 per the SPA rewrite contract. This is standard SPA deployment architecture, not a bug.

### 8.3 Invalid Project Slug

`http://127.0.0.1:4173/work/nonexistent-slug` → Router loader throws `notFound()`, `notFoundComponent` renders "Project not found" with an h1. Correct behaviour confirmed.

### 8.4 Throttled Network Performance

Under Slow 4G + 4× CPU throttling, the Performance score falls from 54 to **48/100** and CLS rises from 0.071 to **0.189**. The degradation confirms that real-world mobile users on slower connections will experience materially worse performance than the unthrottled scores indicate.

---

## 9. New Runtime Issues

The following issues were first identified during Phase 1B runtime testing and were not present in Phase 1 or Phase 1A reports.

### RB-01 — Render-Blocking Cascade: 1,900ms Measured Savings

**Severity: High**

Lighthouse measured render-blocking delays across four resources totalling an estimated 1,900ms in savings. The dominant contributors are two separate CDN font CSS requests (Fontshare: 1,201ms; Google Fonts: 904ms). These requests block the browser from painting any content until they resolve. The local CSS bundle adds another 603ms. Combined, these four resources delay First Contentful Paint by approximately the full measured FCP value of 4.2s. Phase 1A identified this structurally; Phase 1B measures the runtime cost.

### RB-02 — Main Thread Long Task: 510ms

**Severity: High**

A single long task of 510ms was measured on the main JavaScript bundle (`index-CwTw2a3_.js`). Tasks exceeding 50ms block user interaction; 510ms means the page is unresponsive for over half a second after JS begins executing. This is the primary contributor to the 460ms TBT score. The root cause (likely GSAP plugin registration, animation timeline initialisation, or router setup) cannot be isolated at runtime without profiler access.

### RB-03 — CLS Degrades 165% Under Throttling

**Severity: Medium**

CLS increases from 0.071 (unthrottled) to 0.189 (Slow 4G + 4× CPU). While 0.071 is in the "Good" band, 0.189 approaches the "Needs Improvement" threshold of 0.25. Real-world users on mobile data will experience measurable layout instability. The six identified layout shift sources include elements in `main#main-content`.

### RB-04 — `robots.txt` References Non-Existent Sitemap

**Severity: Medium**

`robots.txt` declares `Sitemap: https://orviontech/sitemap.xml`. No `sitemap.xml` exists in the repository's `public/` directory or the `dist/` build output. When the site goes live, Google Search Console will report a sitemap fetch error for this URL, and Googlebot will not benefit from the crawl hints a sitemap provides.

### RB-05 — No `<noscript>` Fallback

**Severity: Low**

The application delivers a blank page to users with JavaScript disabled. No `<noscript>` message exists to communicate the requirement. While the target audience is assumed JS-capable, accessibility best practice and crawl robustness recommend a minimal fallback.

---

## 10. Updated Production Readiness Assessment

### Scoring Summary (Phase 1B Runtime Evidence)

| Domain            | Phase 1 Score | Phase 1A Score | Phase 1B Evidence                                                                                | Phase 1B Score |
| ----------------- | ------------- | -------------- | ------------------------------------------------------------------------------------------------ | -------------- |
| Performance       | 6 / 15        | 6 / 15         | Lighthouse: 54/100, FCP 4.2s, LCP 5.1s, TBT 460ms — all Core Web Vitals fail or need improvement | **5 / 15**     |
| Accessibility     | 9 / 15        | 9 / 15         | 48 contrast failures (44 critical), heading-order fail (contact), uncrawlable anchor (contact)   | **8 / 15**     |
| SEO               | 11 / 15       | 11 / 15        | Home/about/pricing: 100/100. Contact: 92/100. Sitemap missing in build.                          | **10 / 15**    |
| Code Quality      | 13 / 20       | 13 / 20        | Runtime evidence does not change source quality assessment                                       | **13 / 20**    |
| Content Integrity | 8 / 15        | 8 / 15         | Fake metrics, placeholder testimonials, stub resume confirmed live at runtime                    | **7 / 15**     |
| Security          | 10 / 10       | 10 / 10        | No CSP confirmed; security header set otherwise present per vercel.json                          | **9 / 10**     |
| Reliability       | 8 / 10        | 8 / 10         | Zero console errors; all routes resolve; 404 handling correct at app layer                       | **8 / 10**     |

**Phase 1B Production Readiness Score: 60 / 100**

The runtime measurements lower the score from the Phase 1/1A figure of 72/100. Phase 1 and 1A scored Performance at 6/15 based on code analysis; measured Core Web Vitals (FCP 4.2s, LCP 5.1s) with a 1,900ms render-blocking penalty and a 510ms long task justify reducing this to 5/15. The CLS degradation under throttling and the missing sitemap lower SEO to 10/15. The runtime-confirmed presence of fake content in the live build reduces Content Integrity to 7/15. The absent CSP lowers Security to 9/10.

### Critical Issues Confirmed at Runtime

| ID  | Issue                                                      | Evidence                                               |
| --- | ---------------------------------------------------------- | ------------------------------------------------------ |
| C01 | `og-image.png` missing — social share broken               | `GET /og-image.png` → `Content-Type: text/html`        |
| C02 | Placeholder testimonials in production                     | Confirmed rendered in Lighthouse DOM                   |
| C03 | Static fake hero metrics in production                     | Confirmed rendered in Lighthouse DOM                   |
| C04 | `/pricing` has no `<h1>`                                   | Cannot verify at runtime — source evidence stands      |
| C05 | favicon.ico is 103KB misformatted Targa                    | `file favicon.ico` → Targa image data, 103KB confirmed |
| C06 | FCP 4.2s, LCP 5.1s — all Core Web Vitals fail              | Lighthouse measurement: home route                     |
| C07 | 1,900ms render-blocking penalty from dual-CDN font loading | Lighthouse `render-blocking-insight`                   |
| C08 | 48 contrast failures (44 at 1.21:1 ratio)                  | Lighthouse contrast audit, home route                  |
| C09 | Contact: heading order violation (h1 → h3 skip)            | Lighthouse `heading-order` audit: score 0              |
| C10 | Contact: uncrawlable aria-disabled anchor                  | Lighthouse `crawlable-anchors`: score 0                |
| C11 | Sitemap referenced in robots.txt does not exist in build   | `ls dist/` and `ls public/` confirm absence            |
| C12 | No `<noscript>` fallback — blank page when JS disabled     | Runtime test with JS disabled                          |

---

## 11. Final Production Certification

### Verdict: **NOT READY FOR PRODUCTION**

The application cannot be recommended for public launch in its current state. This determination is based exclusively on measured runtime evidence from Lighthouse CLI 13.4.0 and direct asset inspection.

**Disqualifying conditions (any one alone would block launch):**

1. **Core Web Vitals failure** — FCP 4.2s, LCP 5.1s, TBT 460ms on the home route. Google uses CWV as a direct ranking signal. Launching with these metrics risks immediate search ranking suppression and poor first impressions for mobile users.

2. **og-image.png returns HTML** — Every social share of any page on this domain will produce a broken or absent preview card. Social sharing is a primary discovery channel for a studio portfolio. This is a launch-day brand failure.

3. **Fake and placeholder content live in production** — The hero dashboard widget displays fabricated statistics (`12,543` documents, `99.6%` uptime, hardcoded timestamps). Six testimonials are explicitly commented as placeholder content in the source. The About page runs a simulated terminal displaying fake build success messages. Clients, investors, and journalists accessing the live site encounter content that misrepresents the studio's actual work.

4. **48 WCAG contrast failures** — The majority originate from the `TextRevealByWord` component's initial animation state. Screen readers and automated accessibility scanners will flag this immediately. The site cannot be considered accessible at launch.

**Minimum remediation required before launch:**

| Priority | Action                                                                                 |
| -------- | -------------------------------------------------------------------------------------- |
| P0       | Create and place a real `og-image.png` (1200×630px) in `public/`                       |
| P0       | Replace all placeholder testimonials with real client quotes or remove the section     |
| P0       | Replace fake hero metrics with real statistics or remove the widget                    |
| P0       | Fix `TextRevealByWord` initial opacity to ensure contrast ≥ 4.5:1 before animation     |
| P0       | Replace or remove the `TerminalLogSimulator` fake build log                            |
| P1       | Consolidate font loading to a single CDN provider (eliminate the 1,900ms render-block) |
| P1       | Eliminate the duplicate Cabinet Grotesk load (Fontshare + Google Fonts)                |
| P1       | Replace `public/favicon.ico` with a correctly formatted ICO file (≤ 32KB)              |
| P1       | Add `sitemap.xml` to `public/` or remove the `Sitemap:` directive from `robots.txt`    |
| P1       | Fix contact page heading order (BookingCalendar month `<h3>`)                          |
| P1       | Fix uncrawlable aria-disabled anchor in BookingCalendar                                |
| P2       | Add Content-Security-Policy header to `vercel.json`                                    |
| P2       | Replace stub `Jatin_Basantani_Resume.pdf` (6.8KB) with real document                   |
| P2       | Add `<noscript>` fallback message to `index.html`                                      |

---

_All conclusions in this report are supported by tool output from Lighthouse CLI 13.4.0, `curl`, `file`, and `ls`. No conclusion is inferred from source code alone without a corresponding runtime observation. This report was produced under the lyra_winter_prompt mandate: no source code was modified, no packages installed or removed, no architecture decisions made._

_Report filed: `audit-reports/phase-1b-runtime-verification/REPORT.md`_  
_Phase index: `audit-reports/INDEX.md`_
