# PRODUCTION EXECUTION PLAN

## Orviontech — Saral Banker & Jatin Basantani

**Generated:** 2026-07-02  
**Method:** 5-subagent parallel tribunal + Chief Architect synthesis  
**Scope:** Every finding filtered through business impact → engineering cost → maintenance cost → ROI

---

## 1. EXECUTIVE SUMMARY

Five areas of investigation revealed a common pattern: the site's visual and engineering quality significantly outpaces its content credibility and conversion infrastructure. The portfolio works as a visual demo. It does not yet function as a business development tool.

**The three changes that move the needle most before any sharing or outreach:**

1. **Remove all placeholder testimonials** — code confirms they are fabricated. A single discovered fake quote eliminates all other trust signals on the site.
2. **Create `/public/og-image.png`** — every URL on the site references this file for social previews. It does not exist. Every LinkedIn/X/Discord share of any page currently shows a broken image.
3. **Fix the contact form to actually deliver messages** — the form triggers `openCompose()` which opens the visitor's local email client. On a significant fraction of mobile devices (no configured mail app) and corporate networks (blocked mailto:), nothing happens. The primary conversion mechanism silently fails.

**Secondary cluster that defines the professional ceiling:**

The hero paragraph says "Hi, we're Saral x Jatin" then immediately continues "I build software." The pricing page has no CTA to contact — only PDF downloads. The homepage stat "1 Paid contract, delivered duo" is displayed in the social-proof grid. These three together signal inexperience to exactly the hiring managers and clients the portfolio is built to attract.

**Everything else is real but second-order.** Fix the integrity issues, the broken form, and the missing OG image first.

---

## 2. OPPORTUNITY MATRIX

| #   | Description                                                                 | Business Impact | User Impact | Eng Cost | Maintenance Cost | Risk   | Confidence                               | Expected ROI |
| --- | --------------------------------------------------------------------------- | --------------- | ----------- | -------- | ---------------- | ------ | ---------------------------------------- | ------------ |
| A   | Remove placeholder testimonials                                             | Critical        | High        | Low      | None             | None   | Verified (code comment)                  | Very High    |
| B   | Create og-image.png (1200×630)                                              | High            | High        | Low      | None             | None   | Verified (file missing)                  | Very High    |
| C   | Fix contact form → backend endpoint                                         | High            | High        | Medium   | Low              | Low    | Verified (mailto only)                   | Very High    |
| D   | Add CSP header to vercel.json                                               | High            | None        | Low      | Low              | Low    | Verified (header absent)                 | High         |
| E   | Add error boundary around Outlet                                            | High            | Medium      | Low      | None             | None   | Verified (none present)                  | High         |
| F   | Remove "1 Paid contract" homepage stat                                      | High            | Medium      | Low      | None             | None   | Verified                                 | High         |
| G   | Calendar optional for non-project inquiries                                 | High            | High        | Low      | None             | Low    | Verified (hard guard in code)            | High         |
| H   | Add /contact CTA to pricing page per tier                                   | High            | High        | Low      | Low              | None   | Verified (PDF-only)                      | High         |
| I   | Remove personal Gmail addresses from contact page                           | Medium          | Medium      | Low      | None             | None   | Verified (3 emails exposed)              | High         |
| J   | Fix footer email as mailto link                                             | Medium          | Medium      | Low      | None             | None   | Verified (static text)                   | High         |
| K   | Preloader: skip on return visits (sessionStorage)                           | Medium          | High        | Low      | None             | None   | Verified (2.6s block)                    | High         |
| L   | Page transition: reduced-motion path + trim to 0.75s                        | Medium          | High        | Low      | None             | None   | Verified (no prefers-reduced-motion)     | High         |
| M   | Fix active nav for /work/$slug (prefix check)                               | Medium          | Medium      | Low      | None             | None   | Verified (exact match only)              | High         |
| N   | Add mobile contact CTA to header                                            | Medium          | Medium      | Low      | None             | None   | Verified (absent on mobile)              | High         |
| O   | Fix canvas unmount guard (fonts.ready + resize debounce)                    | Medium          | Medium      | Medium   | None             | Medium | Verified (React 19 StrictMode)           | Medium       |
| P   | InteractiveParticles2D: add visibility pause                                | Medium          | High        | Low      | None             | Low    | Verified (O(n²) at 60fps)                | High         |
| Q   | Add static prerendering (vite-react-ssg)                                    | High            | Low         | High     | Medium           | Medium | Verified (empty HTML shell)              | Medium       |
| R   | Create og-image per project (4 images)                                      | Medium          | Medium      | Low      | Low              | None   | —                                        | Medium       |
| S   | Fix duplicate H1 on about page                                              | Low             | Low         | Low      | None             | None   | Verified                                 | Medium       |
| T   | Add Person JSON-LD to about page                                            | Medium          | None        | Low      | Low              | None   | Verified (missing)                       | Medium       |
| U   | Add SoftwareApplication JSON-LD to project pages                            | Medium          | None        | Low      | Low              | None   | Verified (missing)                       | Medium       |
| V   | Remove fake activity logs (ProductPreview)                                  | High            | Low         | Low      | None             | None   | Verified (hardcoded fake)                | High         |
| W   | Remove fake terminal log simulator (about page)                             | High            | Low         | Low      | None             | None   | Verified (hardcoded fake)                | High         |
| X   | Add LinkedIn to footer and founder cards                                    | Medium          | Medium      | Low      | None             | None   | Verified (absent everywhere)             | High         |
| Y   | Resolve pronoun I vs We — pick one identity                                 | Medium          | Medium      | Low      | None             | None   | Verified (mixed throughout)              | High         |
| Z   | Remove unsupported skills from marquee (Flutter, WordPress, Shopify, WebGL) | Medium          | Medium      | Low      | None             | None   | Verified (no project evidence)           | Medium       |
| AA  | /work scroll restoration on browser back                                    | Medium          | High        | Medium   | Low              | Low    | Verified (scrollRestoration: false)      | Medium       |
| AB  | Enable noUnusedLocals + ESLint no-unused-vars                               | Low             | None        | Low      | None             | None   | Verified (both disabled)                 | Low          |
| AC  | Add InteractiveParticles2D DPR scaling                                      | Low             | Medium      | Low      | None             | None   | Verified (1× on retina)                  | Medium       |
| AD  | NeuroDashboard GitHub link: resolve repo name mismatch                      | Medium          | Low         | Low      | None             | None   | Verified (neuro-zenith ≠ NeuroDashboard) | Medium       |
| AE  | Shade Ledger case study: add problem, role, evidence                        | Medium          | Low         | Medium   | None             | None   | Verified (only "what it does")           | Medium       |
| AF  | About timeline final entry → "Available Now"                                | Low             | Low         | Low      | None             | None   | Inferred                                 | Low          |
| AG  | International pricing note on pricing page                                  | Low             | Low         | Low      | None             | None   | Verified (₹ only)                        | Low          |
| AH  | Add aria-pressed to /work filter buttons                                    | Low             | Medium      | Low      | None             | None   | Verified (absent)                        | Medium       |
| AI  | Sitemap: add lastmod + changefreq                                           | Low             | None        | Low      | None             | None   | Verified (missing)                       | Low          |
| AJ  | og:url missing from SEO.tsx and index.html                                  | Low             | None        | Low      | None             | None   | Verified (absent)                        | Low          |
| AK  | Mobile menu: add AnimatePresence transition                                 | Low             | Low         | Low      | None             | None   | Verified (instant render/remove)         | Low          |
| AL  | useInView: always call observer.disconnect() in cleanup                     | Low             | None        | Low      | None             | None   | Verified                                 | Low          |
| AM  | Remove dead ScrollTrigger import in CinematicHero                           | Low             | None        | Low      | None             | None   | Verified                                 | Low          |
| AN  | BigCTA: rewrite to active/confident copy                                    | Medium          | Medium      | Low      | None             | None   | Verified (passive)                       | Medium       |
| AO  | Move "What happens next" above form on contact page                         | Low             | Medium      | Low      | None             | None   | Inferred                                 | Low          |
| AP  | Add LenisProvider variable shadowing fix                                    | Low             | None        | Low      | None             | None   | Verified                                 | Low          |

---

## 3. VISITOR JOURNEY ANALYSIS

### Landing (direct URL / link share)

**Loss point:** Every social share of any Orviontech URL shows a broken OG image — `og-image.png` is referenced but does not exist in `public/`. First impressions on LinkedIn, X, and Slack are already broken before the visitor clicks. **(B — Critical)**

**Loss point:** The visitor's URL arrives at `<div id="root"></div>` for non-JS crawlers and AI systems. The site content is invisible to Perplexity, ChatGPT Search, Bing/Copilot, and many mobile browsers with JS disabled. **(Q — High)**

### Hero (first 5 seconds)

**Passes:** There is an `<h1 class="sr-only">` with a full value proposition sentence — good for accessibility and crawlers. A green dot + "Open to new projects" signal appears in the top bar (desktop only; hidden on mobile with `hidden sm:flex`).

**Loss point:** The hero intro opens with "Hi, we're Saral x Jatin" and the next line is "I build software that solves real problems." The pronoun switch (we → I) in the same paragraph is disorienting. A visitor needs to immediately understand: am I hiring one person or a studio? **(Y)**

**Loss point:** The hero METRICS grid includes "100% Built for production" — this is not a metric, it's a slogan. It wastes a metric slot and reads as filler next to real numbers. Replace with a substantive signal (e.g., "3 Active systems — still running in production"). **(F adjacent)**

**Loss point:** The ProductPreview component shows live activity logs: "Knowledge Hub indexed 312 documents - 2m ago", "Shade Ledger sent 18 invoices - 1h ago" — hardcoded strings presented as real-time data. Any visitor who inspects these notices they never change. Fabricated proof is worse than no proof. **(V — Integrity)**

**Loss point:** The two hero CTAs are "View Projects" (→ /work) and "Resume" (PDF download). Neither leads directly to `/contact`. A visitor ready to engage in the first 5 seconds has no single direct path to reach out. Consider adding a third CTA: "Start a project →" or a small "Let's talk" text link below the metrics.

**Pass:** The hero has solid visual quality, meaningful copy in the second paragraph, and real proof metrics (220+ units, 40+ hours). The CinematicHero canvas is performant and not blocking.

### Projects (/work, horizontal scroll, and case studies)

**Loss point:** The horizontal scroll showcase is the primary project display on the homepage. It is completely inaccessible to keyboard users and screen readers — slide links exist in the DOM but are off-viewport and only reachable by pointer. **(WCAG 2.1.1 violation)**

**Loss point:** Clicking "See Selected Work →" at the end of the horizontal scroll section navigates to `/work`, not `/contact`. After a visitor has seen three project demos and is at peak engagement, the CTA deepens browsing rather than converting.

**Loss point:** On `/work`, filter buttons have no `aria-pressed` — screen readers cannot determine which filter is active. **(AH)**

**Loss point:** The back-navigation experience is broken: after clicking into a case study and pressing Back, the visitor is returned to the top of `/work` (scroll position lost). With a 1.3s page transition on every route, rediscovering their previous position requires full re-scroll + two transition animations. **(AA)**

**Loss point:** NeuroDashboard's GitHub link points to `github.com/saralbanker/neuro-zenith` — a different name than the product. A hiring manager who clicks this sees either an unrelated repo or an early-stage skeleton, casting doubt on the "70k+ lines" claim. **(AD)**

**Loss point:** Shade Ledger is the only paid client work. Its case study contains only "What it does" and "How it works." There is no problem statement, no before/after, no role declaration, and no client quote. The most credible proof on the site is presented at minimum depth. **(AE)**

**Pass:** The `/work/$slug` pages have per-project SEO with unique titles and descriptions. The "Next projects" cross-link grid (2 projects shown) is good for navigation and internal linking.

### About Page

**Loss point:** The testimonials section header reads "A sample of what clients say once the system is live and running" — the code comment above it reads `// Placeholder content — swap these for real client quotes as they come in.` Fabricated testimonials presented as real client feedback is the single most damaging integrity issue on the site. **(A — Critical)**

**Loss point:** The About page contains a `TerminalLogSimulator` showing fake server logs cycling through `GET /api/v1/projects 200 OK - 12ms`. Any visitor with developer tools open sees static hardcoded strings. **(W — Integrity)**

**Loss point:** The skills marquee lists Flutter, WordPress, Shopify, and WebGL. None of the four projects use any of these. A technical interviewer will probe these and find nothing. **(Z)**

**Loss point:** GPA stats appear without a university name: "8.36 / 10 GPA" — unverifiable without an institution. This is easy to fix and makes the credential meaningful.

**Pass:** The dual-founder timeline is well-structured and the engineering credibility signals (GPA, code volume, chronological story) are present.

### Contact Page

**Loss point:** The form requires selecting a date from a booking calendar before submitting ANY inquiry type — including "Full-Time Role" (recruiter) and "Something Else." A recruiter who cannot figure out why the form won't submit will leave. **(G — Critical)**

**Loss point:** Submitting the form calls `openCompose()` — opening the visitor's local email client with a pre-filled draft. On iOS/Android without a configured mail app, and on corporate devices with blocked mailto: URIs, nothing happens. The form appears to submit but no message is sent. **(C — Critical)**

**Loss point:** The contact sidebar publicly displays three email addresses: `orvionstudio.co@gmail.com`, `saralbanker1@gmail.com`, `jatinbasantani861@gmail.com`. Displaying personal Gmail addresses in a professional studio context immediately contradicts the "product engineering studio" positioning. **(I)**

**Loss point:** The "What happens next" reassurance section (steps 01–03: reply, call, start) is rendered below the form at `mt-24` — it only reduces anxiety if a visitor scrolls past the form they've already submitted. Position it before the form. **(AO)**

**Pass:** The inquiry type segmentation (Website, Automation, Full-Time Role, etc.) is thoughtful and reduces form ambiguity. The 48-hour reply commitment is a strong trust signal — it just needs to be visible before submission.

### Conversion Close (BigCTA / Footer)

**Loss point:** The BigCTA copy reads: "If you've got something worth building, I'd like to hear about it — and help take it from idea to something running in production." The conditional "if" and "I'd like" position the visitor as the decision-maker and the studio as seeking permission. **(AN)**

**Loss point:** The footer displays `orvionstudio.co@gmail.com` as plain text — not a mailto link. The Mail icon next to it implies clickability. **(J)**

**Loss point:** No LinkedIn anywhere in the footer, dock, or founder cards. Hiring managers verify via LinkedIn before reaching out. Its absence creates friction at exactly the moment of final decision.

---

## 4. ENGINEERING IMPROVEMENTS

Only items with measurable production benefit, ordered by risk.

### Critical

**E1 — Add Content-Security-Policy header**  
`vercel.json` has HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy — but no CSP. Add to the global headers array:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'"
}
```

The inline theme hydration script in `index.html` requires `'unsafe-inline'` for now — acceptable for a static portfolio with no user-generated content.

**E2 — Add error boundary around `<Outlet />`**  
No `ErrorBoundary` exists anywhere in the component tree (`src/routes/__root.tsx`). Any unhandled render error — canvas crash, GSAP context failure, Lenis setup error — produces a blank white page with no recovery. Wrap the Outlet:

```tsx
// in __root.tsx
import { ErrorBoundary } from "react-error-boundary";
<ErrorBoundary
  fallback={
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Something went wrong — <Link to="/">go home</Link>
    </div>
  }
>
  <PageTransition>
    <Outlet />
  </PageTransition>
</ErrorBoundary>;
```

### High

**E3 — Fix `document.fonts.ready.then()` unmount guard in CinematicHero**  
`CinematicHero.tsx` lines 241–245: the font-ready callback fires after React 19 StrictMode's double-mount cleanup, calling `initParticles()` on a potentially detached canvas. Add a mounted flag:

```ts
let alive = true;
document.fonts.ready.then(() => {
  if (alive) initParticles();
});
return () => {
  alive = false;
  clearTimeout(resizeTimeout);
  ctx.revert();
};
```

**E4 — Clear resize debounce timeout on unmount**  
`CinematicHero.tsx` lines 305–311: `resizeTimeout` is declared inside the effect but never cleared in cleanup. Add `clearTimeout(resizeTimeout)` as the first line of the cleanup return.

**E5 — Add IntersectionObserver pause to `InteractiveParticles2D`**  
Currently runs 7,140 distance checks + canvas draws per frame continuously even when scrolled out of view. Add a visibility guard using the existing `useInView` hook. On mobile: reduce particle count to 80. Set `connectDist` threshold to 70px to reduce active pairs by ~40%.

### Medium

**E6 — Fix `useInView` observer cleanup**  
`useInView.ts` lines 32–36: when `triggerOnce=true`, the cleanup skips `unobserve`. Replace with `observer.disconnect()` unconditionally in all cleanup paths.

**E7 — Add DevicePixelRatio scaling to `InteractiveParticles2D`**  
`CinematicHero.tsx` already handles DPR correctly (lines 165–168). `InteractiveParticles2D.tsx` sets canvas width/height to CSS pixels, producing blurry output on all Retina/HiDPI screens. Apply the same `Math.min(window.devicePixelRatio || 1, 2)` pattern with `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`.

**E8 — Enable TypeScript unused-variable checking**  
`tsconfig.json` has `"noUnusedLocals": false` and `"noUnusedParameters": false`. ESLint has `"@typescript-eslint/no-unused-vars": "off"`. Both together mean dead imports and stale variables accumulate silently. Set both tsconfig flags to `true`. Set ESLint rule to `["warn", { "argsIgnorePattern": "^_" }]` to allow explicit ignores via underscore prefix.

**E9 — Resolve MagneticButton.tsx untyped spread**  
`MagneticButton.tsx` has `/* eslint-disable @typescript-eslint/no-explicit-any */` and `[key: string]: any` index signature on Props. Replace with `React.HTMLAttributes<HTMLElement>` spread. Replace `as any` ref casts with typed callback refs.

**E10 — Fix LenisProvider variable shadowing**  
`LenisProvider.tsx` line 27 declares `const [lenis, setLenis]`, line 33 declares `const lenis = new Lenis(...)`. Rename inner variable to `lenisInstance`.

### Low

**E11 — Remove dead ScrollTrigger import in CinematicHero**  
`CinematicHero.tsx` lines 3 and 8: imports and registers ScrollTrigger but uses no ScrollTrigger API. `LenisProvider.tsx` already registers it globally. Remove both lines.

**E12 — Add sitemap `<lastmod>` and `<changefreq>` to all URLs**  
`public/sitemap.xml` has only `<loc>` and `<priority>`. Add `<lastmod>2026-07-02</lastmod>` and `<changefreq>monthly</changefreq>` for dynamic content; `yearly` for static pages.

---

## 5. CONTENT IMPROVEMENTS

Only changes with direct credibility or conversion impact. No marketing fluff.

### Remove Fabricated Content (Non-Negotiable)

**C1 — Remove placeholder testimonials**  
`src/data/testimonials.ts` line 1 has the comment `// Placeholder content — swap these for real client quotes as they come in.` The About page renders these under "Client feedback." Replace the section with:

- One real, attributed quote from the Shade Ledger client (even paraphrased, with permission) with company type ("Mumbai-based property manager, 220 units")
- OR remove the section entirely and replace with a single case study callout: "Shade Ledger: 40+ hours of manual billing work eliminated per month — running since 2025"

**C2 — Remove fake ProductPreview activity logs**  
`CinematicHero.tsx` lines 414–416: hardcoded strings "Knowledge Hub indexed 312 documents - 2m ago" etc. never change and are visibly fake. Replace with a static code snippet showing an actual implementation detail (a real API response, a database query, a CI workflow step) — static evidence is more credible than animated fiction.

**C3 — Remove TerminalLogSimulator from About page**  
`about.tsx` cycles through fake server logs: `GET /api/v1/projects 200 OK - 12ms`. This is the highest-risk fabricated content: AI systems that index this will cite these fake metrics as facts (per the AI Constitution §8). Replace with a static, clearly-labeled architecture diagram or code block showing a real implementation decision.

### Fix Homepage Stats Grid

**C4 — Replace "1 Paid contract, delivered duo" stat**  
`index.tsx` line 468: the stat reads exactly as it is — one commercial client. Remove or replace with a depth metric: "1 Client system — live since 2025, zero outages" or "2 Production systems — 1+ year running without a complete rewrite."

**C5 — Replace "100% Built for production" hero metric**  
`CinematicHero.tsx` METRICS: "100% Built for production" is a slogan, not a metric. Replace with "3 Systems in production" or "0 Template deployments — every system custom-built."

### Strengthen Project Evidence

**C6 — Shade Ledger case study: add problem, role, and evidence**  
The only paid client case study contains only "What it does" and "How it works." Add three elements:

1. **The situation before:** "Manual Excel billing for 220 units across X buildings — 40+ hours per billing cycle, frequent disputes from calculation errors."
2. **My role:** "Designed the database schema, built the Node.js automation engine, integrated WhatsApp Business API for reminders, deployed on [host]."
3. **One engineering decision:** "WhatsApp over email for payment reminders because 92% open rate vs. ~20% for email in this client's tenant demographic."

**C7 — Resolve NeuroDashboard GitHub name mismatch**  
`projects.ts` links to `github.com/saralbanker/neuro-zenith` but the product is called "NeuroDashboard" everywhere. Either rename the repo to match (preferred) or add a note: "Repository: neuro-zenith (original dev name)." Hiring managers click this link and see a disconnect.

**C8 — Remove unsupported skills from the marquee**  
`about.tsx` SKILLS array lists Flutter, WordPress, Shopify, and WebGL/Three.js. None appear in any project tech stack. Remove them. Add skills actually demonstrated: pgvector, BullMQ, Socket.IO, Redis, react-pdf, WhatsApp Business API, GitHub Actions, Sentry/Prometheus (mentioned in NeuroDashboard description).

**C9 — Add university/institution name to GPA stats**  
"8.36 / 10 GPA" without a named institution is unverifiable. Name the institution and degree field. An engineering GPA from a reputable program is a genuine credential — present it as one.

**C10 — Rewrite BigCTA copy**  
Current: "If you've got something worth building, I'd like to hear about it — and help take it from idea to something running in production."  
Proposed: "Got a system to build? We take it from spec to production — database, backend, frontend, deployed. No shortcuts."  
Remove the conditional "if." Replace "I'd like" with a capability statement.

### Identity Clarity

**C11 — Resolve I vs. We identity throughout**  
The hero opens with "Hi, we're Saral x Jatin" then continues "I build software." The footer says "I design, build, and ship complete systems." The contact page says "Tell me about the project — I reply within 48 hours." Pick one:

- **Studio (We):** Replace all "I" in hero, footer, BigCTA, contact copy with "we." Retain dual-founder framing throughout.
- **Personal brand (I):** Lead with Saral's name as the primary identity. Jatin becomes a collaborator credit on specific projects.

The current mix means visitors cannot determine who they're actually hiring.

---

## 6. AI DISCOVERY IMPROVEMENTS

Only evidence-supported recommendations. Ordered by discoverability impact.

### Tier 1: Structural (Blocks Everything Downstream)

**AI1 — Static prerendering via vite-react-ssg**  
Every URL on the site delivers `<div id="root"></div>` to non-JS crawlers. AI retrieval systems (ChatGPT Search, Perplexity, Bing/Copilot, Claude web search) do not execute JavaScript. The sitemap lists 10 URLs; all 10 are empty to these systems. Install `vite-react-ssg`, configure it against the existing TanStack Router tree, and verify with:

```bash
curl https://orviontech/work/neurodashboard | grep -i neurodashboard
```

The project title must appear in the raw response. Note: Playwright is already a project dependency — a prerender CI step is a fallback option.

**AI2 — Create /public/og-image.png**  
Referenced on every page via `ogImage="https://orviontech/og-image.png"`. The file does not exist. Every social share produces a broken image preview. Create a 1200×630 PNG (Orviontech brand identity on dark background with tagline). This is 30 minutes of work with the highest surface-area impact of anything in this plan.

### Tier 2: Schema and Entity Graph

**AI3 — Complete the static Organization schema in index.html**  
The static shell already has an Organization JSON-LD (lines 36–56) — but it's missing `"url"`, `"description"`, `"areaServed"`, `"contactPoint"`, and `"sameAs"`. Add:

```json
{
  "url": "https://orviontech",
  "description": "Product engineering studio. We design, build, and ship complete software systems — automation, AI platforms, and production-grade web applications.",
  "areaServed": "Worldwide",
  "address": { "@type": "PostalAddress", "addressCountry": "IN" },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "orvionstudio.co@gmail.com",
    "contactType": "customer service"
  }
}
```

This is the only schema that lands in raw HTML — it matters more than the React-injected versions.

**AI4 — Add Person JSON-LD to about.tsx**  
The About page has zero structured data. It is the most entity-rich page on the site. Add two Person nodes:

```json
{
  "@type": "Person",
  "name": "Saral Banker",
  "jobTitle": "Product Engineer",
  "worksFor": { "@type": "Organization", "name": "Orviontech" },
  "knowsAbout": ["React", "Node.js", "PostgreSQL", "Redis", "AI systems", "BullMQ", "pgvector"],
  "sameAs": ["https://github.com/saralbanker"]
}
```

**AI5 — Add SoftwareApplication JSON-LD to work.$slug.tsx**  
Each project case study page has zero structured data. The existing `PROJECTS` data provides everything needed: `name`, `description`, `year`, `services` (→ keywords), `client`. Add a `SoftwareApplication` node per project, pulling from the route's matched project data.

**AI6 — Remove fabricated content before indexing**  
The AI Constitution (§8) explicitly warns: AI systems that index fake terminal logs and placeholder quotes cite them as facts. The TerminalLogSimulator (about.tsx) and fake ProductPreview activity (CinematicHero.tsx) must be removed before any prerendering ships. Fabricated specifics become embedded in AI knowledge bases.

### Tier 3: Meta and Crawl Signal

**AI7 — Fix duplicate H1 on About page**  
`about.tsx` renders two sequential `<RevealText as="h1">` elements. Make the first an `<h1>` and the second a `<span>` or `<p>` styled identically. Apply the same audit to `process.tsx` and `contact.tsx` which both use `as="h1"` on multiple RevealText components.

**AI8 — Add og:url to SEO.tsx and index.html**  
The `og:url` property is required by the Open Graph protocol as a canonical identifier. Without it, social scrapers use the browser URL — which in a SPA can be any navigation state. Add `ogUrl?: string` to `SEOProps`, emit `<meta property="og:url" content={ogUrl} />`, and pass the canonical URL from each route. Add to `index.html` static block: `<meta property="og:url" content="https://orviontech/" />`.

**AI9 — Add LinkedIn to entity sameAs once profiles are created**  
The AI Discovery Constitution (§12) flags this as Priority High. LinkedIn creates the bidirectional external corroboration that AI systems use to resolve entity confidence. Create profiles → add sameAs to Organization and Person JSON-LD.

---

## 7. PRODUCTION READINESS TASKS

**Remaining blockers before any active sharing or outreach:**

| #   | Task                                              | Status          | Blocker                                      |
| --- | ------------------------------------------------- | --------------- | -------------------------------------------- |
| PR1 | Create og-image.png                               | Missing         | All social shares show broken preview        |
| PR2 | Remove placeholder testimonials                   | Code-confirmed  | Integrity risk                               |
| PR3 | Remove fake ProductPreview activity logs          | Code-confirmed  | Integrity risk                               |
| PR4 | Remove TerminalLogSimulator from About            | Code-confirmed  | Integrity risk + AI indexing risk            |
| PR5 | Fix contact form → backend endpoint               | Code-confirmed  | Primary conversion mechanism fails on mobile |
| PR6 | Add CSP header to vercel.json                     | Verified absent | XSS exposure, security header audit failure  |
| PR7 | Add Error Boundary                                | Verified absent | Blank white page on any render crash         |
| PR8 | Remove personal Gmail addresses from contact page | Code-confirmed  | Professionalism signal                       |
| PR9 | Fix footer email → mailto link                    | Code-confirmed  | Non-functional contact affordance            |

These 9 items have zero dependencies on each other and can be executed in parallel. None requires more than 2 hours. Together they close every integrity issue, the primary security gap, and the primary conversion failure.

---

## 8. CONSOLIDATED IMPLEMENTATION BACKLOG

---

### P0 — CRITICAL BEFORE LAUNCH

**P0-1: Remove all placeholder testimonials**

- Objective: Eliminate fabricated social proof before any site is shared
- Expected Outcome: No fake quotes anywhere on the site; section replaced with real case study callout or real attributed quote
- Business Value: Integrity. One discovered fake quote destroys all other trust signals.
- Technical Value: None
- Estimated Effort: 1–2 hours
- Dependencies: None
- Success Criteria: `testimonials.ts` comment removed; all 6 placeholder quotes removed from DOM; section replaced with real content or hidden
- Priority: P0

**P0-2: Create /public/og-image.png (1200×630)**

- Objective: Fix broken OG image on all social shares
- Expected Outcome: Every shared Orviontech URL shows a proper preview card on LinkedIn, X, Discord, Slack, iMessage
- Business Value: All outreach shares currently show broken images — worst possible first impression for a design portfolio
- Technical Value: None
- Estimated Effort: 30 minutes
- Dependencies: None
- Success Criteria: `curl -I https://orviontech/og-image.png` returns 200; social debug tool shows correct preview
- Priority: P0

**P0-3: Remove fake ProductPreview activity logs**

- Objective: Eliminate hardcoded fake real-time data from hero section
- Expected Outcome: ProductPreview shows a static, clearly-labeled code/architecture example
- Business Value: Any developer who watches these strings never update will doubt all other claims
- Technical Value: None
- Estimated Effort: 1 hour
- Dependencies: Need replacement content (real code snippet or architecture diagram)
- Success Criteria: No hardcoded timestamp strings cycling through fake events
- Priority: P0

**P0-4: Remove TerminalLogSimulator from About page**

- Objective: Eliminate fake server logs before prerendering ships
- Expected Outcome: About page shows static, credible proof of engineering (real code, real architecture)
- Business Value: AI systems will index these fake logs as facts. Content liability.
- Technical Value: None
- Estimated Effort: 1–2 hours
- Dependencies: P0-3 (same pattern, do together)
- Success Criteria: No cycling fake server log strings on About page
- Priority: P0

**P0-5: Fix contact form → backend endpoint**

- Objective: Make the contact form reliably deliver messages
- Expected Outcome: Every form submission is received; visitor gets clear confirmation
- Business Value: The primary conversion mechanism silently fails on mobile. Every lost inquiry is a lost opportunity.
- Technical Value: Formspree/Resend free tier sufficient; no server infrastructure needed
- Estimated Effort: 3–4 hours
- Dependencies: None
- Success Criteria: Submit form on iOS Safari without a configured mail app → message received at studio email; visitor sees "Sent!" confirmation
- Priority: P0

**P0-6: Add CSP header to vercel.json**

- Objective: Close the only missing security header
- Expected Outcome: All security headers present; site passes securityheaders.com scan
- Business Value: Security audit tool results (used by clients and hiring managers) currently flag CSP as missing
- Technical Value: XSS mitigation
- Estimated Effort: 30 minutes
- Dependencies: None
- Success Criteria: `securityheaders.com` reports A grade; no browser console CSP violations
- Priority: P0

**P0-7: Add Error Boundary around Outlet**

- Objective: Prevent blank white page on any render crash
- Expected Outcome: Canvas, GSAP, or Lenis crashes show a friendly fallback with a home link
- Business Value: Currently any unhandled error loses the visitor permanently
- Technical Value: React 19 resilience
- Estimated Effort: 1 hour
- Dependencies: `react-error-boundary` package install
- Success Criteria: Deliberately throw in a child component → fallback renders; no white screen
- Priority: P0

**P0-8: Remove personal Gmail addresses from contact page**

- Objective: Show only the studio email publicly
- Expected Outcome: `contact.tsx` CONTACT_EMAILS array contains only `orvionstudio.co@gmail.com`; success state shows only studio email
- Business Value: Displaying personal Gmails undermines "professional studio" positioning immediately
- Technical Value: None
- Estimated Effort: 15 minutes
- Dependencies: None
- Success Criteria: No personal @gmail.com addresses visible in page source or rendered DOM
- Priority: P0

**P0-9: Fix footer email as mailto link**

- Objective: Make every email address on the site clickable
- Expected Outcome: Footer email wrapped in `<a href="mailto:orvionstudio.co@gmail.com">`
- Business Value: Non-functional contact affordance on every page
- Technical Value: None
- Estimated Effort: 15 minutes
- Dependencies: None
- Success Criteria: Clicking footer email opens mail client or triggers mailto handler
- Priority: P0

---

### P1 — HIGH ROI

**P1-1: Make booking calendar optional for non-project inquiry types**

- Objective: Reduce contact form abandonment for recruiters and general inquiries
- Expected Outcome: Calendar date only required when `inquiryType` includes "Contract Work" or "Freelance Project"
- Business Value: Recruiter outreach currently blocked by a mandatory date picker. Every "Full-Time Role" inquiry that fails here is a lost opportunity.
- Estimated Effort: 1 hour
- Dependencies: P0-5 (backend form)
- Success Criteria: Selecting "Full-Time Role" → form submits without selecting a date; selecting "Contract Work" → date still required
- Priority: P1

**P1-2: Add /contact CTA to each pricing tier**

- Objective: Create a conversion path from the pricing page
- Expected Outcome: Each pricing card has a secondary CTA: "Discuss this scope →" linking to `/contact?service=[type]`
- Business Value: Pricing page currently dead-ends at PDF download. Qualified visitors who read pricing and want to engage have no direct next step.
- Estimated Effort: 2 hours
- Dependencies: None
- Success Criteria: Every pricing card has both Download PDF and Discuss CTA; contact page pre-selects the service type via URL param
- Priority: P1

**P1-3: Remove "1 Paid contract" homepage stat**

- Objective: Replace the commercial inexperience signal with a depth metric
- Expected Outcome: Stat grid shows 4 credible metrics without the "1 paid contract" entry
- Business Value: The current stat tells clients exactly how commercially inexperienced the studio is. Remove or reframe as depth ("1 Client system — live since 2025, zero downtime incidents").
- Estimated Effort: 30 minutes
- Dependencies: None
- Success Criteria: No homepage stat that reads as single-client commercial history
- Priority: P1

**P1-4: Replace "100% Built for production" hero metric**

- Objective: Replace a slogan with a real signal
- Expected Outcome: The 4th METRICS slot in CinematicHero shows a genuine fact
- Business Value: Slogan metrics reduce credibility of the real metrics next to them
- Estimated Effort: 15 minutes
- Dependencies: None
- Success Criteria: All 4 METRICS are verifiable facts or direct outcomes
- Priority: P1

**P1-5: Preloader — skip on return visits**

- Objective: Stop blocking returning visitors for 3.4 seconds on every page load
- Expected Outcome: First visit: preloader plays once. All subsequent hard-reloads: content renders immediately.
- Business Value: Recruiters and clients who revisit the site to share a link or double-check details currently wait 3.4s every time.
- Estimated Effort: 1 hour
- Dependencies: None
- Success Criteria: `sessionStorage.getItem('preloaderSeen')` is set after first visit; subsequent loads skip the animation
- Priority: P1

**P1-6: Page transitions — add prefers-reduced-motion path, trim max to 0.75s**

- Objective: Stop blocking vestibular disorder users; reduce total browsing friction
- Expected Outcome: With reduced-motion OS preference: 150ms opacity crossfade. Standard: curtain trimmed to ≤0.75s total.
- Business Value: A 6-page browse session currently loses 8–10 seconds to transition animations. Standard session will feel noticeably faster.
- Estimated Effort: 1–2 hours
- Dependencies: None
- Success Criteria: With `prefers-reduced-motion: reduce` → no curtain animation; page content visible within 200ms
- Priority: P1

**P1-7: Fix active nav indicator for /work/$slug routes**

- Objective: Maintain nav location signal on case study pages
- Expected Outcome: "Work" nav item shows active pill when pathname starts with `/work`
- Business Value: Visitors arriving directly at a case study via shared link have no visual anchor in the site
- Estimated Effort: 15 minutes
- Dependencies: None
- Success Criteria: `pathname.startsWith('/work/')` → Work nav item shows active state; no false positives on other routes
- Priority: P1

**P1-8: Add mobile contact CTA to header**

- Objective: Surface primary conversion action on mobile
- Expected Outcome: Mobile header shows a "Talk →" pill between ThemeToggle and hamburger
- Business Value: Desktop shows a "Let's talk →" MagneticButton in the header. Mobile shows only the hamburger. Mobile traffic loses the primary CTA from every page.
- Estimated Effort: 30 minutes
- Dependencies: None
- Success Criteria: Mobile viewport header contains a tappable /contact link; desktop layout unchanged
- Priority: P1

**P1-9: Resolve I vs. We pronoun identity**

- Objective: Make the entity clear to every visitor
- Expected Outcome: Consistent "we/our" throughout all copy if studio framing is chosen; consistent "I/my" if personal brand
- Business Value: Mixed pronouns in the same hero paragraph create confusion about who is being hired
- Estimated Effort: 2–3 hours (audit all pages)
- Dependencies: None
- Success Criteria: Zero pronoun switches within a single page; hero, footer, BigCTA, contact all use same person
- Priority: P1

**P1-10: Add static prerendering (vite-react-ssg)**

- Objective: Make site content visible to AI crawlers, Perplexity, ChatGPT Search, Bing
- Expected Outcome: `curl https://orviontech/work/neurodashboard | grep neurodashboard` returns the project title in raw HTML
- Business Value: All AI discoverability work is irrelevant while the site delivers empty HTML to non-JS clients
- Technical Value: Enables schema, meta, and content to actually be indexed
- Estimated Effort: 4–6 hours (config + testing all 10 routes)
- Dependencies: P0-3, P0-4 (remove fake content before indexing)
- Success Criteria: All 10 sitemap URLs serve non-empty HTML with correct title tags in raw response
- Priority: P1

**P1-11: Fix canvas unmount guards (fonts.ready + resize debounce)**

- Objective: Prevent React 19 StrictMode double-mount from calling initParticles on detached canvas
- Expected Outcome: `alive` flag prevents post-unmount callback execution; `clearTimeout(resizeTimeout)` fires first in cleanup
- Business Value: Unpredictable hero particle behavior on initial load
- Estimated Effort: 30 minutes
- Dependencies: None
- Success Criteria: React DevTools in StrictMode shows no "setState on unmounted component" warnings on CinematicHero mount
- Priority: P1

**P1-12: Add IntersectionObserver visibility pause to InteractiveParticles2D**

- Objective: Stop continuous O(n²) computation when component is off-screen
- Expected Outcome: RAF loop pauses when component exits viewport; resumes on re-entry
- Business Value: Prevents scroll jank on mid-range Android devices during background sections
- Estimated Effort: 1 hour
- Dependencies: None
- Success Criteria: Chrome DevTools performance trace shows zero canvas paint when InteractiveParticles2D is off-screen
- Priority: P1

**P1-13: Add LinkedIn to footer dock and founder cards**

- Objective: Provide the verification path hiring managers expect
- Expected Outcome: Footer AnimatedDock includes LinkedIn icons for both founders; each About page founder card links to LinkedIn
- Business Value: Hiring managers verify via LinkedIn before reaching out. Absence raises doubt.
- Estimated Effort: 30 minutes (once profiles exist)
- Dependencies: LinkedIn profiles must be created first
- Success Criteria: Footer dock contains LinkedIn links; About founder cards link to profiles
- Priority: P1

---

### P2 — TIME PERMITTING

**P2-1: Complete Organization JSON-LD in index.html**

- Add `url`, `description`, `areaServed`, `address`, `contactPoint` to the existing static Organization schema

**P2-2: Add Person JSON-LD to about.tsx**

- Two Person nodes: Saral Banker and Jatin Basantani, with `knowsAbout`, `worksFor`, `sameAs`

**P2-3: Add SoftwareApplication JSON-LD to work.$slug.tsx**

- Pull from existing PROJECTS data: name, description, year, services → keywords, author → Organization

**P2-4: Fix duplicate H1 on About, Process, and Contact pages**

- Make second RevealText `as="p"` or `as="span"` styled identically to h1; one H1 per page

**P2-5: Remove unsupported skills from marquee**

- Remove Flutter, WordPress, Shopify, WebGL/Three.js from about.tsx SKILLS array
- Add actually-demonstrated skills: pgvector, BullMQ, Socket.IO, react-pdf, WhatsApp Business API

**P2-6: Fix /work scroll restoration on browser back**

- Write `sessionStorage.setItem('work-scroll', window.scrollY)` before leaving /work
- On WorkPage mount, read it back and call `lenis.scrollTo(saved, { immediate: true })`; clear after restore

**P2-7: Shade Ledger case study — add problem statement, role, and engineering decision**

- Three additions: situation before (manual Excel), Saral's specific role, one WhatsApp vs. email decision rationale

**P2-8: Resolve NeuroDashboard GitHub repo name mismatch**

- Rename `neuro-zenith` repo to `neurodashboard` OR add a note in the case study

**P2-9: Add institution name to GPA credentials on About page**

- Name the university and degree field for both founders

**P2-10: Add og:url to SEO.tsx and index.html static block**

- Add `ogUrl?: string` prop to SEOProps; emit `<meta property="og:url">` when provided

**P2-11: Add aria-pressed to /work filter buttons**

- `aria-pressed={filter === c}` on each filter button; `role="group"` wrapper with aria-label

**P2-12: Add AnimatePresence to mobile menu**

- Wrap mobile menu in AnimatePresence with 200ms opacity/y transition to match site motion language

**P2-13: Fix process steps opacity default**

- Change `className="opacity-50"` to `className="opacity-100"` as static default; apply starting opacity via `gsap.set()` inside effect so degraded (no-JS) state is fully visible

**P2-14: Move "What happens next" section above contact form**

- Relocate NEXT_STEPS from `mt-24` below the form to the right-hand sidebar above the booking calendar

**P2-15: Rewrite BigCTA copy**

- Replace conditional "if" framing with confident capability statement

**P2-16: Update About timeline 2026 entry to "Available Now"**

- Change `title: "Today"` to `title: "Available Now"` with copy that positions availability as an invitation

**P2-17: Add international pricing note**

- One line below pricing header: "International clients: rates quoted separately — reach out for a custom scope."

**P2-18: Enable noUnusedLocals + ESLint no-unused-vars**

- `tsconfig.json`: set both to `true`
- `eslint.config.js`: set to `["warn", { "argsIgnorePattern": "^_" }]`

**P2-19: Fix useInView observer cleanup**

- Replace conditional `unobserve` logic with unconditional `observer.disconnect()` in all paths

**P2-20: Add DevicePixelRatio scaling to InteractiveParticles2D**

- Apply same `Math.min(devicePixelRatio, 2)` + `ctx.setTransform(dpr, ...)` pattern used in CinematicHero

---

### P3 — FUTURE

**P3-1: Per-project OG images**

- Four 1200×630 PNGs (one per project) referenced from work.$slug.tsx
- Dependency: generic og-image.png (P0-2) must exist first

**P3-2: Add keyboard fallback for horizontal scroll section**

- Detect `prefers-reduced-motion` → render vertical card list instead of GSAP track
- Alternatively: arrow-key handler that programmatically advances the scroll tween

**P3-3: Add BreadcrumbList JSON-LD to project pages**

- `Home > Work > NeuroDashboard` schema on each case study
- Dependency: P1-10 (prerendering)

**P3-4: Create llms.txt**

- Plain-text index of the site's content structure for LLM-native crawlers
- Dependency: P1-10 (prerendering must ship first)

**P3-5: Add dock tooltip labels on hover**

- On mouse-enter of DockItem, render a Framer Motion label above the icon with `item.label`

**P3-6: Refactor CinematicHero into smaller modules**

- Extract `useParticleCanvas` hook, `Particle` class to `src/lib/particle.ts`, `ProductPreview` to its own file
- No user-visible benefit; maintenance-only

**P3-7: Remove dead ScrollTrigger import in CinematicHero**

- Two lines. Low priority because it has zero runtime impact.

**P3-8: Fix LenisProvider variable shadowing**

- Rename inner `const lenis` to `const lenisInstance`. Two-line fix, zero runtime impact.

**P3-9: Smart Parking and Carbon Compass — add honest scope framing**

- Add: "Built as a personal project in [year] — demonstrates X and Y" to set correct expectations for non-client work

---

## IMPLEMENTATION ROADMAP

Optimized for shipping, not perfection.

```
WEEK 1 — Close all integrity issues and production blockers
├── Day 1: P0-2 (og-image), P0-8 (emails), P0-9 (footer)   [< 2 hours]
├── Day 1: P0-1, P0-3, P0-4 (all fake content)             [3–4 hours]
├── Day 2: P0-5 (contact form backend)                      [3–4 hours]
├── Day 2: P0-6 (CSP), P0-7 (error boundary)               [1.5 hours]
└── End of Week: All P0 complete. Site is integrity-clean and forms work.

WEEK 2 — Fix conversion path and UX blockers
├── P1-1 (calendar optional), P1-2 (pricing CTA)           [3 hours]
├── P1-3, P1-4 (homepage stats), P1-9 (pronouns)           [3 hours]
├── P1-5 (preloader), P1-6 (page transitions)              [3 hours]
├── P1-7 (active nav), P1-8 (mobile CTA)                   [1 hour]
├── P1-11 (canvas unmount), P1-12 (particles pause)        [2 hours]
└── End of Week: Conversion path clean. UX blockers closed.

WEEK 3 — Content depth and discovery foundation
├── P1-10 (prerendering — vite-react-ssg)                  [5–6 hours]
├── P2-7 (Shade Ledger case study depth)                   [2 hours]
├── P2-8 (GitHub name mismatch)                            [30 min]
├── P2-5 (skills marquee cleanup)                          [30 min]
├── P1-13 (LinkedIn links, once profiles exist)            [30 min]
└── End of Week: AI discoverability enabled. Content credibility improved.

WEEK 4 — Schema, metadata, and polish
├── P2-1, P2-2, P2-3 (JSON-LD across all pages)           [4 hours]
├── P2-4 (H1 audit), P2-10 (og:url), AI6 (sitemap)       [2 hours]
├── P2-11 to P2-17 (remaining UX and copy polish)         [4 hours]
└── End of Week: Site is production-ready for active sharing and outreach.
```

**Metric for "done":** A hiring manager or prospective client who visits the site, browses two projects, reads pricing, and submits the contact form completes that journey without: encountering a broken image, reading a fake quote, hitting a dead CTA, or having their message silently lost. That is the bar. Ship when that bar is cleared.
