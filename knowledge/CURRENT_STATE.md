# Current State

## Live snapshot — update this file after every session

**Last updated:** 2026-07-02

---

## Last Completed Milestones

| Milestone                                                   | Commit / Session             | Status  |
| ----------------------------------------------------------- | ---------------------------- | ------- |
| Preloader stuck-at-2% bug fix                               | Session (useRef fix)         | ✅ Done |
| Hero return-visit delay bug fix                             | Session (useState lazy init) | ✅ Done |
| ThemeToggle flash fix                                       | Session (lazy useState)      | ✅ Done |
| Dark mode as default                                        | `08516b6`                    | ✅ Done |
| Per-page SEO (canonical, og:url, og:title)                  | `08516b6`                    | ✅ Done |
| og-image.png (1200×630)                                     | `41e17dd`                    | ✅ Done |
| Organization JSON-LD completed                              | Session                      | ✅ Done |
| WebSite JSON-LD (index.html static)                         | Session                      | ✅ Done |
| Person JSON-LD (Saral + Jatin)                              | Session                      | ✅ Done |
| SoftwareApplication JSON-LD (all 4 projects)                | Session                      | ✅ Done |
| FAQPage JSON-LD (process.tsx)                               | Session                      | ✅ Done |
| Duplicate H1 fix (process.tsx RevealText)                   | Session                      | ✅ Done |
| Voice fixes: "Things I've" → "Things we've"                 | `fe39447`                    | ✅ Done |
| Voice fixes: "Built by Saral Banker" → "Built by Orvion.co" | `fe39447`                    | ✅ Done |
| Voice fixes: BigCTA "I'd like" → "we'd love"                | `fe39447`                    | ✅ Done |
| Jatin TEAM designation updated                              | `fe39447`                    | ✅ Done |
| ProfilePage schema → WebSite schema (index.tsx)             | `fe39447`                    | ✅ Done |
| llms.txt created                                            | `fe39447`                    | ✅ Done |
| Sitemap lastmod updated (2026-07-02)                        | `fe39447`                    | ✅ Done |
| Security headers added                                      | `08516b6`                    | ✅ Done |
| Pricing PDFs + report                                       | `9286e68`                    | ✅ Done |
| Client testimonials section                                 | `efcd537`                    | ✅ Done |

---

## Strategic Investigations Completed

All four investigation reports are in the repository root:

- `CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md` — identity architecture verdict
- `NARRATIVE_DECISION_ARCHITECTURE_REPORT.md` — communication system audit
- `HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md` — homepage section structure
- (AI Discovery + prior reports — see archive if needed)

---

## Active Priorities (Pending Implementation)

### P3 — Lower priority / external dependency

See [`IMPLEMENTATION_BACKLOG.md`](IMPLEMENTATION_BACKLOG.md) for full details.

- P3-1: Nav reorder (Work → About → Process → Pricing → Contact) — deferred pending analytics
- P3-2: Static prerendering (vite-react-ssg)
- P3-3: LinkedIn profiles (external dependency)
- P3-4: Per-project OG images
- P3-5: prefers-reduced-motion full implementation
- P3-6: Jatin GitHub in footer dock

---

## Known Bugs

| Bug                                    | Severity | Location                  | Status                                   |
| -------------------------------------- | -------- | ------------------------- | ---------------------------------------- |
| Hero "I" voice switch                  | P0       | `CinematicHero.tsx`       | ✅ Fixed (2026-07-02)                    |
| Footer bio uses "I"                    | P0       | `SiteFooter.tsx`          | ✅ Fixed (2026-07-02)                    |
| StoryTeller `realm-btn` dead end       | P0       | `StoryTeller.tsx`         | ✅ Fixed — wired to `/work` (2026-07-02) |
| Jatin role description inconsistent    | P0       | `about.tsx`               | ✅ Fixed (2026-07-02)                    |
| Saral jobTitle inconsistent in JSON-LD | P0       | `about.tsx`, `index.html` | ✅ Fixed (2026-07-02)                    |

---

## Technical Debt

| Item                                                               | Impact                             | Complexity          |
| ------------------------------------------------------------------ | ---------------------------------- | ------------------- |
| No SSR/SSG — JS-injected schemas invisible to non-JS crawlers      | SEO — ~40–60% schema coverage lost | HIGH                |
| No LinkedIn profiles for either founder                            | Recruiter trust gap                | External dependency |
| `StoryTeller` component is large and navigation-unconnected        | Dead-end UX + code weight          | MEDIUM              |
| Hero metrics strip + Numbers section duplicate stats               | Cognitive redundancy               | LOW                 |
| Resume CTA in hero mixes recruiter/client audiences                | CTA dilution                       | LOW                 |
| No per-project OG images                                           | Social share quality               | MEDIUM              |
| `prefers-reduced-motion` not fully implemented in page transitions | Accessibility                      | MEDIUM              |

---

## Recently Completed (this session)

- Full canonical identity architecture investigation → report produced
- Full narrative + decision architecture investigation → report produced
- Full homepage decision architecture tribunal → blueprint produced
- Engineering Knowledge Base created → `/knowledge/`
- **P0 complete** (2026-07-02): All 7 voice/schema/dead-end fixes applied and verified
- **P1 complete** (2026-07-02): Homepage restructured — removed ScrollingTicker, StudioShowreel, StoryTeller; moved StudioManifesto to section 2; removed hero metrics + Resume CTA; added bridge sentence
- **P2 complete** (2026-07-02): FeaturedEvidence + ProcessSignal components created; BigCTA has post-contact assurance + pricing signal; cross-page CTAs added to Work index + About page
- Build: ✅ passes (TypeScript clean, Vite build 3.27s)
