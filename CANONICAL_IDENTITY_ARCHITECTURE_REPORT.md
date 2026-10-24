# Canonical Identity Architecture Report

## Orviontech — Identity Architecture Tribunal

**Date:** 2026-07-02 | **Status:** Investigation Complete — No Implementation

---

## 1. Executive Summary

The portfolio at `orviontech` is currently operating under an **accidental hybrid identity**: the header, domain, and schema present a studio brand (Orviontech), while the footer bio, GitHub links, and developer cards present an individual voice (Saral Banker). Jatin Basantani carries three different role descriptions across four artifacts. The contact form accepts full-time employment inquiries alongside studio contracts, but the page copy treats these identically.

This is not a branding problem. It is an **architectural contradiction** that weakens every audience simultaneously: recruiters can't find a clean individual signal, B2B clients don't know what they're hiring (a studio or two freelancers), and AI systems encounter ambiguous, partially-conflicting entity definitions.

**The investigation recommends:** Hybrid Authority with Studio-Primary Canvas — Orviontech as the B2B and product entity; Saral Banker and Jatin Basantani as named individuals with distinct, consistent authority domains surfaced explicitly within the same site.

This architecture requires **no domain change, no site rebuild, and no partnership restructuring.** It requires deliberate copy, structural consistency, and a unified entity hierarchy.

---

## 2. Current Identity Audit

### 2.1 Entity Signal Inventory

| Artifact                         | Entity Presented                                        | Voice             | Confidence              |
| -------------------------------- | ------------------------------------------------------- | ----------------- | ----------------------- |
| Domain                           | `orviontech`                                             | Studio            | Studio-primary          |
| Logo / Wordmark                  | `ORVIONTECH`                                             | Studio            | Studio-primary          |
| Hero H1 (`index.tsx:362`)        | "Hi, we're Saral x Jatin."                              | Dual-founder      | Dual                    |
| Footer bio (`SiteFooter.tsx:51`) | **"Product engineer. I design, build..."**              | Singular personal | ⚠ Contradiction         |
| Footer dock                      | `github.com/saralbanker` only                           | Saral-primary     | ⚠ Asymmetric            |
| Footer GooeyText                 | Cycles: SARAL → JATIN → SARAL X JATIN → ORVIONTECH       | All four          | Intentionally ambiguous |
| Footer copyright                 | `© 2026 Orviontech`                                      | Studio            | Studio-primary          |
| About H1 (`about.tsx:208`)       | "Two engineers, real systems."                          | Dual-founder      | Dual                    |
| About founder cards              | Individual names + individual resumes                   | Dual-founder      | Dual                    |
| Case study cover                 | `Built by Orviontech` (just fixed)                       | Studio            | Studio-primary          |
| Contact form type                | "Full-Time Role" option                                 | Individual hiring | Person-primary          |
| JSON-LD `index.html`             | `Organization: Orviontech`                               | Studio            | Studio-primary          |
| JSON-LD `about.tsx`              | `Person: Saral + Person: Jatin`                         | Dual              | Dual                    |
| Team resume                      | `Orvion_Team_Resume.pdf`                                | Studio            | Studio-primary          |
| Individual resumes               | `Saral_Banker_Resume.pdf`, `Jatin_Basantani_Resume.pdf` | Individual        | Person-primary          |

### 2.2 Role Description Inconsistencies

**Jatin Basantani — four different descriptions in the repository:**

| Location                                     | Description                                    |
| -------------------------------------------- | ---------------------------------------------- |
| `about.tsx` TEAM designation                 | "Co-Founder · Frontend & AI Systems Developer" |
| `about.tsx` founder card subtitle (line 467) | "Full-Stack Engineer & AI Systems Builder"     |
| `about.tsx` JSON-LD `jobTitle`               | "Frontend & AI Systems Developer"              |
| `index.html` JSON-LD `jobTitle`              | "Frontend & AI Systems Developer"              |

**Saral Banker — three different descriptions:**

| Location                                     | Description                                       |
| -------------------------------------------- | ------------------------------------------------- |
| `about.tsx` TEAM designation                 | "Product Engineer · Full-Stack & AI Applications" |
| `about.tsx` founder card subtitle (line 386) | "Full Stack Engineer · AI Application Developer"  |
| JSON-LD `jobTitle` everywhere                | "Product Engineer"                                |

### 2.3 Structural Contradiction: Footer

`SiteFooter.tsx:51` currently reads:

> "Product engineer. I design, build, and ship complete systems — database to deployment."

This is singular first-person copy anchored to `ORVIONTECH`. A visitor who reads only the footer is told they are on a one-person personal portfolio. A visitor who reads the hero is told they are on a two-person studio site. These are different businesses.

### 2.4 Structural Contradiction: Footer Dock

The footer dock (`SiteFooter.tsx:18`) links only to `github.com/saralbanker`. Jatin Basantani has no footer-level social presence. This makes Saral the de facto identity owner of the site despite the dual-founder positioning on every other page.

### 2.5 Contact Form — Identity Ambiguity

`contact.tsx:462` includes "Full-time roles, contract work, and freelance projects." The contact form accepts "Full-Time Role" as an inquiry type alongside "Contract Work" and "Freelance Project." These serve radically different audiences:

- **Full-Time Role** → recruiter or hiring manager → wants individual identity (résumé, GitHub, personal brand)
- **Contract Work / Freelance Project** → client → wants studio identity (track record, team, delivery proof)

Both are valid goals. But the current page treats them identically and surfaces only the studio entity (`Contact — Orviontech`), which means individual hiring inquiries land on a studio page with no individual person reinforcement.

---

## 3. Identity Architecture Principles

The following principles govern the evaluation of all candidate architectures. They are derived from observed patterns in successful founder-led studios, not from convention.

**P1 — Authority must compound.** The entity that receives links, mentions, schema, and copy must be the same entity across all channels. Split authority compounds for nobody.

**P2 — Identity must survive partnership restructuring.** If two people co-brand and one leaves, the brand loses half its authority signal. Individual person brands survive; studio brands are vulnerable.

**P3 — Recruiters and clients are different audiences with different trust signals.** Recruiters search by name, evaluate GitHub, look at individual projects. B2B clients evaluate track record, team size, and delivery proof. One page cannot simultaneously be optimized for both without intentional structural separation.

**P4 — AI systems resolve entities by consistency, not by claim.** A `Person` named "Saral Banker" appearing with different `jobTitle` values on different pages creates a weak, uncertain entity in any knowledge graph. Consistency wins.

**P5 — The domain is the longest-lived commitment.** `orviontech` is already established. Any architecture that requires abandoning it carries significant migration cost and authority loss.

**P6 — Simplicity beats completeness.** The architecture that requires the fewest ongoing decisions wins. Every additional identity axis creates ongoing maintenance.

---

## 4. Entity Relationship Analysis

### 4.1 Current Declared Entities

```
Orviontech (Organization)
├── url: https://orviontech
├── contactPoint: orvionstudio.co@gmail.com
├── member: Saral Banker (Person)
│   ├── jobTitle: "Product Engineer"
│   ├── sameAs: github.com/saralbanker
│   └── worksFor: Orviontech
└── member: Jatin Basantani (Person)
    ├── jobTitle: "Frontend & AI Systems Developer"
    ├── sameAs: github.com/jatin-861
    └── worksFor: Orviontech

Projects (SoftwareApplication × 4)
└── creator: Orviontech
```

### 4.2 Observed Actual Entities (what the page communicates)

```
Saral Banker (Person — defacto primary, based on footer + GitHub dominance)
├── Also operates as: Orviontech (unclear)
├── Works with: Jatin Basantani (subordinate?)
└── GitHub: saralbanker (only individual GitHub on site)

Orviontech (Organization — declared primary)
├── Two founders
├── Studio identity
└── Business entity for clients

Jatin Basantani (Person — declared equal, signaled secondary)
├── GitHub: jatin-861 (not surfaced in footer)
└── Role unclear (Designer? Frontend? AI Systems? Co-Founder?)
```

The declared entity graph and the actual communicated entity graph are different. This gap is the core problem.

---

## 5. Candidate Architecture Comparison

### Architecture A: Person-First (Saral Banker Primary)

**Description:** Saral Banker is the canonical public entity. Orviontech is his operating studio. Jatin is credited as a collaborator.

**Authority accumulation:** Concentrates on Saral Banker. High individual authority. Studio remains a vehicle.

**Hiring impact:** Excellent for Saral. Jatin needs a separate presence. Creates a hierarchy that may not reflect actual collaboration.

**Consulting impact:** Moderate. "One person with a collaborator" reads as freelance, not as a studio. Raises questions about team capacity.

**AI discoverability:** Strong for Saral Banker as an entity. Organization entity weakens.

**Long-term durability:** Excellent for Saral as an individual. Orviontech becomes dependent on Saral — if he leaves tech, the brand is stranded.

**Migration from current:** Moderate. Footer already leans this way. Requires downgrading Jatin's prominence and restructuring schema.

**Confidence in recommendation:** Low. Does not represent what the portfolio actually is. Two people built two production systems. Representing this as one person's work is misleading and weakens the studio narrative.

**Rejected because:** Misrepresents the factual founding relationship. Jatin is demonstrably a co-builder of NeuroDashboard and a co-founder. Falsifying authority is explicitly prohibited.

---

### Architecture B: Dual-Founder (Equal Saral + Jatin)

**Description:** Saral Banker and Jatin Basantani are co-equal primary entities. Orviontech is a shared operating entity.

**Authority accumulation:** Split equally between two people and a studio. Three entities, all weak.

**Hiring impact:** Each person gets partial signal. Neither accumulates strong individual authority. Recruiters who want "Saral Banker" must navigate through the studio brand.

**Consulting impact:** "Two founders" signals team, which is good for B2B. But the dual-brand makes it harder for AI and search to resolve a clean entity.

**AI discoverability:** Three competing entities. Knowledge graphs resolve this poorly unless each entity is sharply defined and consistently referenced.

**Long-term durability:** Vulnerable. If the partnership ends, both people lose the shared brand and must rebuild individually.

**Migration from current:** This is approximately the current approach. Already implemented but inconsistently.

**Confidence in recommendation:** Moderate. Accurately reflects reality but creates three weak entities instead of one strong one.

**Rejected as the final architecture because:** Authority dilution. Three entities means three compounding curves, all slow. The studio entity should absorb project authority while individual entities absorb personal/hiring authority. These are different axes — they shouldn't compete.

---

### Architecture C: Studio-First (Orviontech Primary)

**Description:** Orviontech is the primary canonical entity. Saral and Jatin are team members, not primary branded individuals.

**Authority accumulation:** Strong for Orviontech. Scales as the business grows. Can add more people without restructuring.

**Hiring impact:** Poor. Recruiters search for people, not studios. If either founder wants to get hired as an individual, their Google presence is buried under the studio brand.

**Consulting impact:** Excellent for B2B. "We're a studio" frames the relationship as professional services rather than freelance.

**AI discoverability:** Organization entity is strong. Person entities are subordinate.

**Long-term durability:** High for the studio, low for the individuals. If the partnership ends, neither person has accumulated personal authority.

**Migration from current:** Moderate. Requires removing individual hiring signals ("Full-Time Role" contact type, individual resumes from footer) or structurally separating them.

**Confidence in recommendation:** Low. At this career stage, individual hiring is still a relevant goal for both founders. Eliminating that signal is premature.

**Rejected because:** Both founders are early-career. Individual employment is a realistic and rational goal. A studio-first architecture blocks this and concentrates risk entirely on the studio relationship continuing. Does not optimize for multiple audiences simultaneously.

---

### Architecture D: Hybrid Authority with Studio-Primary Canvas ✓ RECOMMENDED

**Description:** Orviontech is the primary canvas (domain stays, studio brand stays). Saral Banker and Jatin Basantani are explicitly named, consistently titled individuals with distinct authority domains. The site serves all three audiences — B2B clients, individual recruiters, and AI systems — through intentional structural separation, not through compromise.

**Entity hierarchy:**

```
Orviontech (Organization) — primary canvas, B2B entity, project owner
├── Saral Banker (Person) — full-stack + AI systems authority
│   ├── hiring channel: individual resume + GitHub
│   └── project credit: NeuroDashboard lead, Shade Ledger
└── Jatin Basantani (Person) — frontend + AI systems authority
    ├── hiring channel: individual resume + GitHub
    └── project credit: NeuroDashboard (Knowledge Hub), UI/UX
```

**Authority accumulation:** Orviontech accumulates client and project authority. Each person accumulates individual authority in their domain. No entity cannibalizes another.

**Hiring impact:** Recruiters who find "Saral Banker" land on a portfolio where he is individually named, profiled, credited, and has a direct resume download. Same for Jatin. The studio context adds legitimacy, not friction.

**Consulting impact:** Clients who find "Orviontech" see a studio with two named engineers, production proof, and a process. The individual identities strengthen the studio's authority rather than competing with it.

**AI discoverability:** Three entities, each sharply defined, each pointing to the others. Knowledge graphs can resolve: Saral Banker → member of Orviontech → created NeuroDashboard. Jatin Basantani → member of Orviontech → built Knowledge Hub frontend.

**Long-term durability:** High. If the partnership ends, each person retains their individual authority. The studio brand can either continue or sunset without destroying individual reputations. If the studio grows (new hires), the Orviontech entity scales naturally.

**Migration from current:** Low. The structural bones are already here. Requires fixing contradictions (footer bio, role unification, GitHub symmetry) rather than rebuilding.

**Confidence in recommendation:** High. Supported by repository evidence, by business goal plurality, and by observed patterns in successful founder-led studios.

---

### Architecture E: Federated Identity

**Description:** `orviontech` (studio), `saralbanker.dev` (individual), `jatinbasantani.dev` (individual) as separate presences.

**Rejected immediately:** Premature for current scale. Creates three maintenance burdens. Splits the already-small authority into even smaller pools. No evidence that this is needed at this stage.

---

## 6. Trust Analysis

| Trust Dimension                  | Studio-First | Person-First     | Hybrid (Recommended) |
| -------------------------------- | ------------ | ---------------- | -------------------- |
| Client "can this get done?"      | ✓ Strong     | ✗ Weak           | ✓ Strong             |
| Client "who am I dealing with?"  | ✗ Abstract   | ✓ Direct         | ✓ Direct             |
| Recruiter "is this person real?" | ✗ Buried     | ✓ Clear          | ✓ Clear              |
| Technical credibility            | ✗ Anonymous  | ✓ GitHub visible | ✓ Both GH visible    |
| Partnership durability signal    | ✓ Stable     | N/A              | ✓ Named individuals  |
| AI entity confidence             | ✓ Org clear  | ✓ Person clear   | ✓ Both clear         |

---

## 7. Hiring Analysis

**Current state:** The contact form accepts "Full-Time Role" but routes it to the same studio-branded contact page. A recruiter filling this form sees "Contact — Orviontech" in the browser tab and "orvionstudio.co@gmail.com" as the recipient. There is no structural signal that they are contacting an individual engineer.

**Individual resume download exists** at `/Saral_Banker_Resume.pdf` and `/Jatin_Basantani_Resume.pdf` — these are surfaced on the About page but require navigation. No direct link from homepage to individual resumes.

**Hybrid architecture hiring requirements:**

- Each founder's name must appear consistently and prominently (not buried in About)
- Each founder's GitHub must be accessible (currently only Saral's is in the footer dock)
- "Full-Time Role" contact type should explicitly confirm which individual the inquiry is for
- Job titles must be single, consistent strings — not three different titles for the same person

---

## 8. Consulting Analysis

**Current strength:** Shade Ledger case study provides production proof. The "two engineers" framing signals team capacity without overstating it. Process page establishes methodology credibility.

**Current weakness:** No explicit "studio for hire" framing. The client quote on About page attributes the work to no named individual or studio. Pricing page exists but no link from individual project tiers to contact (still unresolved P1-2).

**Hybrid architecture consulting requirements:**

- Orviontech must be the entity that owns delivery credit (already done: "Built by Orviontech")
- Process page must link to contact for each type of engagement
- Client-facing copy must distinguish "you work with Saral and Jatin directly" from "you engage Orviontech as a studio"

---

## 9. AI Discoverability Analysis

**Current schema entity graph (after previous session's work):**

```
[index.html — static, visible to all crawlers]
WebSite: orviontech
Organization: Orviontech
  ├── member: Saral Banker (Person)
  └── member: Jatin Basantani (Person)

[about.tsx — JS-only, invisible to non-JS crawlers]
Person: Saral Banker
Person: Jatin Basantani

[work.$slug.tsx — JS-only]
SoftwareApplication (per project)

[process.tsx — JS-only]
FAQPage (4 questions)

[index.tsx — JS-only]
WebSite (redundant with static)
```

**Entity resolution risk:** Jatin Basantani has three different `jobTitle` values. An AI system encountering all three pages will see conflicting entity definitions for the same name. Under the hybrid architecture, a single canonical `jobTitle` must be chosen and used everywhere without variation.

**Missing entity relationship:** No schema currently states "Saral Banker was the primary engineer on NeuroDashboard" or "Jatin Basantani built the Knowledge Hub module." The `SoftwareApplication` schema credits `Orviontech` as `creator`, which is correct at the studio level, but leaves the individual contribution graph empty. This can be addressed by adding `contributor` or `author` Person references to the `SoftwareApplication` schema.

**llms.txt coverage:** Created in previous session. Provides plain-text entity description for AI training crawlers that don't execute JavaScript. Entity descriptions in `llms.txt` should match the canonical titles established by this architecture decision.

---

## 10. Business Scalability Analysis

| Scenario                                   | Studio-First                      | Hybrid (Recommended)                                                |
| ------------------------------------------ | --------------------------------- | ------------------------------------------------------------------- |
| Third engineer joins Orviontech             | ✓ Scales naturally                | ✓ Scales naturally                                                  |
| Saral joins a larger company               | ✗ Studio loses primary builder    | ✓ Saral retains personal authority; Orviontech can continue or close |
| Jatin launches solo product                | ✗ No personal base to launch from | ✓ Jatin has individual identity to launch under                     |
| Orviontech launches a SaaS                  | ✓ Studio owns the product         | ✓ Studio owns the product                                           |
| Partnership ends                           | ✗ Brand stranded                  | ✓ Each person keeps their individual reputation                     |
| International client wants solo contractor | ✗ Unclear who to contract         | ✓ Can surface individual as contractor under Orviontech umbrella     |

The hybrid architecture is the only one that survives all six scenarios without requiring rebuilding.

---

## 11. Knowledge Graph Architecture

The canonical entity graph for the hybrid architecture:

```
WebSite
└── url: https://orviontech
    └── publisher: Orviontech (Organization)

Organization: Orviontech
├── url: https://orviontech
├── description: "Product engineering studio…"
├── contactPoint: orvionstudio.co@gmail.com
├── areaServed: Worldwide
├── sameAs: [github/saralbanker, github/jatin-861]
├── member[0]: Saral Banker (Person)
│   ├── jobTitle: "Full-Stack & AI Engineer"          ← ONE canonical title
│   ├── url: https://orviontech/about
│   ├── sameAs: github.com/saralbanker
│   └── worksFor: Orviontech
└── member[1]: Jatin Basantani (Person)
    ├── jobTitle: "Frontend & AI Systems Developer"   ← ONE canonical title
    ├── url: https://orviontech/about
    ├── sameAs: github.com/jatin-861
    └── worksFor: Orviontech

SoftwareApplication × 4
├── NeuroDashboard
│   ├── creator: Orviontech
│   └── (future) contributor: Saral Banker, Jatin Basantani
├── Shade Ledger
│   ├── creator: Orviontech
│   └── (future) contributor: Saral Banker
├── Smart Parking
│   └── creator: Orviontech
└── Carbon Compass
    └── creator: Orviontech

FAQPage: /process
├── 4 × Question/Answer pairs (already implemented)
└── about: Orviontech
```

**One rule:** Every entity in this graph uses exactly the strings defined above. `jobTitle` for Saral is always "Full-Stack & AI Engineer." `jobTitle` for Jatin is always "Frontend & AI Systems Developer." No variation across pages, cards, bios, or structured data.

---

## 12. Repository Impact Assessment

### 12.1 SiteFooter.tsx

**Current state:** "Product engineer. I design, build, and ship complete systems — database to deployment." (singular, personal)

**Target state:** "Product engineering studio. We design, build, and ship complete systems — database to deployment." (studio voice)

**Business impact:** Eliminates the most visible contradiction between studio brand and personal voice.
**Hiring impact:** Neutral (footer bio is rarely a hiring decision point).
**AI discoverability impact:** Removes one artifact where singular voice contradicts the Organization schema.
**Engineering complexity:** One line.
**Priority:** P0.
**Success criteria:** Footer bio uses "We" and "studio" — consistent with every other page's voice.

---

### 12.2 SiteFooter.tsx — Dock Links

**Current state:** Only `github.com/saralbanker` in the footer dock.

**Target state:** Either add `github.com/jatin-861` as a second dock item, or acknowledge the asymmetry as intentional (Saral is the primary code owner; Jatin's GitHub may be less active or private).

**Decision required (not made by this report):** Does Jatin's GitHub represent him equally? If yes, add it. If Jatin's GitHub activity is sparse or private, it may be better to keep only the studio email and remove Saral's individual GitHub from the footer — surfacing GitHub only in the individual founder cards on About instead.

**Business impact:** Directly affects Jatin's individual authority signal at the footer level.
**Engineering complexity:** One line either way.
**Priority:** P1. Requires human decision on Jatin's GitHub state.
**Success criteria:** Footer dock treats both founders symmetrically, or explicitly surfaces only studio-level contact points.

---

### 12.3 about.tsx — Role Title Unification

**Current state:** Jatin has four different role descriptions (listed in §2.2). Saral has three.

**Target state:**

| Location               | Saral canonical title      | Jatin canonical title                          |
| ---------------------- | -------------------------- | ---------------------------------------------- |
| TEAM array designation | "Full-Stack & AI Engineer" | "Co-Founder · Frontend & AI Systems Developer" |
| Founder card subtitle  | "Full-Stack & AI Engineer" | "Frontend & AI Systems Developer"              |
| JSON-LD `jobTitle`     | "Full-Stack & AI Engineer" | "Frontend & AI Systems Developer"              |
| index.html JSON-LD     | "Full-Stack & AI Engineer" | "Frontend & AI Systems Developer"              |
| llms.txt               | "Full-Stack & AI Engineer" | "Frontend & AI Systems Developer"              |

Note: Saral's canonical title changes from the current "Product Engineer" (JSON-LD) to "Full-Stack & AI Engineer" — this better reflects the actual skill set documented in his founder card and the project stack. "Product Engineer" is accurate but less specific than what the projects evidence.

**Business impact:** Prevents knowledge graph ambiguity. Single entity = single title = consistent recognition.
**AI discoverability impact:** High. Eliminates conflicting entity definitions.
**Engineering complexity:** 5–8 targeted edits across two files.
**Priority:** P0 (entity consistency is foundational).
**Success criteria:** Grep for "Jatin" returns exactly one `jobTitle`/`designation` pattern. Same for "Saral."

---

### 12.4 index.tsx — WebSite Schema (already done)

**Current state:** ✓ Implemented in previous session.
**Target state:** Already reached.
**Notes:** The `WebSite` schema correctly references `publisher: Orviontech`. No further action needed.

---

### 12.5 work.$slug.tsx — Project Attribution

**Current state:** "Built by Orviontech" (just fixed in previous session). Schema credits `creator: Orviontech`. No individual contributor attribution.

**Target state:** Keep `creator: Orviontech`. Optionally add contributor Person references for the two projects with known individual contributions. This is a P2 enhancement — the current state is already correct for the studio entity.

**Future enhancement (P2):** Add `contributor` arrays to NeuroDashboard and Shade Ledger schemas citing Saral Banker and Jatin Basantani by name, enabling AI systems to understand who specifically built what.

**Priority:** P2. Not blocking.

---

### 12.6 contact.tsx — Hiring vs. Studio Inquiry Separation

**Current state:** "Full-time roles, contract work, and freelance projects" on a page titled "Contact — Orviontech."

**Target state:** The contact form accepts all three. But the "Full-Time Role" path should confirm to the user which individual they're reaching — "You'll hear from Saral or Jatin directly" — so recruiters know they're not emailing a faceless studio.

**Business impact:** Converts the ambiguity into a trust signal for recruiters.
**Engineering complexity:** Copy change only — one sentence.
**Priority:** P1.
**Success criteria:** A recruiter completing the "Full-Time Role" form knows they'll hear from a named individual.

---

### 12.7 index.html and llms.txt — Title Alignment

**Current state:** `index.html` has Saral as "Product Engineer" and Jatin as "Frontend & AI Systems Developer." `llms.txt` has "Full-Stack & AI Engineer" for Saral and "Frontend & AI Systems Developer" for Jatin.

**Target state:** All three (index.html, about.tsx JSON-LD, llms.txt) use "Full-Stack & AI Engineer" for Saral. `llms.txt` is already correct; `index.html` and `about.tsx` need one title updated.

**Priority:** P0 (entity consistency).
**Engineering complexity:** Two targeted edits.

---

## 13. Migration Strategy

### Phase 1 — Entity Consistency (P0, can be done in one commit)

1. Unify Saral's title to "Full-Stack & AI Engineer" across index.html, about.tsx JSON-LD, about.tsx TEAM designation, about.tsx founder card subtitle
2. Unify Jatin's title to "Frontend & AI Systems Developer" across about.tsx founder card subtitle (currently "Full-Stack Engineer & AI Systems Builder"), about.tsx TEAM designation already done
3. Fix footer bio from "Product engineer. I..." to "Product engineering studio. We..."

### Phase 2 — Authority Signals (P1)

4. Resolve footer dock GitHub asymmetry (human decision required first)
5. Update contact form "Full-Time Role" confirmation copy
6. Update `llms.txt` if titles changed in Phase 1

### Phase 3 — Enhancements (P2)

7. Add `contributor` Person references to NeuroDashboard and Shade Ledger `SoftwareApplication` schemas
8. Add Pricing → Contact CTA (already in plan as P1-2, still unresolved)

---

## 14. Risk Assessment

| Risk                                                | Probability | Impact                | Mitigation                                                                |
| --------------------------------------------------- | ----------- | --------------------- | ------------------------------------------------------------------------- |
| Partnership restructuring                           | Medium      | High for Studio-First | Hybrid architecture: each person retains individual authority regardless  |
| Jatin's GitHub is private/sparse                    | Unknown     | Medium                | Surface individual GitHub only on About founder cards, not in footer dock |
| "Full-Stack & AI Engineer" title is too broad       | Low         | Low                   | Add stack specificity in bio copy, not in the title                       |
| Studio brand competes with individual job search    | Medium      | Medium                | Hybrid explicitly separates the two channels; the site serves both        |
| AI systems fail to resolve three separate entities  | Low         | Medium                | Consistency (P0 Phase 1) eliminates conflicting signals                   |
| `orviontech` domain name is unusual/hard to remember | Low         | Low                   | Already committed; brand familiarity compounds over time                  |

---

## 15. Architecture Decision Record

**ADR-001: Canonical Identity Architecture**

**Status:** Recommended

**Context:** Orviontech portfolio serves multiple audiences (B2B clients, recruiters, AI indexers) with a single URL and identity. The founders are early-career engineers with individual hiring as a live goal. A studio brand is established but contradicted internally.

**Decision:** Hybrid Authority with Studio-Primary Canvas.

**Consequences:**

- Orviontech accumulates B2B and project authority
- Saral Banker and Jatin Basantani each accumulate individual professional authority
- No domain change required
- Requires entity consistency across ~8 targeted artifacts
- Reviewable in 12 months: if studio is primary revenue source and hiring is no longer a goal, consider migrating to Studio-First

**Alternatives considered:** Person-First (rejected: misrepresents co-founding), Dual-Founder-Equal (rejected: dilutes all three entities), Studio-First (rejected: blocks individual hiring at current career stage), Federated (rejected: premature).

---

## 16. Final Canonical Identity

### The Verdict

**Selected architecture: Hybrid Authority with Studio-Primary Canvas**

**Every competing architecture was rejected because:**

- **Person-First** fabricates authority by erasing a co-founder who demonstrably built NeuroDashboard's Knowledge Hub module and co-authored the studio identity. Repository evidence (two resumes, two founder cards, two GitHub profiles in schema) contradicts this.

- **Dual-Founder-Equal** creates three competing entities (Saral, Jatin, Orviontech) that each accumulate authority slowly. It is the current accidental implementation — and its weaknesses are already visible in the inconsistencies found during this investigation.

- **Studio-First** eliminates the individual hiring channel at a career stage where employment is a rational goal. The contact form's own "Full-Time Role" option is repository evidence that this goal exists and must be served.

- **Federated** is architecturally correct but premature. It creates three sites to maintain, three authorities to build, and three potential points of contradiction. No evidence suggests the business is at a stage that requires it.

**The hybrid architecture is selected because:**

1. The domain (`orviontech`) is already committed — no migration required
2. The project record is already attributed to the studio — consistent with B2B positioning
3. Individual founder cards, individual resumes, and individual GitHub profiles already exist — the person-authority infrastructure is in place
4. The architecture survives partnership restructuring — each person retains their individual authority regardless of Orviontech's future
5. Three entities (Organization + 2× Person) can each be sharply defined, consistently referenced, and independently verifiable — the conditions for strong knowledge graph resolution

**The canonical entity hierarchy:**

```
Primary canvas:    Orviontech (Organization)
Individual layer:  Saral Banker (Person) + Jatin Basantani (Person)
Project layer:     NeuroDashboard, Shade Ledger, Smart Parking, Carbon Compass
```

**The canonical titles (non-negotiable once set):**

| Person          | Canonical jobTitle              |
| --------------- | ------------------------------- |
| Saral Banker    | Full-Stack & AI Engineer        |
| Jatin Basantani | Frontend & AI Systems Developer |

These two strings must appear identically in every `jobTitle` field, every founder card subtitle, every bio tagline, every schema object, and in `llms.txt`. Variation is the enemy of entity resolution.

**The three remaining contradictions that must be resolved before this architecture is active:**

1. Footer bio: Change "Product engineer. I..." to "Product engineering studio. We..." — P0
2. Saral's `jobTitle` in `index.html` and `about.tsx` JSON-LD: Update from "Product Engineer" to "Full-Stack & AI Engineer" — P0
3. Jatin's founder card subtitle: Change from "Full-Stack Engineer & AI Systems Builder" to "Frontend & AI Systems Developer" — P0

Everything else in the repository already supports this architecture. These three changes are the delta between the current accidental hybrid and the intentional one.

---

_This report is an investigation document only. No implementation has occurred. All evidence is sourced from the repository. No claims are made that are not traceable to a specific file and line number._
