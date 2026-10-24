# SEO & AI Discoverability

## Implemented decisions only — no investigation history

---

## Technical SEO

### Canonical URLs

Every route renders a `<SEO canonical="https://orviontech/[path]" />` via `src/components/SEO.tsx`.

| Route                | Canonical                             |
| -------------------- | ------------------------------------- |
| /                    | https://orviontech/                    |
| /about               | https://orviontech/about               |
| /work                | https://orviontech/work                |
| /work/neurodashboard | https://orviontech/work/neurodashboard |
| /work/shade-ledger   | https://orviontech/work/shade-ledger   |
| /work/smart-parking  | https://orviontech/work/smart-parking  |
| /work/carbon-compass | https://orviontech/work/carbon-compass |
| /process             | https://orviontech/process             |
| /pricing             | https://orviontech/pricing             |
| /contact             | https://orviontech/contact             |

### Open Graph

All pages have:

- `og:type` = `"website"`
- `og:url` = canonical URL (resolved via `ogUrl ?? canonical` in SEO.tsx)
- `og:title` = page title
- `og:description` = page description
- `og:image` = `https://orviontech/og-image.png` (shared across all pages)

### OG Image

- File: `/public/og-image.png`
- Dimensions: 1200×630
- Size: 174KB
- Content: Dark background (#0C0C0C), brand pink (#C75B3A), "ORVIONTECH" wordmark, "We build software that _runs_ in production." in serif font
- Generated via: Playwright screenshot of HTML template

### Twitter/X Cards

- `twitter:card` = `"summary_large_image"` (all pages)
- Image: same og-image.png

### Meta descriptions (per page)

| Page        | Description                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- |
| /           | "Orviontech is a product engineering studio that builds complete, production systems..."             |
| /about      | "Meet the product engineers behind Orviontech. We build complete systems..."                         |
| /work       | "Selected projects by Orviontech — NeuroDashboard, Shade Ledger, Smart Parking, and Carbon Compass." |
| /work/$slug | Project description from `PROJECTS` data array                                                      |
| /process    | "How Orviontech builds. Our engineering process from scoping to deployment..."                       |
| /pricing    | "Transparent, fixed-fee pricing for website development, mobile apps, and SaaS..."                  |
| /contact    | "Start a project with Orviontech. Tell us what you're building..."                                   |

### Sitemap

Location: `/public/sitemap.xml`  
10 URLs, `lastmod: 2026-07-02`  
Changefreq: `monthly` for primary pages, `yearly` for case studies and process/contact.

### robots.txt

Location: `/public/robots.txt` (exists, contents not modified in this session).

---

## Structured Data (Schema.org)

### Implementation approach

Two-tier system:

1. **Static** (index.html) — visible to all crawlers including non-JS bots
2. **Dynamic** (SEO.tsx React component) — visible only to JS-capable crawlers

### Static schemas (index.html)

**WebSite** — enables sitelinks search, confirms canonical URL
**Organization** — studio entity with founders as members, contact point, sameAs GitHub links

Full schema values: see [`ENTITY_ARCHITECTURE.md`](ENTITY_ARCHITECTURE.md)

### Dynamic schemas (per page)

| Page        | Schema type                     | Key data                                            |
| ----------- | ------------------------------- | --------------------------------------------------- |
| /           | WebSite                         | Duplicate of static (completeness)                  |
| /about      | Person (Saral) + Person (Jatin) | jobTitle, worksFor, sameAs GitHub                   |
| /work/$slug | SoftwareApplication             | name, description, dateCreated, creator (Orviontech) |
| /process    | FAQPage                         | mainEntity from FAQS array (4 Q&A pairs)            |

### Critical gap

React-injected schemas are not in the initial HTML payload. Crawlers that don't execute JavaScript (~40–60%) see only the static schemas. Resolution: static prerendering (P3-2 in backlog). Until then, the studio-level identity (Organization + WebSite) is well-covered; individual persons and projects are partially covered.

---

## Per-Page SEO Titles

Pattern: `"[Page Name] — Orviontech"` for secondary pages.  
Homepage title: `"Orviontech — Product Engineers"` (in `index.html` and SEO component).

---

## AI Discoverability

### llms.txt

Location: `/public/llms.txt`  
Standard: llmstxt.org spec (plain text, markdown-adjacent)

**Sections:**

- Identity (studio, type, location, contact)
- Founders (names, titles, GitHub)
- Production Systems (all 4 projects with stack, metrics, repos)
- Services (4 service categories)
- Key Facts (proof metrics)
- Pages (all 6 routes with descriptions)

**Purpose:** AI crawlers (ChatGPT Browsing, Perplexity, Gemini, etc.) that don't execute JavaScript can read this file directly to understand the studio identity.

### Security headers

Added via `08516b6` — includes CSP, X-Frame-Options, and other standard headers.

---

## Internal Linking

### Cross-page CTAs (implemented)

- Hero → `/work` (primary CTA)
- StudioShowreel → `/work` (to be removed in P1)
- BigCTA → `/contact`
- Case studies → `/work` (breadcrumb)
- Case study → sibling case studies ("Next projects" section)
- About → `/contact` (closing CTA)
- Process → `/contact` (closing CTA)
- Footer: `/about`, `/process`, `/work`, `/contact`

### Cross-page CTAs (pending — P2 backlog)

- Work index → `/about` ("Meet the engineers →")
- About → `/process` ("See how we work →")
- Pricing → `/contact` (upgrade from text link to designed CTA block)
- Homepage BigCTA → `/pricing` ("Fixed-fee pricing available.")

---

## Open Gaps

| Gap                                  | Priority | Resolution             |
| ------------------------------------ | -------- | ---------------------- |
| No static prerendering               | P3       | vite-react-ssg         |
| No per-project OG images             | P3       | Playwright screenshots |
| No LinkedIn sameAs for founders      | P3       | When profiles exist    |
| No `logo` on Organization schema     | P3       | Add favicon URL        |
| Missing Pricing → Contact CTA weight | P2       | Designed CTA block     |
