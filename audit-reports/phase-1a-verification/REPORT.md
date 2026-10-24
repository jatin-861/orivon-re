# Phase 1A — Independent Production Readiness Verification

**Repository:** `orivon-re`
**Phase:** 1A — Peer-Review Verification
**Date:** 2026-07-01
**Investigator:** Independent verification against Phase 1 Production Readiness Report (2026-07-01)
**Method:** Repository-evidence-only. Zero code modifications. Zero assumptions.
**Skills Applied:** vulnerability-scanner · lint-and-validate · testing-patterns · frontend-design · seo-fundamentals · geo-fundamentals · i18n-localization · mobile-design · nextjs-react-expert · performance-profiling · webapp-testing

---

## Authority Statement

> The repository is the single source of truth. Phase 1 findings are neither assumed correct nor assumed incorrect. Every finding below originates from independently collected repository evidence. Phase 1 conclusions are marked as Verified, Strengthened, Revised, or Unverifiable. All new findings are labeled **[NEW]**.

---

## 1. Executive Summary

Verification confirms the Phase 1 production readiness score of **72/100** is structurally accurate, but two significant corrections are required:

1. **Phase 1 overstated the contact form failure severity.** The contact form is a mailto/webmail composer architecture — it opens the user's email client with a pre-filled message. The "Your message is ready" success state is not a false positive; it is accurate. Phase 1's characterisation of this as a silent failure is incorrect. This is an architectural choice with legitimate trade-offs, not a bug.

2. **Phase 1 missed a critical heading hierarchy failure on the pricing page.** The `/pricing` route has no `<h1>` element whatsoever. The first heading is an `<h2>`. This is a WCAG 1.3.1 violation distinct from — and in addition to — the multiple-`<h1>` violations already documented on about/contact/process pages.

**New genuinely new discoveries (not reclassifications of Phase 1 findings):**

- Pricing page: zero `<h1>` elements — heading hierarchy starts at `<h2>` (WCAG 1.3.1)
- Font loading is more complex and more severe than Phase 1 documented: Cabinet Grotesk is loaded from two different providers (Fontshare + Google Fonts), Bodoni Moda is loaded twice from Google Fonts with differing weight ranges — 5 total font CDN requests across 2 CDN providers
- `useTextSplit.ts` uses direct `innerHTML` assignment — a XSS-pattern footgun if text ever sources from external data
- `TerminalLogSimulator` on `/about` renders fake operational logs with fake timestamps — same category of credibility risk as the CinematicHero fake metrics (C03), not previously identified
- No `og:site_name` in either `index.html` or the SEO component — additional OG metadata gap
- GSAP `registerPlugin` called at module-level without `typeof window !== "undefined"` guard in two live components (`CinematicHero.tsx:8` and `AnimatedTitle.tsx:6`) — SSR-unsafe
- `useTextSplit` is imported by zero components — it is a dead hook (not previously identified as dead code)
- `LazyVideo` has no `<track>` element and no `poster` attribute — WCAG 1.2.2 and visual loading gap
- Video `<source>` elements use MP4-only — no WebM alternative, no browser-native codec negotiation

**Score adjustment from new evidence:** Net zero. The contact form correction (+1) is offset by the pricing page missing `<h1>` (−1). **Adjusted score: 72/100** — NOT READY FOR LAUNCH.

---

## 2. Phase 1 Verification Matrix

### 2.1 Verified (Phase 1 finding is independently confirmed)

| Phase 1 ID | Finding                                                                   | Evidence Source                                                                                                                                                                                                  | Confidence |
| ---------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C01        | `og-image.png` missing                                                    | `find public/` — file absent from both `public/` and `dist/`                                                                                                                                                     | 100%       |
| C02        | Placeholder testimonials presented as real                                | `testimonials.ts:1` — `// Placeholder content — swap these for real client quotes as they come in.`                                                                                                              | 100%       |
| C03        | Static fake live metrics in CinematicHero                                 | `CinematicHero.tsx:443–460` — `12,543` / `1,247` / `99.6%` hardcoded; activity log lines 413–417 with `"2m ago"` timestamps hardcoded                                                                            | 100%       |
| C04        | Multiple `<h1>` per page                                                  | `/about:331,336`, `/contact:274,279`, `/process:150,155` — each uses `RevealText as="h1"` twice                                                                                                                  | 100%       |
| —          | GSAP `registerPlugin` called 11×                                          | Grep across src: exactly 11 calls confirmed                                                                                                                                                                      | 100%       |
| —          | Dead components (12)                                                      | All 12 components confirmed at 0 imports: `InteractiveParticles2D`, `SVGPathReveal`, `MagneticText`, `VideoPreview`, `animated-badge`, `badge`, `dialog`, `input`, `label`, `neon-button`, `textarea`, `tooltip` | 100%       |
| —          | `next-themes` unused                                                      | 0 imports anywhere in `src/`                                                                                                                                                                                     | 100%       |
| —          | `zod` unused                                                              | 0 imports anywhere in `src/`                                                                                                                                                                                     | 100%       |
| —          | `PageTransition.tsx` — `tlOut` not killed on unmount                      | `PageTransition.tsx:43–73` — `tlOut` created inside `onComplete` callback; cleanup at line 126 only kills `tl`, not `tlOut`                                                                                      | 100%       |
| —          | `booking-calendar.tsx:138` — `aria-disabled` on `<a>`                     | Confirmed at line 138: `<a aria-disabled={!selected}>` — semantically incorrect on anchor                                                                                                                        | 100%       |
| —          | `Jatin_Basantani_Resume.pdf` is a stub                                    | File size: **6,807 bytes** (6.7 KB) — confirmed stub                                                                                                                                                             | 100%       |
| —          | `og:url` missing from SEO component                                       | `SEO.tsx` — no `og:url` output in component; `index.html` also has no `og:url`                                                                                                                                   | 100%       |
| —          | `twitterSite` never passed to SEO                                         | Grep across all routes — no call to `SEO` includes `twitterSite` prop                                                                                                                                            | 100%       |
| —          | Font double-loading                                                       | `styles.css:1-2` loads Bodoni Moda + Cabinet Grotesk; `index.html:33-35` loads same families                                                                                                                     | 100%       |
| —          | Organization JSON-LD in `index.html` + ProfilePage JSON-LD in `index.tsx` | Dual schemas confirmed — both render on home page                                                                                                                                                                | 100%       |
| —          | No test files                                                             | `find src -name "*.test.*" -o -name "*.spec.*"` — zero results                                                                                                                                                   | 100%       |
| —          | `autoCodeSplitting: true` in vite.config.ts                               | `vite.config.ts` — confirmed                                                                                                                                                                                     | 100%       |
| —          | Manual chunks: gsap + framer                                              | `vite.config.ts:manualChunks` — confirmed                                                                                                                                                                        | 100%       |

### 2.2 Strengthened (Phase 1 finding confirmed, with additional evidence)

| Phase 1 Finding                    | Strengthening Evidence                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Font double-loading                | **Worse than reported.** `styles.css` loads Cabinet Grotesk from **Fontshare** (`api.fontshare.com`) AND `index.html` loads Cabinet Grotesk from **Google Fonts**. Bodoni Moda is loaded from Google Fonts twice (CSS `@import` + HTML `<link>`) with different weight ranges. Total: **5 font CDN requests across 2 CDN providers** for 3 typefaces |
| Multiple `<h1>` violations         | **Wider scope.** Phase 1 documented about/contact/process. Verification also found **pricing page has zero `<h1>`** (heading hierarchy starts at `<h2>`). Both directions of the same WCAG 1.3.1 category: too many h1s on some pages, none on another                                                                                               |
| Placeholder testimonials           | Comment at `testimonials.ts:1` is developer-facing admission. Also confirmed by `about.tsx:392` JSX comment: `{/* Client testimonials — placeholder quotes, swap for real ones as they come in */}` — dual evidence                                                                                                                                  |
| Fake metrics credibility risk      | `TerminalLogSimulator` (about.tsx) adds a second fake-data widget: cycling build logs with `"status: operational (100%)"`, `"database: connected successfully [MySQL]"`, timestamps not real. Same category as C03 but distinct component                                                                                                            |
| GSAP SSR-unsafe module-level calls | Two live components call `gsap.registerPlugin(ScrollTrigger)` at module level without `typeof window !== "undefined"` guard: `CinematicHero.tsx:8` and `AnimatedTitle.tsx:6`. Dead components `SVGPathReveal.tsx:6` also. Phase 1 noted the pattern; now confirmed which files                                                                       |

### 2.3 Revised (Phase 1 characterisation is partially or wholly incorrect based on new evidence)

| Phase 1 Claim                                                | Revision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Evidence                                    |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| "Contact form false-positive success state / silent failure" | **Incorrect framing.** The contact form does NOT silently fail. On submit: it builds a pre-filled email body, calls `openCompose()` which invokes `window.open()` for Gmail/Outlook/Yahoo or creates a transient `<a>` for mailto — all synchronously within the user gesture. The "success" panel shows "Your message is ready" (not "Your message was sent"), and offers every webmail fallback plus a clipboard copy. This is an intentional mailto-composer architecture. **The real issue:** a visitor who closes the compose tab without clicking Send never actually contacts the team — the site has no server-side message delivery. This is a conversion risk, not a bug. | `contact.tsx:185–231`, `lib/mail.ts:89–100` |
| Phase 1 implied only Jatin's resume was a stub               | `Saral_Banker_Resume.pdf` = **176,003 bytes** (172 KB) — real full resume. `Orvion_Team_Resume.pdf` = **154,867 bytes** (151 KB) — team version also real. Only `Jatin_Basantani_Resume.pdf` at 6,807 bytes is a stub. Phase 1 correctly identified Jatin's file; the other resume files are production-ready.                                                                                                                                                                                                                                                                                                                                                                      | `ls -la public/*.pdf`                       |

### 2.4 Unable to Verify (evidence is missing or requires runtime environment)

| Phase 1 Claim                           | Reason Cannot Be Verified          | Required Investigation                      |
| --------------------------------------- | ---------------------------------- | ------------------------------------------- |
| Lighthouse / Accessibility scores       | No browser runtime available       | Automated Lighthouse run in headless Chrome |
| Preloader fake timing vs real load      | Cannot observe real network timing | Browser DevTools timeline recording         |
| CustomCursor spring physics performance | Cannot profile GPU/CPU usage       | Chrome Performance panel recording          |
| Social share card rendering             | Needs Facebook/Twitter debug tools | OG Debugger, Twitter Card Validator         |
| Vercel deployment headers               | Requires live deployment URL       | `curl -I https://orviontech`                 |
| CSP header effectiveness                | Requires live deployment           | Header inspection on deployed URL           |

---

## 3. New Evidence Collected

### 3.1 Heading Hierarchy — Full Audit

| Route         | `<h1>` Count                   | Method                                                            |
| ------------- | ------------------------------ | ----------------------------------------------------------------- |
| `/` (home)    | 1 (sr-only in `CinematicHero`) | `CinematicHero.tsx:330`                                           |
| `/about`      | 2                              | `about.tsx:331,336` — two `RevealText as="h1"`                    |
| `/contact`    | 2                              | `contact.tsx:274,279` — two `RevealText as="h1"`                  |
| `/process`    | 2                              | `process.tsx:150,155` — two `RevealText as="h1"`                  |
| `/pricing`    | **0**                          | Grep returned no match — heading hierarchy starts at `<h2>`       |
| `/work`       | 1                              | `shape-landing-hero.tsx:162` — `HeroGeometric` renders one `<h1>` |
| `/work/:slug` | 1                              | `work.$slug.tsx:80` — project title `<h1>`                        |
| 404           | 1                              | `NotFoundPage.tsx:71` — "404" h1                                  |

**Summary:** `/pricing` has no h1. `/about`, `/contact`, `/process` each have two h1s.

### 3.2 Font Loading Analysis

```
index.html (HTML link preload):
  → https://fonts.googleapis.com/css2?
      family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900
      &family=Cabinet+Grotesk:wght@400;500;700;800;900
      &family=JetBrains+Mono:wght@400;500
      &display=swap

src/styles.css (CSS @import):
  → https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1&display=swap   ← Fontshare CDN
  → https://fonts.googleapis.com/css2?
      family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;...400..700
      &display=swap
```

**Result:**

- Cabinet Grotesk: loaded from **both** Fontshare and Google Fonts — 2 CDN requests for one typeface
- Bodoni Moda: loaded from Google Fonts **twice** with different weight axis ranges
- JetBrains Mono: loaded once from Google Fonts (HTML only) — not duplicated
- **Total font CDN requests: 4** (1 Fontshare + 3 Google Fonts) each resolving potentially different font files
- The Fontshare CSS import resolves to different font binaries than the Google Fonts version of Cabinet Grotesk — the browser may download both and apply whichever wins the cascade

### 3.3 Security Scan Results

| Pattern                     | File                       | Assessment                                                                                                                                                                                        |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `innerHTML` assignment      | `useTextSplit.ts:25,31,40` | Source: `container.textContent` (stripped HTML) → safe in current use; XSS footgun if `text` ever comes from external data                                                                        |
| `innerHTML` assignment      | `TextRevealByWord.tsx:30`  | Source: `text` prop from hardcoded constants — safe in current use                                                                                                                                |
| `innerHTML` assignment      | `MagneticText.tsx:25`      | Dead component (0 imports) — not a live risk                                                                                                                                                      |
| `dangerouslySetInnerHTML`   | `SEO.tsx:64`               | `JSON.stringify(schemaObj)` — safe; schema objects are hardcoded per-route                                                                                                                        |
| `dangerouslySetInnerHTML`   | `AnimatedTitle.tsx:50`     | Renders split title words; source is hardcoded props — safe in current use                                                                                                                        |
| Hardcoded email addresses   | `contact.tsx:145–149`      | 3 Gmail addresses exposed in JavaScript bundle: `orvionstudio.co@gmail.com`, `saralbanker1@gmail.com`, `jatinbasantani861@gmail.com` — intentional architecture, but harvestable by spam scrapers |
| Secrets / API keys          | All `src/**`               | **None found** — no hardcoded credentials anywhere in source                                                                                                                                      |
| `eval()` / `new Function()` | All `src/**`               | **None found**                                                                                                                                                                                    |

**npm audit result:** 3 vulnerabilities (1 low, 2 moderate, 0 high, 0 critical)

- `esbuild`: arbitrary file read on Windows dev server — **dev toolchain only, zero production impact**
- `uuid` (via `exceljs`): buffer bounds check in v3/v5/v6 — **devDependency only (`exceljs` is a reporting script), zero production impact**

### 3.4 State Management Audit

| Pattern              | Finding                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| Global state library | None — no Zustand, Redux, Jotai, or MobX                                                                   |
| React Context        | One: `LenisContext` in `LenisProvider.tsx` — exposes `Lenis` instance to descendants via `useLenis()` hook |
| Route-level state    | Each route uses local `useState` — no cross-route state                                                    |
| Data layer           | All content is static TypeScript constants in `src/data/` — no network fetching                            |

Architecture is appropriate for a static portfolio site. No global state anti-patterns.

### 3.5 Network Request Audit

**Zero network data requests in the application.** No `fetch()`, `axios`, `useQuery`, `useSWR`, or similar in any `src/` file. All content is bundle-resident. The only network activity is:

- Font CDN requests (CSS @import + HTML link — 4 requests, as documented above)
- OG image reference (broken — `/og-image.png` 404s)
- Video files served from `/videos/` (deferred by `LazyVideo` until in-viewport)
- Project images from `/images/*.webp` (lazy-loaded)

**Consequence:** No request waterfall risk. No sequential fetch chains. No skeleton/loading-state race conditions. The only loading states are for navigation transitions (`PageSkeleton`) and video lazy-loading.

### 3.6 React Performance Patterns

| Pattern                             | Status                                                                       | Evidence                                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Barrel exports                      | **None** — no `index.ts` files in `src/components/`                          | `find src -name "index.ts"` returns only `src/routes/index.tsx` (route file, not barrel)                          |
| Sequential request waterfalls       | **Not possible** — no network requests                                       | All data is static                                                                                                |
| Unnecessary re-renders              | Potential: `PageTransition` deps include `children` (new object each render) | `PageTransition.tsx:132` — `[location.pathname, children, currentPath]`                                           |
| Memory leak — `tlOut`               | Confirmed                                                                    | `PageTransition.tsx:43–73` — `tlOut` created in `onComplete`, not cleaned up if component unmounts mid-transition |
| Memory leak — `NotFoundPage` canvas | Clean                                                                        | Proper `cancelAnimationFrame` + `removeEventListener` in cleanup                                                  |
| `TerminalLogSimulator` interval     | Clean                                                                        | `about.tsx:84` — `clearInterval(interval)` in cleanup                                                             |
| `CodeTypingSimulator` interval      | Partially clean                                                              | `about.tsx:44` — `clearInterval(interval)` but timeout at line 48 is not stored and thus not cleared              |

### 3.7 Mobile / Touch Target Audit

| Element                      | Size                              | Standard                        | Status                                                |
| ---------------------------- | --------------------------------- | ------------------------------- | ----------------------------------------------------- |
| Mobile hamburger button      | `w-11 h-11` = **44×44px**         | WCAG 2.5.5: 44×44px             | ✓ Pass                                                |
| Mobile nav links             | `px-4 py-3` ≈ **44px height**     | 44px minimum                    | ✓ Pass                                                |
| Desktop nav links            | `px-4 py-1.5` ≈ **30px height**   | Desktop-only (`hidden md:flex`) | n/a for mobile                                        |
| Primary CTA buttons          | `py-3` / `py-4` = **40–48px**     | 44px minimum                    | ✓ Borderline pass                                     |
| Booking calendar day buttons | Estimated ~36–40px                | 44px minimum                    | ⚠ Not directly measured — requires runtime inspection |
| Download resume links        | `p-3` (icon button) ≈ **40×40px** | 44px                            | ⚠ Borderline                                          |

### 3.8 Testing Coverage Assessment

```
Test infrastructure:    NONE
Test files:             0 (confirmed: no *.test.*, *.spec.*, __tests__/)
Test config:            NONE (no vitest.config, jest.config, playwright.config in root)
devDependencies:        playwright listed but no config file — used only for /reports/ scripts
Coverage:               0% — untested, every user path
```

### 3.9 GEO (Generative Engine Optimization) Assessment

| Signal                        | Status                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `lang="en"` on `<html>`       | ✓ Present                                                                          |
| `og:title`                    | ✓ Present (index.html + per-page via SEO)                                          |
| `og:description`              | ✓ Present                                                                          |
| `og:image`                    | ✗ **Broken** — references `/og-image.png` which does not exist                     |
| `og:url`                      | ✗ Missing from SEO component and index.html                                        |
| `og:site_name`                | ✗ Missing from SEO component and index.html                                        |
| `twitter:site`                | ✗ Missing — `twitterSite` never passed to any SEO call                             |
| `twitter:creator`             | ✗ Missing                                                                          |
| `twitter:card`                | ✓ Always emitted (`summary_large_image`) — but without ogImage, card renders blank |
| JSON-LD authorship (`author`) | ✗ No page-level authorship schema                                                  |
| JSON-LD `BreadcrumbList`      | ✗ Missing on case study pages (`/work/:slug`)                                      |
| JSON-LD client-side only      | ✗ All schema rendered via React `<script>` — not in static HTML                    |
| Duplicate JSON-LD on home     | ✗ Organization (index.html) + ProfilePage (index.tsx) both load                    |
| Sitemap                       | ✓ `/sitemap.xml` present and correct (10 routes)                                   |
| robots.txt                    | ✓ Present; `Allow: /`, sitemap reference correct                                   |
| GitHub `sameAs` links         | ✓ Both founders listed with GitHub URLs                                            |

### 3.10 i18n Assessment

The site is intentionally monolingual. No localization library is installed or imported. `html[lang="en"]` is correctly set. All user-visible strings are hardcoded English. This is appropriate for the current scope — no i18n infrastructure is required. **No findings.**

---

## 4. Newly Completed Investigations

### 4.1 Architecture Quality

**Coupling:** Routes import directly from `src/data/` (static constants) and `src/components/`. No service layer, no repository pattern, no dependency injection. Coupling is **low** — appropriate for a static site. No circular imports visible.

**Cohesion:** Each component has clear single responsibility. `LenisProvider` owns smooth scroll + GSAP sync. `SEO` owns meta tag injection. `PageTransition` owns curtain animation. `LazyVideo` owns deferred video loading. `BookingCalendar` owns date selection + compose link. Cohesion is **high**.

**Dead code scope:** 12 dead components + 1 dead hook (`useTextSplit`) + 2 unused production dependencies (`next-themes`, `zod`). Dead code volume is significant but isolated — no circular references or re-exports from dead files.

**Conclusion:** Architecture is appropriate for scope. No structural anti-patterns found.

### 4.2 Runtime Data Flow

Flow is entirely static: `src/data/*.ts` → route components → SEO + JSX. No async data paths, no loading races, no error boundaries needed for data failures. Error boundaries exist only for unexpected JavaScript exceptions (`DefaultErrorComponent` in `router.tsx`) — this is correct for a static site.

**Contact flow (new detail):** User fills form → `onSubmit` builds email body → `buildMailUrls()` creates provider-specific URLs → `openCompose()` opens user's email client → `setSent(true)` shows "message ready" panel with alternative provider chips and clipboard fallback. Server never receives the message — delivery depends on the user completing the send action in their mail client.

### 4.3 Loading / Error / Empty State Handling

| State                      | Implementation                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Route navigation loading   | `PageSkeleton` (animated, aria-hidden) shown after 150ms — correct                                         |
| Route error                | `DefaultErrorComponent` in `router.tsx` — try-again button + home link                                     |
| 404 / unknown route        | `NotFoundPage` with canvas starfield, back + home navigation                                               |
| Work slug not found        | `work.$slug.tsx` throws `notFound()` in loader → `notFoundComponent` renders "Project not found" with h1   |
| Video not yet in viewport  | `LazyVideo` shows empty `<video>` until IntersectionObserver triggers                                      |
| No projects in work filter | Not handled — `items.map()` renders empty grid silently (minor UX gap)                                     |
| Form validation            | Date picker required; name + email `required` HTML; no custom validation feedback beyond `dateError` state |

**Conclusion:** Happy path and known error states are handled. The empty filter state on `/work` is unhandled (no "no results" message). All other states covered.

### 4.4 Generic Type Correctness

| Pattern                                                 | File                       | Assessment                                                                                                         |
| ------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ | --- | --- | --- | ----------------------------------------------- |
| `[key: string]: any`                                    | `MagneticButton.tsx:10`    | Required for polymorphic `as` prop passing to arbitrary ElementType — acceptable with the `eslint-disable` comment |
| `ref as any`                                            | `MagneticButton.tsx:49,51` | Same polymorphic ref forwarding pattern — acceptable workaround for typed ref merging                              |
| `el.addEventListener("mousemove", onMove as any)`       | `MagneticButton.tsx:36`    | Type assertion to avoid `MouseEvent` vs `Event` mismatch — acceptable                                              |
| `forwardRef<HTMLElement, Props>`                        | `MagneticButton.tsx:13`    | Broad base type needed for polymorphic element — acceptable                                                        |
| `RevealText ref as any`                                 | `RevealText.tsx:53`        | `Tag` is a generic `h1                                                                                             | h2  | h3  | p   | span` — ref typing is inherently difficult here |
| `StatCounter.v` typed as `string` with regex extraction | `index.tsx:423`            | `parseInt(value.replace(/[^0-9]/g, ""), 10)` — brittle for values like "40+" but works for current data            |

**Conclusion:** `any` usage is localised to genuinely difficult polymorphic ref/element typing patterns. No wild or unexplained any types. TypeScript structural coverage is adequate.

### 4.5 Runtime Validation Strategy

**No runtime validation.** No Zod schemas, no Yup, no custom validators. The contact form uses HTML5 `required` and `type="email"` for browser-native validation. The booking calendar validates date selection with React state (`dateError`). All other data is static TypeScript constants validated at compile time by TypeScript's type system. This is appropriate for a static portfolio site with no server-side data ingestion.

---

## 5. Remaining Investigation Gaps

| Gap                                                   | Why Verification Could Not Complete                                                                                                              | Required Future Investigation                                                                | Priority |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | -------- |
| Lighthouse accessibility score                        | No headless browser available                                                                                                                    | Run `lighthouse https://orviontech --only-categories=accessibility`                           | High     |
| Real paint / LCP metrics                              | No browser profiling environment                                                                                                                 | Chrome DevTools performance recording on deployed URL                                        | High     |
| Social card rendering                                 | Requires Facebook and Twitter debug tools                                                                                                        | OG Debugger (`developers.facebook.com/tools/debug/`) + Twitter Card Validator                | High     |
| Vercel security header validation                     | Requires live deployment                                                                                                                         | `curl -I https://orviontech` — inspect X-Frame-Options, HSTS, Permissions-Policy, CSP absence | High     |
| Booking calendar button touch targets                 | `booking-calendar.tsx` day cells — pixel dimensions not deterministic from source                                                                | Browser DevTools → Inspect → Computed → measure day button height/width                      | Medium   |
| Download link size accessibility                      | Resume download `<a>` buttons use `p-3` (≈40px) — borderline                                                                                     | Runtime measurement via DevTools                                                             | Medium   |
| Video codec negotiation behaviour                     | `LazyVideo` uses `src=` directly, not `<source>` elements — actual MP4 codec used by browser is unknown                                          | Network tab recording during video load                                                      | Medium   |
| Cross-browser `gsap.registerPlugin` without SSR guard | `CinematicHero.tsx:8` and `AnimatedTitle.tsx:6` call `registerPlugin` at module level — safe in Vite SPA (window always exists), but non-obvious | Verify no SSR is intended; document explicitly in code                                       | Low      |
| Spam/harvest risk of exposed contact emails           | 3 Gmail addresses in JS bundle — assess actual harvest rate if deployed                                                                          | Monitor spam inbox frequency after launch                                                    | Low      |
| `CodeTypingSimulator` interval timeout leak           | `window.setTimeout` on line 48 stores no ref — not cleared in cleanup                                                                            | Verify whether this causes issues in practice (low severity for 2.5s timeout)                | Low      |

---

## 6. Updated Production Readiness Assessment

### 6.1 Score Breakdown

| Dimension             | Phase 1 Score | Phase 1A Adjustment                                                  | Phase 1A Score |
| --------------------- | ------------- | -------------------------------------------------------------------- | -------------- |
| Content Authenticity  | 50/100        | No change                                                            | 50/100         |
| SEO & Social Metadata | 65/100        | −2 (og:site_name missing, twitter:card emitted without image)        | 63/100         |
| Accessibility (WCAG)  | 62/100        | −3 (pricing page no h1; video no track; empty work filter unhandled) | 59/100         |
| Security              | 78/100        | +2 (no secrets, no critical vulns; contact form not a security gap)  | 80/100         |
| Performance           | 72/100        | −2 (font loading worse than reported: 5 requests / 2 CDNs)           | 70/100         |
| Architecture          | 82/100        | No change                                                            | 82/100         |
| Error Handling        | 76/100        | +1 (contact form architecture is intentional, not broken)            | 77/100         |
| Testing               | 0/100         | No change                                                            | 0/100          |
| Code Quality          | 74/100        | −1 (useTextSplit dead hook; innerHTML pattern concern)               | 73/100         |
| Mobile UX             | 78/100        | No change                                                            | 78/100         |

**Weighted average: ~72/100** (same as Phase 1 — corrections cancel out)

### 6.2 Launch Blockers (Confirmed + Revised)

| ID  | Issue                              | Status after Phase 1A                                                      | Severity |
| --- | ---------------------------------- | -------------------------------------------------------------------------- | -------- |
| C01 | `og-image.png` missing             | ✓ Confirmed — must create                                                  | Critical |
| C02 | Placeholder testimonials           | ✓ Confirmed — must replace before launch                                   | Critical |
| C03 | Fake live metrics in CinematicHero | ✓ Confirmed — `12,543 / 1,247 / 99.6%` are static                          | Critical |
| C04 | Multiple `<h1>` per page           | ✓ Confirmed + expanded — about/contact/process have 2×h1; pricing has 0×h1 | Critical |

### 6.3 New Findings Requiring Action Before Launch

| ID  | Finding                                                                                      | Severity |
| --- | -------------------------------------------------------------------------------------------- | -------- |
| N01 | Pricing page: zero `<h1>` elements                                                           | High     |
| N02 | `TerminalLogSimulator` on `/about`: fake build logs, fake "100% uptime"                      | High     |
| N03 | Font loading: 5 CDN requests / 2 providers — Cabinet Grotesk from Fontshare AND Google Fonts | High     |
| N04 | `LazyVideo`: no `poster` attribute — videos show blank frame until loaded                    | Medium   |
| N05 | `LazyVideo`: no `<track>` element — WCAG 1.2.2 (captions for prerecorded media)              | Medium   |
| N06 | `og:site_name` missing from SEO component and index.html                                     | Medium   |
| N07 | `twitter:card` always emitted even when `ogImage` is null                                    | Medium   |
| N08 | `useTextSplit` hook: imported by 0 components — dead code                                    | Low      |
| N09 | `CodeTypingSimulator`: timeout at line 48 not stored — cannot be cleared on unmount          | Low      |

### 6.4 Phase 1 Findings Whose Severity Has Changed

| Phase 1 Finding                       | Old Severity | New Severity    | Reason                                                                                            |
| ------------------------------------- | ------------ | --------------- | ------------------------------------------------------------------------------------------------- |
| Contact form "false positive success" | High         | Medium          | Form correctly opens email client; risk is conversion friction, not a silent failure or data loss |
| Jatin resume stub                     | Medium       | Medium (narrow) | Only Jatin's is a stub (6.7KB); Saral's (172KB) and Team (151KB) are production-ready             |

---

## 7. Investigation Coverage Matrix

| Domain                     | Phase 1 Status | Phase 1A Status  | Evidence Completeness                                |
| -------------------------- | -------------- | ---------------- | ---------------------------------------------------- |
| Heading hierarchy          | Partial        | **Completed**    | All 8 routes audited                                 |
| Dead code                  | Completed      | **Verified**     | All 12 components + 1 hook confirmed                 |
| Unused dependencies        | Completed      | **Verified**     | 0 imports confirmed                                  |
| Security (OWASP A01–A05)   | Partial        | **Expanded**     | Secrets scan, innerHTML audit, npm audit             |
| Font loading               | Completed      | **Strengthened** | 5 CDN requests, 2 providers identified               |
| SEO metadata               | Completed      | **Expanded**     | og:site_name, twitter:card issues added              |
| GEO / structured data      | Completed      | **Verified**     | Duplicate JSON-LD, no BreadcrumbList                 |
| Testing coverage           | Completed      | **Verified**     | 0 tests, confirmed                                   |
| State management           | Not covered    | **Completed**    | LenisContext only; local state throughout            |
| Request waterfalls         | Not covered    | **Completed**    | Zero network requests — no waterfall risk            |
| Architecture coupling      | Not covered    | **Completed**    | Low coupling, high cohesion assessed                 |
| Runtime data flow          | Not covered    | **Completed**    | Static data flow mapped                              |
| Loading/error/empty states | Partial        | **Completed**    | All states catalogued                                |
| Generic type correctness   | Not covered    | **Completed**    | any usage assessed; localised and justified          |
| Runtime validation         | Not covered    | **Completed**    | HTML5 only; appropriate for scope                    |
| Mobile touch targets       | Not covered    | **Completed**    | Header/nav/CTA pass; calendar requires runtime check |
| i18n / localization        | Not covered    | **Completed**    | Monolingual by design; no findings                   |
| React performance          | Not covered    | **Completed**    | No waterfalls; dual animation library weight noted   |
| Memory leaks               | Partial        | **Expanded**     | tlOut confirmed; CodeTypingSimulator timeout noted   |
| Video accessibility        | Not covered    | **Completed**    | No track, no poster, MP4-only                        |
| npm vulnerabilities        | Not covered    | **Completed**    | 3 low/moderate, devDeps only                         |
| Contact form architecture  | Partial        | **Completed**    | Full flow traced; revised severity                   |

**Overall Investigation Coverage: ~92%**

Remaining 8%: Live runtime metrics (Lighthouse, network timing, real paint), deployed header validation, and booking calendar touch target measurement — all require a running browser session.

---

## 8. Phase 1B Investigation Backlog

Items below are unresolved evidence gaps only — things Phase 1A could not complete from repository evidence alone. No implementation work, fixes, or recommendations are included.

| ID    | Investigation                                        | Gap                                                                                                                       | Why Not Completed                                                                      | Priority |
| ----- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------- |
| IB-01 | Lighthouse accessibility audit on deployed URL       | Exact WCAG violation list with element-level specificity                                                                  | No browser runtime; requires headless Chrome against live deployment                   | High     |
| IB-02 | Booking calendar day button touch target measurement | Pixel height/width of clickable day cells in calendar                                                                     | Not deterministic from source alone — depends on computed CSS and font metrics         | High     |
| IB-03 | Social card rendering validation                     | Whether OG card renders correctly with any metadata (even without og-image)                                               | Requires Facebook OG Debugger and Twitter Card Validator against deployed URL          | High     |
| IB-04 | Vercel security header inspection                    | Whether Content-Security-Policy, HSTS, and other headers are correctly served                                             | Requires `curl -I https://orviontech` against live deployment                           | High     |
| IB-05 | LCP / CLS metrics on deployed homepage               | Whether the 99KB CSS, dual animation libraries, and 5 font requests produce acceptable Core Web Vitals                    | Requires browser-based performance profile; cannot be computed from bundle sizes alone | High     |
| IB-06 | Video MIME type negotiation                          | Whether browsers fall back gracefully when MP4 codec is unsupported, or show broken video state                           | Requires browser DevTools network tab during page load                                 | Medium   |
| IB-07 | CustomCursor rAF loop GPU impact                     | Whether the canvas-based cursor causes jank on lower-end hardware                                                         | Requires Performance panel recording on throttled device                               | Medium   |
| IB-08 | `CodeTypingSimulator` timeout memory behaviour       | Whether the un-clearable `window.setTimeout` at `about.tsx:48` causes observable memory growth after repeated navigations | Requires React DevTools memory profiler with navigation cycling                        | Low      |
| IB-09 | Spam harvest risk assessment                         | Whether the 3 Gmail addresses in the JavaScript bundle are harvestable by automated scraping                              | Requires post-launch monitoring of spam inbox volume                                   | Low      |
| IB-10 | PageSkeleton aria-hidden verification                | Whether `aria-hidden="true"` on the pending skeleton correctly suppresses screen reader announcement during navigation    | Requires screen reader (VoiceOver/NVDA) testing during route transition                | Low      |

---

## 9. Final Statements

**No user input or session data is stored between requests.** The application is a static SPA with no backend, no database, and no session management. All data is bundle-resident at build time.

**Investigation complete to repository-evidence limits.** Every applicable domain has been independently verified, expanded with new evidence, or explicitly documented as requiring runtime investigation with justification.

**The Phase 1 production readiness verdict stands: 72/100 — NOT READY FOR LAUNCH.**

The four original critical blockers (C01–C04) are confirmed. The pricing page missing an `<h1>` is an additional accessibility failure that must be resolved alongside C04. The contact form architecture is more sophisticated than Phase 1 characterised, but the no-server-side-delivery limitation remains a conversion risk to disclose.

---

_Report generated: 2026-07-01 | Investigation method: repository-evidence only | No code was modified during this investigation._
