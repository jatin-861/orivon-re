# AI Discovery Intelligence Constitution

### For the Orviontech product-engineering studio portfolio

> **Scope:** How modern AI discovery systems (ChatGPT Search, Claude web search, Gemini / Google AI Mode, Google AI Overviews, Perplexity, Microsoft Copilot, Deep Research systems) retrieve, rank, cite, summarize, and recommend engineering portfolios — and what the Orviontech site should do about it.
>
> **Subject entity:** Orviontech (studio) and its members **Saral Banker** (Product Engineer) and **Jatin Basantani** (Frontend & AI Systems Developer). The tribunal brief's "Mr. Winter" is a template placeholder; this document maps the framework onto the real entities present in the codebase.

---

## ⚠️ Verification status — read this first

This constitution is authored from **model knowledge (training cutoff January 2026)** combined with **direct inspection of this repository**. It was **not produced by live-fetching Tier‑0 provider documentation during this session.** That distinction matters and the brief demands I state it:

- Claims marked **[Repo‑Verified]** were confirmed by reading the actual files/build output in `/mnt/data/rj/orvion-port/orivon-re`. These are the most reliable statements here.
- Claims marked **[Tier‑0 / documented]** reflect publicly documented standards or provider statements as of the knowledge cutoff. **AI‑crawler behavior changes frequently — re‑verify against live docs before acting on the crawler‑specific items.**
- Claims marked **[Observed]**, **[Inferred]**, or **[Hypothesized]** are exactly that. Internal ranking/citation algorithms of these systems are **not public**; nobody outside those companies can state them as fact, and this document does not pretend to.

If you want, I can run live web verification on any specific high‑stakes claim (crawler JS behavior, `llms.txt` adoption, current schema handling) and cite the sources.

---

## 1. Executive Summary

**The single most important finding overrides everything else in this document.**

Orviontech is a **client-side-rendered (CSR) single-page application** (React 19 + Vite + TanStack Router). I confirmed by inspecting the build output that the shipped `dist/index.html` contains only:

```html
<body>
  <div id="root"></div>
</body>
```

**[Repo‑Verified]** There is no server-side rendering, no static prerendering, and no `dist/work/` directory — the case-study pages (`/work/neurodashboard`, `/work/shade-ledger`, etc.) are **not** emitted as HTML. `vercel.json` rewrites **every** path to that same empty shell. Per-route `<title>`, meta descriptions, and JSON-LD are injected by React **at runtime, after hydration**.

**Consequence:** any AI crawler or retrieval system that does **not** execute JavaScript sees an empty page with the homepage's metadata — for _every_ URL, including all the case studies that are the actual proof-of-work. All the entity structure, schema, and keyword optimization in the world is worthless if the HTML delivered to the retriever is a blank shell. **Rendering is the foundation. Everything else is a second-order concern.**

**The five moves that matter, in order:**

1. **Make content exist in HTML without JavaScript** — prerender/SSG every route. This is the ~80% lever. (§4, §9, §19, §20)
2. **Fix factual integrity** — the audit found placeholder testimonials presented as real client quotes, fake live metrics, and fake terminal logs. AI systems cite and repeat page claims; fabricated proof is both an E-E-A-T liability and a reputational/citation-accuracy risk. (§11, §14)
3. **Reinforce a consistent entity graph** — one canonical name, description, and identity for Orvion + both founders across the site and the external web (GitHub, LinkedIn, etc.). (§6, §7, §12)
4. **Ship durable, chunk-friendly authority content** — real case studies with real numbers, structured headings, and clean semantics. (§8, §11)
5. **Provide clean machine-readable surfaces** — valid sitemap, correct per-route metadata in the HTML, JSON-LD, working OG image, and an `llms.txt` (low-cost hedge, unproven upside). (§9, §10)

**Effort/impact reality:** Item 1 is a moderate engineering task (introduce prerendering to the Vite build) with the highest and most durable payoff. Items 2–5 are mostly content and configuration work.

---

## 2. Modern AI Discovery Landscape

Discovery is shifting from "ten blue links" to **answer synthesis with citations**. For a studio like Orvion, the relevant surfaces are:

| Surface                 | What it is                                                                       | How Orvion could appear                                                 |
| ----------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Google AI Overviews** | LLM summary above classic results                                                | Cited/summarized if in Google's index and deemed relevant/authoritative |
| **Google AI Mode**      | Full conversational search (Gemini)                                              | Same index dependence; more query fan-out                               |
| **ChatGPT Search**      | OpenAI's web-connected answers (`OAI-SearchBot` / uses Bing-derived + own crawl) | Retrieved if crawlable and relevant                                     |
| **Claude web search**   | Anthropic's web tool                                                             | Retrieved if crawlable (`ClaudeBot` / `Claude-User` respect robots)     |
| **Perplexity**          | Answer engine with heavy citation UI                                             | `PerplexityBot`; strong citation surface, good target                   |
| **Microsoft Copilot**   | Bing-grounded answers                                                            | Bing index dependence (`bingbot`)                                       |
| **Deep Research modes** | Multi-step agents (OpenAI/Gemini/Perplexity) that read many pages                | Rewards depth, structure, and readable HTML                             |

**[Tier‑0 / documented]** These providers publish crawler user-agents and honor `robots.txt`. **[Observed]** Their citation surfaces differ: Perplexity and ChatGPT Search cite sources prominently; AI Overviews cite more sparingly. **[Inferred]** For a small studio, **Perplexity and ChatGPT Search are the most attainable citation wins** because they surface sources explicitly and index the open web directly rather than only through a large incumbent index.

**Durable truth:** all of these systems can only cite what they can **fetch and parse**. That is why §1's rendering finding dominates.

---

## 3. Cross-System Architecture Comparison

A generalized pipeline that fits publicly described designs; **treat internals as [Inferred] unless marked otherwise.**

| Stage               | ChatGPT Search                  | Claude search               | Google AI Mode / Overviews                                | Perplexity           | Copilot                |
| ------------------- | ------------------------------- | --------------------------- | --------------------------------------------------------- | -------------------- | ---------------------- |
| Web index source    | Own crawl + Bing-derived (obs.) | Own crawl / search partners | Google index (Tier‑0: Google's own)                       | Own crawl + partners | Bing index (Tier‑0)    |
| JS rendering        | Limited/uncertain               | Limited/uncertain           | **Yes, Googlebot renders** (Tier‑0), deferred second wave | Limited/uncertain    | Bing renders (limited) |
| Query understanding | LLM rewrite/fan-out             | LLM rewrite                 | LLM fan-out ("query fan-out")                             | LLM rewrite          | LLM rewrite            |
| Retrieval           | Hybrid (keyword+semantic)       | Hybrid                      | Hybrid + Google ranking                                   | Hybrid               | Bing ranking           |
| Reranking           | Yes (obs.)                      | Yes (obs.)                  | Yes                                                       | Yes                  | Yes                    |
| Chunking            | Yes                             | Yes                         | Yes                                                       | Yes                  | Yes                    |
| Citation selection  | Explicit, few sources           | Explicit                    | Sparse                                                    | Explicit, many       | Explicit               |
| Synthesis           | LLM                             | LLM                         | Gemini                                                    | LLM                  | LLM (GPT-family)       |

**Similarities (high confidence):** all use LLM query understanding, retrieve over chunks, rerank, and synthesize with citations. All gate on **fetchability + parseability**.

**Differences (observed, not guaranteed):** index source, JS-rendering tolerance, and citation density. **The safe engineering posture is to assume the _least capable_ crawler — no JS execution — and serve complete HTML anyway.** That single assumption satisfies every system at once.

**Unknowns (explicitly):** exact reranking features, citation-selection thresholds, per-domain authority weighting, and how much structured data influences any of them. Not public. Not guessed here.

---

## 4. Retrieval Pipeline Analysis (and where Orvion breaks it)

Mapping the generic pipeline to Orvion's current reality:

| Pipeline stage     | What it needs                            | Orvion status                                          |
| ------------------ | ---------------------------------------- | ------------------------------------------------------ |
| **Fetch**          | HTML returned at the URL                 | ✅ returns 200                                         |
| **Parse/render**   | Content present in HTML (or JS rendered) | ❌ **[Repo‑Verified]** empty shell; content is JS-only |
| **Chunk**          | Clean headings, semantic sections        | ⚠️ audit found multiple/zero `<h1>`, heading skips     |
| **Embed/retrieve** | Real text to embed                       | ❌ nothing to embed pre-JS on subpages                 |
| **Rerank**         | Authority/relevance signals              | ⚠️ thin external signals                               |
| **Cite**           | Stable URL, quotable facts               | ⚠️ facts partly fabricated (audit C02/C03/N01)         |
| **Synthesize**     | Accurate, structured claims              | ⚠️ risk of repeating fake metrics                      |

**The break is at "Parse."** A retriever that doesn't run JS gets no case-study text to chunk or embed. Fixing rendering unblocks the entire downstream pipeline at once. This is why the roadmap (§20) front-loads it.

---

## 5. Search Intent Database

Intent clusters a studio like Orvion should own, with the query rewriting these systems likely perform **[Inferred]**:

| Cluster                     | Example user queries                                                                           | Likely LLM rewrite                                       | Target page                   |
| --------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------- |
| **Hiring / commercial**     | "studio to build a production SaaS from scratch", "hire product engineers who ship end to end" | "full-stack product engineering studio + region + stack" | Home, About, Contact          |
| **Capability**              | "who can build a RAG platform on pgvector", "team that does React + Node + Postgres"           | "engineers with RAG/pgvector production experience"      | `/work/neurodashboard`, About |
| **Proof / case study**      | "example of automated billing system for rental units"                                         | "case study rental billing automation"                   | `/work/shade-ledger`          |
| **Comparison**              | "boutique studio vs agency vs freelancer for MVP"                                              | "compare small engineering studio tradeoffs"             | About, Process, Pricing       |
| **Pricing / transactional** | "cost to build a custom SaaS", "website development pricing"                                   | "software development pricing ranges"                    | `/pricing` + the pricing PDFs |
| **Navigational**            | "Orviontech", "Saral Banker portfolio"                                                          | brand/person lookup                                      | Home, About                   |
| **Informational**           | "how a product engineering studio ships end to end"                                            | educational                                              | Process, blog (to build)      |

**Actionable read:** Orvion already has strong _proof_ and _pricing_ assets (real projects, four pricing PDFs). The gap is that **AI systems can't read the proof pages (CSR)** and there is **no informational content** to win the top-of-funnel informational cluster. Both are fixable (§19).

---

## 6. Entity Intelligence Framework

AI systems build confidence in an entity through **consistency and corroboration** across sources **[Observed / E-E-A-T-aligned]**. The levers:

- **Name/identity consistency** — exact same studio name, person names, roles, and one-line description everywhere. Inconsistency ("Orvion" vs "Orivon" vs "Orviontech") fragments the entity. _(Note: repo/dir is `orivon-re` and a prior commit fixed a brand typo — guard this actively.)_
- **`sameAs` corroboration** — link the entity to its authoritative profiles (GitHub, LinkedIn, Crunchbase, X) so systems can resolve one identity across the web.
- **Topical authority** — repeated, substantive coverage of a coherent topic set (product engineering, RAG, full-stack delivery) beats scattered keywords.
- **Relationship graph** — Person ↔ Organization ↔ Project ↔ Technology links, expressed in schema and in prose.

**Evidence caution:** that Google _documents_ E-E-A-T in its rater guidelines is Tier‑0; that any given AI system _mechanically_ rewards it is **[Observed/Inferred]**, not proven. Treat these as robustness plays, not guaranteed ranking factors.

---

## 7. AI Entity Graph for Orvion (mapping the "Mr. Winter" request)

Target semantic graph to express in schema (§10) and in prose across the site:

```
Organization: Orviontech  (@id https://orviontech/#org)
├─ description: "Product-engineering studio: designs, builds, and ships
│               complete production systems, database to deployment."
├─ member → Person: Saral Banker (Product Engineer)  #person-saral
│    ├─ knowsAbout: product engineering, full-stack, Node.js, PostgreSQL, RAG/pgvector, systems design
│    └─ sameAs: github.com/saralbanker, LinkedIn (add), X (add)
├─ member → Person: Jatin Basantani (Frontend & AI Systems Developer)  #person-jatin
│    ├─ knowsAbout: frontend, React, AI systems, UI engineering
│    └─ sameAs: github.com/jatin-861, LinkedIn (add)
├─ makesOffer → Service: SaaS/Custom Software, Web Dev, Mobile App Dev  (see pricing PDFs)
└─ produces → CreativeWork/SoftwareApplication:
     ├─ NeuroDashboard  (AI platform; RAG/pgvector; React/Node/Postgres/Redis/Socket.IO)
     ├─ Shade Ledger    (billing automation; 220 rental units)
     ├─ Smart Parking
     └─ Carbon Compass
```

- **Primary entity:** Organization `Orviontech`.
- **Supporting entities:** the two Person members; the four Projects; the Service offerings.
- **Expertise graph:** `knowsAbout` on each Person + `about`/`keywords` on each project page.
- **Technology graph:** map each project to its stack (already in `src/data/projects.ts` — surface it as schema + visible text).
- **Company graph:** `sameAs` to external profiles once they exist.

Each project page should carry its own `CreativeWork`/`SoftwareApplication` node with `author`/`creator` → the Organization, `datePublished`, `keywords`, and a stable canonical URL — **rendered into HTML, not injected by JS.**

---

## 8. Citation Intelligence Framework

Why a synthesizer picks one source over another. Honestly tiered:

**Verified prerequisites (necessary, not sufficient) — [Repo‑Verifiable / logical]:**

- The page must be **fetchable** (not blocked) and **parseable** (content in HTML). Non-negotiable.
- A **stable, canonical URL** to cite.

**Observed factors — [Observed across multiple public analyses; not provider-confirmed]:**

- **Direct answer + evidence density** — pages that state a specific, quotable fact ("automated billing for 220 rental units") are more citable than vague prose.
- **Structure/chunk quality** — clear `<h1>/<h2>`, short factual paragraphs, lists, and tables chunk cleanly.
- **Topical focus** — a page about one thing outperforms a page about everything.
- **Originality/first-hand data** — real numbers and real project detail are more citable than restated generalities.
- **Corroboration** — claims echoed on GitHub/LinkedIn raise confidence.

**Unknown / not public:** exact citation thresholds, per-domain authority weights, freshness half-life, how much JSON-LD moves citation probability. Do not optimize as if these are known.

**Direct implication for Orvion:** fabricated metrics (audit C03) are the _worst_ case — they are quotable and specific, so a synthesizer may repeat them verbatim as if true. Replace with real, defensible numbers before inviting citation.

---

## 9. AI Crawling & Indexing Research

**[Tier‑0 / documented] — re-verify live before acting:**

- Major AI crawlers publish user-agents and honor `robots.txt`: `Googlebot`, `Google-Extended` (controls Gemini/Vertex training use, not Search indexing), `OAI-SearchBot` + `GPTBot` (OpenAI), `ClaudeBot` + `Claude-User` (Anthropic), `PerplexityBot`, `bingbot`, `Amazonbot`, `Bytespider`.
- **Googlebot renders JavaScript** (Tier‑0, Google docs) but on a **deferred second-wave** basis and with a crawl/render budget. AI Overviews and AI Mode draw from Google's index.
- **Most non-Google AI crawlers do limited or no JS rendering** — **[Observed/Inferred]**, and the safe assumption regardless.

**Orvion current state — [Repo‑Verified]:**

- `robots.txt`: `User-agent: * / Allow: /` + sitemap reference. Fine, but note the audit (R06) flagged the sitemap missing from build output in a prior state — it **is** present in `dist/` now; keep it that way.
- `sitemap.xml`: valid, 10 URLs. Good. Consider adding `<lastmod>`.
- **No `llms.txt`.** **[Hypothesized]** `llms.txt` is a _proposed_ convention (2024), **not an adopted standard**, and there is **no confirmed evidence** major AI search systems consume it for retrieval today. Treat as a cheap hedge with unproven upside and low durability — add it, but don't rely on it.
- **CSR is the crawl-killer** (§1). Sitemap lists `/work/neurodashboard` etc., but all resolve to the same empty shell pre-JS.

**Verified fix priority:** prerender → correct per-route HTML metadata → `lastmod` in sitemap → `llms.txt` (last, optional).

---

## 10. Technical SEO Framework

Split by what serves traditional crawlers vs. AI retrieval. Most items serve **both**, but the _reason_ differs.

| Item                                  | Orvion status                                                          | Traditional SEO impact       | AI retrieval impact                    |
| ------------------------------------- | ---------------------------------------------------------------------- | ---------------------------- | -------------------------------------- |
| **Content in HTML (SSR/SSG)**         | ❌ CSR **[Repo‑Verified]**                                             | High (JS-render budget risk) | **Critical** (no-JS crawlers)          |
| **Per-route `<title>`/meta in HTML**  | ⚠️ JS-only                                                             | High                         | High (identity/snippet)                |
| **JSON-LD (Org/Person/CreativeWork)** | ⚠️ static Org in shell; per-route JS-only                              | Medium                       | Medium **[Observed]** (entity clarity) |
| **Open Graph image**                  | ❌ `og-image.png` missing/returns HTML (audit R05)                     | Medium (share cards)         | Low-Med                                |
| **Semantic HTML + heading hierarchy** | ❌ multi/zero `<h1>` (audit C04)                                       | Medium                       | **High** (chunking)                    |
| **Canonical URLs**                    | ⚠️ verify per-route                                                    | Medium                       | Medium                                 |
| **Sitemap w/ lastmod**                | ⚠️ present, no lastmod                                                 | Medium                       | Medium                                 |
| **Core Web Vitals**                   | ❌ FCP 4.2s/LCP 5.1s (audit R01/R02)                                   | Medium                       | Low-Med (fetch budget)                 |
| **Internal linking**                  | ⚠️ verify crawlable `<a href>` (audit R07 found an uncrawlable anchor) | Medium                       | Medium                                 |

**Key nuance:** React 19 _does_ hoist `<title>`/`<meta>`/`<link>` and JSON-LD to `<head>` — but **only after the component renders in a JS runtime.** For a no-JS crawler that changes nothing. The fix is prerendering, which makes the hoisted tags land in the static HTML at build time.

---

## 11. Content Authority Framework

Which content builds **durable** authority (survives algorithm changes):

| Content type                                    | Durability   | Why it matters for AI                      | Orvion action                                                                                                |
| ----------------------------------------------- | ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Real case studies w/ numbers + architecture** | **High**     | First-hand, quotable, topical              | Expand the 4 projects into deep, honest case studies (problem → architecture → decisions → measured outcome) |
| **Engineering blog / technical notes**          | **High**     | Wins informational intent; earns citations | **Missing — highest-value new content.** Write on RAG/pgvector, shipping end-to-end, billing automation      |
| **About / expertise pages**                     | High         | Entity + E-E-A-T                           | Real bios, real `knowsAbout`, links out                                                                      |
| **Process / methodology**                       | Medium       | Comparison intent                          | Already present; keep concrete                                                                               |
| **Pricing**                                     | Medium-High  | Transactional intent                       | Strong asset (4 PDFs); also expose as HTML, not just PDF                                                     |
| **READMEs on linked GitHub repos**              | Medium-High  | External corroboration; crawlable          | Make `neuro-zenith` README a real project writeup                                                            |
| **Fabricated testimonials / metrics / logs**    | **Negative** | Citation of false claims; E-E-A-T risk     | **Remove or make real** (audit C02/C03/N01)                                                                  |

**Durable principle:** authority compounds from **first-hand, specific, verifiable** content. Orvion's real projects are its moat — the failure is that they're (a) unreadable to crawlers and (b) mixed with fabricated proof that undermines trust.

---

## 12. External Entity Ecosystem Strategy

Authority compounds across corroborating profiles **[Observed / entity-resolution logic]**. Current state **[Repo‑Verified]**: only `github.com/saralbanker` and `github.com/jatin-861` are linked (`sameAs`).

| Platform                            | Role in entity graph                 | Priority for Orvion                                                                       |
| ----------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| **GitHub**                          | Proof-of-work; crawlable READMEs     | High — turn project repos into real writeups; pin them                                    |
| **LinkedIn**                        | Person/Org resolution; hiring intent | High — create/complete Org + both Person profiles; mirror the site's one-line description |
| **Crunchbase / company registries** | Org entity in knowledge graphs       | Medium — establishes Org as a real entity                                                 |
| **DEV / Medium / personal blog**    | Topical authority, citations         | Medium — cross-post engineering notes (canonical → orviontech)                             |
| **X / Bluesky**                     | Freshness, identity                  | Low-Medium                                                                                |
| **Stack Overflow**                  | Expertise signal                     | Optional                                                                                  |

**Rule:** every external profile should carry the **same** name, role, one-line description, and a link back to orviontech, and orviontech should `sameAs`-link out to them. Bidirectional, consistent corroboration is the whole game for entity confidence.

---

## 13. Competitive Intelligence

**[Observed]** patterns common to studio/engineer sites that get surfaced and cited by AI systems (stated as patterns, not proven causation):

- **Server-rendered or static HTML** — content readable without JS. (This is the recurring differentiator.)
- **Deep, specific case studies** with real metrics and architecture diagrams — high evidence density.
- **A real technical blog** answering informational queries — earns citations and topical authority.
- **Consistent entity presence** across GitHub/LinkedIn with matching descriptions.
- **Clean semantic structure** — one `<h1>`, logical `<h2>`s, lists/tables.
- **Structured data** (Organization/Person/Article) present in HTML.

**Honest caveat:** this is directional pattern-matching, not a controlled study. Avoid cargo-culting specific competitors' design. The _measurable_ commonality worth copying is **"content is in the HTML and it's specific and structured."** Orvion loses on the first clause today.

---

## 14. Verified AI Retrieval Signals

Classified per the brief. **"Verified" here means logically necessary or Repo/Tier‑0-grounded — not "confirmed inside a provider's ranker."**

| Signal                                        | Class                    | Notes                                      |
| --------------------------------------------- | ------------------------ | ------------------------------------------ |
| Page is fetchable (not blocked)               | **Verified**             | Necessary precondition                     |
| Content present in HTML w/o JS                | **Verified (necessary)** | [Repo‑Verified] Orvion fails this          |
| Stable canonical URL                          | **Verified (necessary)** | Needed to cite                             |
| Not fabricated / factually consistent         | **Verified (risk)**      | False specifics get repeated               |
| Clean heading/semantic structure              | **Observed**             | Improves chunking                          |
| Specific, quotable facts / evidence density   | **Observed**             | Raises citation probability                |
| Topical focus & consistency                   | **Observed**             | Entity/authority                           |
| External corroboration (sameAs)               | **Observed**             | Entity resolution                          |
| JSON-LD structured data                       | **Observed (mixed)**     | Clarifies entities; citation lift unproven |
| Freshness / lastmod                           | **Observed**             | Matters more for time-sensitive queries    |
| `llms.txt` present                            | **Hypothesized**         | No confirmed consumption by major systems  |
| Core Web Vitals                               | **Observed (indirect)**  | Affects crawl/render budget & UX           |
| Exact reranker features / citation thresholds | **Unknown**              | Not public — do not optimize blindly       |

---

## 15. Traditional SEO vs AI Discovery Matrix

| Factor             | Traditional SEO                    | AI Discovery                               | Divergence                                |
| ------------------ | ---------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Rendering          | Googlebot can render JS (budgeted) | Many AI crawlers can't                     | **AI is stricter — serve HTML**           |
| Keywords           | Match + intent                     | Semantic meaning > exact tokens            | Write for meaning, not density            |
| Backlinks          | Core ranking signal                | Corroboration/authority input              | Both value real references                |
| Structured data    | Rich results                       | Entity clarity (citation lift unproven)    | Do it; don't overclaim                    |
| Content depth      | Ranks pages                        | Feeds chunk-level citation                 | AI rewards **quotable specifics**         |
| Freshness          | Query-dependent                    | Query-dependent                            | Similar                                   |
| Click-through      | The goal                           | **Zero-click** — being _cited_ is the goal | Optimize to be _quoted_, not just clicked |
| Fabricated content | Trust risk                         | **Amplified** (repeated as fact)           | AI raises the stakes on honesty           |

**Takeaway:** AI discovery is _stricter on rendering and honesty_ and _rewards quotable specificity_. It does not replace SEO fundamentals — it raises the floor.

---

## 16. Evidence Classification Matrix

| Domain                                | Best evidence available                   | Class                           |
| ------------------------------------- | ----------------------------------------- | ------------------------------- |
| Orvion is CSR / empty-shell HTML      | Direct build inspection (this repo)       | **Repo‑Verified**               |
| No prerendered `/work/*` pages        | `dist/` listing                           | **Repo‑Verified**               |
| Fabricated testimonials/metrics/logs  | Prior audit reports in repo (C02/C03/N01) | **Repo‑Verified (via audit)**   |
| Crawler user-agents & robots honoring | Provider docs (cutoff)                    | **Tier‑0 (re-verify)**          |
| Googlebot renders JS (deferred)       | Google docs                               | **Tier‑0 (re-verify)**          |
| Generic RAG/retrieval pipeline        | IR/RAG literature                         | **Tier‑0/1 (well-established)** |
| Citation-selection specifics          | Third-party analyses                      | **Observed**                    |
| `llms.txt` consumption by AI search   | Proposal only                             | **Hypothesized**                |
| Internal rankers/thresholds           | —                                         | **Unknown**                     |

---

## 17. Unknowns & Research Gaps

Stated plainly, as the brief requires:

1. **JS-rendering tolerance per AI crawler** — changes over time; verify with live tests/docs, not assumptions.
2. **Whether/how much JSON-LD lifts AI citation** — plausible for entity clarity; **not proven**.
3. **`llms.txt` real-world consumption** — unconfirmed for retrieval by major systems.
4. **Citation-selection thresholds & per-domain authority weighting** — not public.
5. **Freshness half-life** for evergreen technical content — unknown.
6. **How Deep Research agents weight depth vs. breadth** — observed to reward depth; not quantified.

**Recommended empirical work (cheap, high-value):** after prerendering ships, (a) fetch each URL with `curl` and confirm content is in the HTML; (b) test the live site in ChatGPT Search / Perplexity / Google AI Mode with the §5 queries and record whether/how Orvion is cited; (c) re-test quarterly. This turns unknowns into your own first-hand evidence.

---

## 18. AI Search Optimization Constitution (durable principles)

Principles designed to outlast any specific engine:

1. **Serve complete, truthful HTML at every URL.** If a crawler that runs no JS can't read it, assume it doesn't exist.
2. **One entity, one story, everywhere.** Consistent name, role, description across site + external profiles.
3. **Be specific and first-hand.** Real numbers, real architecture, real outcomes. Specific + true = citable.
4. **Never fabricate.** AI amplifies false specifics by repeating them as fact. Honesty is an AI-discovery feature, not just ethics.
5. **Structure for chunking.** One `<h1>`, logical `<h2>`s, short factual paragraphs, lists, tables.
6. **Make machines' jobs easy.** Valid sitemap, canonical URLs, JSON-LD entities, working OG image, clean internal `<a href>` links.
7. **Corroborate externally.** Bidirectional `sameAs` with GitHub/LinkedIn/etc.
8. **Optimize to be quoted, not just clicked.** In a zero-click world, the citation is the win.
9. **Measure, don't assume.** Verify crawler behavior and citation outcomes empirically; treat unknowns as unknown.
10. **Prefer durable architecture over tactics.** Rendering, honesty, structure, and consistency survive algorithm changes; keyword tricks don't.

---

## 19. Portfolio Optimization Blueprint (Orvion-specific)

Concrete changes mapped to this codebase:

**A. Rendering (foundation)**

- Add **static prerendering / SSG** to the Vite build so every route in `sitemap.xml` emits real HTML with content + per-route `<head>`. Options: `vite-react-ssg`, a prerender plugin, or a small Playwright-based prerender step in CI (Playwright is already a dep). Verify success with `curl https://orviontech/work/neurodashboard | grep -i neurodashboard` returning body content, not just meta.

**B. Metadata correctness (depends on A)**

- Ensure each page's `SEO.tsx` output lands in the **static** HTML: unique `<title>`, description, canonical, and per-page JSON-LD (`CreativeWork`/`SoftwareApplication` for projects, `Person` for founders, `Organization` sitewide).
- Fix `og-image.png` (audit R05): ship a real static PNG that is **not** caught by the SPA rewrite.

**C. Factual integrity (do before inviting citations)**

- Replace placeholder testimonials with real, attributed ones or remove them (C02).
- Remove fake live metrics (C03) and fake terminal logs (N01); use honest static values or clearly framed illustrations.

**D. Structure & accessibility (helps chunking + CWV)**

- Exactly one `<h1>` per page; fix heading skips and the zero-`<h1>` `/pricing` page (C04); fix the uncrawlable anchor (R07).
- Address CWV: consolidate fonts to one provider/self-host (R01/R02); fix contrast (R03); replace the mislabeled favicon (R04).

**E. Entity & external graph**

- Expand `Organization`/`Person` JSON-LD per §7; add `knowsAbout`, `makesOffer`, `produces`.
- Create/complete LinkedIn (Org + both founders) and add all `sameAs` links bidirectionally; turn GitHub project READMEs into real writeups.

**F. Authority content (compounding)**

- Deepen the 4 case studies (problem → architecture → decisions → measured result).
- Launch a small **engineering blog** (RAG/pgvector, shipping end-to-end, billing automation) — HTML, structured, honest.
- Expose pricing as crawlable **HTML** in addition to the PDFs.

**G. Machine surfaces (cheap hedges)**

- Add `<lastmod>` to `sitemap.xml`; add an `llms.txt` (index of key pages) as a low-cost, unproven hedge.

---

## 20. Prioritized Implementation Roadmap

Every item carries the six required attributes. **Do them roughly in order — later items depend on rendering (A).**

**P0 — Foundation (unblocks everything)**

1. **Prerender/SSG all routes (Blueprint A)**
   - Evidence: **Repo‑Verified** problem · Impact: **Very High** · Effort: **Medium** · Durability: **Very High** · Systems: **All** · Confidence: **High**
2. **Correct per-route metadata + JSON-LD in static HTML (B)**
   - Evidence: Repo‑Verified · Impact: High · Effort: Low-Med (after #1) · Durability: High · Systems: All · Confidence: High
3. **Fix fabricated content — testimonials/metrics/logs (C)**
   - Evidence: Repo‑Verified (audit) · Impact: High (trust/citation-accuracy) · Effort: Low-Med · Durability: High · Systems: All · Confidence: High

**P1 — Structure & correctness** 4. **Heading hierarchy + crawlable links (D)**

- Evidence: Repo‑Verified (audit) · Impact: Medium-High · Effort: Low · Durability: High · Systems: All · Confidence: Med-High

5. **Fix og-image + favicon + sitemap lastmod (B/G)**
   - Evidence: Repo‑Verified · Impact: Medium · Effort: Low · Durability: Medium · Systems: Social + AI · Confidence: High
6. **Core Web Vitals: fonts, contrast (D)**
   - Evidence: Repo‑Verified (audit R01–R03) · Impact: Medium · Effort: Medium · Durability: Medium · Systems: Google-leaning · Confidence: Med

**P2 — Authority & entity** 7. **Deepen case studies with real numbers/architecture (F)**

- Evidence: Observed · Impact: High · Effort: Medium · Durability: Very High · Systems: All (esp. Perplexity/ChatGPT) · Confidence: Med-High

8. **Entity graph expansion + external profiles/sameAs (E)**
   - Evidence: Observed · Impact: Medium-High · Effort: Medium · Durability: High · Systems: All · Confidence: Med
9. **Engineering blog (F)**
   - Evidence: Observed · Impact: High (long-term) · Effort: High (ongoing) · Durability: Very High · Systems: All · Confidence: Med

**P3 — Hedges & measurement** 10. **`llms.txt` (G)** — Evidence: Hypothesized · Impact: Low-Uncertain · Effort: Very Low · Durability: Low · Systems: Uncertain · Confidence: Low 11. **Empirical verification loop (§17)** — Evidence: creates first-hand evidence · Impact: High (de-risks everything) · Effort: Low · Durability: High · Systems: All · Confidence: High

---

## Final AI Visibility Blueprint

**For human decision-makers, AI retrieval, semantic search, citation systems, and future LLM discovery simultaneously — one coherent move set:**

> **Make every page truthful, complete, structured HTML that exists without JavaScript; back it with a single consistent entity identity corroborated across the web; fill it with first-hand, specific, quotable proof; and verify the results empirically.**

That sentence satisfies all five audiences at once:

- **Humans** get fast, honest, well-structured pages.
- **AI retrieval** gets fetchable, parseable content at every URL.
- **Semantic search** gets clear entities and topical focus.
- **Citation systems** get specific, quotable, _true_ facts at stable URLs.
- **Future LLM discovery** gets durable architecture (rendering + honesty + structure + consistency) that survives engine changes.

**The one thing to do first, above all else:** ship server-side rendering / static prerendering so the studio's real work stops being invisible to the machines now doing the recommending. Everything else in this constitution multiplies that fix — and is diminished without it.

---

_Prepared by direct inspection of the `orivon-re` repository plus model knowledge (cutoff Jan 2026). Crawler-specific and provider-specific claims should be re-verified against live Tier‑0 documentation before implementation; offer stands to run that verification on request._
