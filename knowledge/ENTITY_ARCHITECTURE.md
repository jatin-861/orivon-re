# Entity Architecture

## Schema.org implementation and knowledge graph strategy

---

## Canonical Entities

Three entities, three distinct scopes:

| Entity          | @type        | Canonical URL           | Primary audience            |
| --------------- | ------------ | ----------------------- | --------------------------- |
| Orvion.co       | Organization | https://orvion.co       | B2B clients, search engines |
| Saral Banker    | Person       | https://orvion.co/about | Recruiters, knowledge graph |
| Jatin Basantani | Person       | https://orvion.co/about | Recruiters, knowledge graph |

**Identity architecture decision:** Hybrid Authority with Studio-Primary Canvas (see Decision D-003).

---

## Schema Implementation Map

| Schema type              | Where                             | How injected      | Crawler visibility  |
| ------------------------ | --------------------------------- | ----------------- | ------------------- |
| WebSite                  | `index.html`                      | Static `<script>` | ALL crawlers ✅     |
| Organization             | `index.html`                      | Static `<script>` | ALL crawlers ✅     |
| WebSite (homepage)       | `routes/index.tsx` via `SEO`      | React-injected    | JS crawlers only ⚠️ |
| Person (Saral)           | `routes/about.tsx` via `SEO`      | React-injected    | JS crawlers only ⚠️ |
| Person (Jatin)           | `routes/about.tsx` via `SEO`      | React-injected    | JS crawlers only ⚠️ |
| SoftwareApplication (×4) | `routes/work.$slug.tsx` via `SEO` | React-injected    | JS crawlers only ⚠️ |
| FAQPage                  | `routes/process.tsx` via `SEO`    | React-injected    | JS crawlers only ⚠️ |

**Open gap:** ~40–60% of crawlers don't execute JavaScript. React-injected schemas are invisible to them. Resolution: static prerendering (P3-2 in backlog).

---

## Static Schemas (index.html)

These are the authoritative schemas visible to all crawlers.

### WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Orvion.co",
  "url": "https://orvion.co",
  "description": "Product engineering studio that builds complete, production systems — from database to deployment.",
  "publisher": {
    "@type": "Organization",
    "name": "Orvion.co",
    "url": "https://orvion.co"
  }
}
```

### Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Orvion.co",
  "url": "https://orvion.co",
  "description": "Product engineering studio that designs, builds, and ships complete production systems — from database to deployment.",
  "areaServed": "Worldwide",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "orvionstudio.co@gmail.com",
    "contactType": "customer service"
  },
  "sameAs": ["https://github.com/saralbanker", "https://github.com/jatin-861"],
  "member": [
    {
      "@type": "Person",
      "name": "Saral Banker",
      "jobTitle": "Full-Stack & AI Engineer",
      "sameAs": ["https://github.com/saralbanker"]
    },
    {
      "@type": "Person",
      "name": "Jatin Basantani",
      "jobTitle": "Frontend & AI Systems Developer",
      "sameAs": ["https://github.com/jatin-861"]
    }
  ]
}
```

**Note:** `member[0].jobTitle` must be `"Full-Stack & AI Engineer"` — not `"Product Engineer"` (P0-7 in backlog).

---

## Dynamic Schemas (React-injected via SEO.tsx)

### Person — Saral Banker (about.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Saral Banker",
  "jobTitle": "Full-Stack & AI Engineer",
  "worksFor": { "@type": "Organization", "name": "Orvion.co", "url": "https://orvion.co" },
  "url": "https://orvion.co/about",
  "sameAs": ["https://github.com/saralbanker"]
}
```

**Note:** `jobTitle` must be `"Full-Stack & AI Engineer"` — not `"Product Engineer"` (P0-7 in backlog).

### Person — Jatin Basantani (about.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jatin Basantani",
  "jobTitle": "Frontend & AI Systems Developer",
  "worksFor": { "@type": "Organization", "name": "Orvion.co", "url": "https://orvion.co" },
  "url": "https://orvion.co/about",
  "sameAs": ["https://github.com/jatin-861"]
}
```

### SoftwareApplication (work.$slug.tsx — per project)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[project.title]",
  "description": "[project.description]",
  "applicationCategory": "BusinessApplication",
  "dateCreated": "[project.year split on '–'][0]",
  "creator": {
    "@type": "Organization",
    "name": "Orvion.co",
    "url": "https://orvion.co"
  },
  "url": "[project.link if exists]"
}
```

### FAQPage (process.tsx)

Built from the `FAQS` array in `process.tsx`. The `mainEntity` array maps each FAQ to a `Question` + `Answer` pair.

### WebSite (homepage — routes/index.tsx)

Duplicate of the static WebSite schema; also emitted as dynamic schema for completeness on the homepage route. The static one in `index.html` is the authoritative version.

---

## Canonical Role Titles

These must be identical across all appearances in the repository:

| Person          | Canonical title                   | Must appear in                                                       |
| --------------- | --------------------------------- | -------------------------------------------------------------------- |
| Saral Banker    | `Full-Stack & AI Engineer`        | TEAM array, Person JSON-LD, index.html member, founder card subtitle |
| Jatin Basantani | `Frontend & AI Systems Developer` | TEAM array, Person JSON-LD, index.html member, founder card subtitle |

---

## AI Discoverability

### llms.txt

Location: `/public/llms.txt`  
Format: Plain text, llmstxt.org spec  
Purpose: Machine-readable studio identity for AI crawlers that don't execute JavaScript  
Contents: Studio identity, both founders with GitHub, all 4 projects with stack/metrics/repos, services, key stats, all page URLs

### robots.txt

Location: `/public/robots.txt`  
Status: File exists (contents not audited in this session).

### Sitemap

Location: `/public/sitemap.xml`  
10 URLs, all with `<lastmod>2026-07-02</lastmod>`  
Changefreq: `monthly` for homepage/about/work/pricing, `yearly` for case studies/process/contact

---

## Knowledge Graph Relationships

```
Orvion.co (Organization)
  ├── member → Saral Banker (Person)
  │     └── sameAs → github.com/saralbanker
  ├── member → Jatin Basantani (Person)
  │     └── sameAs → github.com/jatin-861
  ├── creator → NeuroDashboard (SoftwareApplication)
  ├── creator → Shade Ledger (SoftwareApplication)
  ├── creator → Smart Parking (SoftwareApplication)
  └── creator → Carbon Compass (SoftwareApplication)

WebSite (orvion.co)
  └── publisher → Orvion.co (Organization)
```

---

## Open Gaps

| Gap                                   | Impact                               | Resolution                           |
| ------------------------------------- | ------------------------------------ | ------------------------------------ |
| No LinkedIn sameAs for either founder | Weak knowledge graph for individuals | Add when LinkedIn profiles exist     |
| No `logo` property on Organization    | Missing visual entity signal         | Add `/favicon.ico` or logo image URL |
| No `foundingDate` on Organization     | Incomplete entity                    | Add when confirmed                   |
| Static prerendering absent            | 40–60% of schemas invisible          | P3-2 backlog                         |

---

## Cross-references

- SEO implementation → [`SEO_AI_DISCOVERABILITY.md`](SEO_AI_DISCOVERABILITY.md)
- Entity titles → [`BRAND_GUIDE.md`](BRAND_GUIDE.md)
- Pending P0 fixes → [`IMPLEMENTATION_BACKLOG.md`](IMPLEMENTATION_BACKLOG.md)
