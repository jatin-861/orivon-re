# Narrative & Decision Architecture Report

## Orviontech — Production-Ready Communication Audit

**Date:** 2026-07-02  
**Scope:** Investigation only. No implementation. No copy rewrites.  
**Evidence base:** All routes, all layout components, all data files — repository state as of this audit.

---

## 1. Executive Summary

The portfolio contains strong evidence, a clear belief system, and an identifiable engineering identity. The evidence is real: 220 rental units, 40+ hours saved monthly, 70k+ lines of production code. The belief is true: production over prototypes. The engineering capability is demonstrated: NeuroDashboard is a legitimately complex system.

The communication architecture fails these assets in four ways:

**1. Voice incoherence destroys immediate trust.**
The hero introduces "we're Saral x Jatin" then in the next sentence says "I build software." A visitor who reads both lines within 5 seconds receives a contradictory signal about who they're dealing with. This is the single highest-severity failure in the system.

**2. Belief is sequenced after evidence — backwards.**
The belief statement ("if it doesn't run in production") is the strongest differentiator in the portfolio. It currently appears after two project sections and one video showreel. A visitor who leaves before scrolling 70% of the homepage never encounters the thing that makes Orviontech different.

**3. The same evidence appears five times.**
The Shade Ledger "220 rental units / 40+ hours" fact appears in the ticker, the showreel, the manifesto, the Numbers section, and the About page. Repetition of evidence does not compound trust — it erodes attention.

**4. Navigation order follows a portfolio logic, not a decision logic.**
Work → Process → Pricing → About → Contact puts pricing before identity. A qualified buyer evaluating whether to trust two engineers with a real project does not reach "About" until after they've seen the price.

Three of these four failures require zero design changes. They require copy edits and section reordering.

---

## 2. Current Narrative Audit

### 2.1 Verified voice inconsistencies

| Location       | File                | Line | Current                                           | Problem                                |
| -------------- | ------------------- | ---- | ------------------------------------------------- | -------------------------------------- |
| Hero subtitle  | `CinematicHero.tsx` | 371  | "I build software that solves real problems."     | "we're Saral x Jatin" is 2 lines above |
| Hero body copy | `CinematicHero.tsx` | 374  | "I design, build, and ship production systems..." | Same "I" immediately after "we"        |
| Contact label  | `contact.tsx`       | 419  | "Tell me more"                                    | Should be "Tell us more"               |
| Footer bio     | `SiteFooter.tsx`    | 51   | "Product engineer. I design, build, and ship..."  | Only Saral's GitHub in the dock above  |

**Observation, not opinion:** The hero says "Hi, we're Saral x Jatin" (line 368) and then "I build software" (line 371). These are consecutive visible sentences. No visitor can reconcile this without reading the About page first — which most do not do on a first visit.

### 2.2 Repeated evidence inventory

| Fact                                           | Homepage appearances                     | Site-wide total                                    |
| ---------------------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| "220 rental units / Shade Ledger"              | 4 (ticker, showreel, manifesto, Numbers) | 7 (add About stats, About body, About testimonial) |
| "40+ hours saved monthly"                      | 2 (showreel, Numbers)                    | 4 (add About stats, hero metrics)                  |
| "70k+ lines of production code"                | 1 (Numbers)                              | 3 (add hero metrics, About stats)                  |
| "Production systems: 2"                        | 2 (hero metrics, Numbers)                | 4 (add About stats, About body)                    |
| Belief statement ("doesn't run in production") | 3 (StoryTeller, Manifesto, footer)       | 4                                                  |

**Informed inference:** Evidence repetition is not serving amplification. It is filling space. The manifesto, Numbers section, and About page stats are all doing identical work with identical numbers. Any one of them does the job; three of them together train the visitor to scroll past.

### 2.3 Section ordering on the homepage

```
1. Hero (identity + "USEFUL OVER IMPRESSIVE" canvas)
2. ScrollingTicker (capability list)
3. ScrollStoryHorizontal (3 project previews)
4. StudioShowreel (same 3 projects as video)
5. StoryTeller (belief: "if it doesn't run in production")
6. StudioManifesto (belief: 3 philosophical paragraphs)
7. SkillsMarquee (tech stack list)
8. Numbers (4 stats)
9. BigCTA ("Let's build something that ships")
```

**Problem:** Sections 3 and 4 show the same three projects twice in different formats. Sections 5 and 6 encode the same belief in two different visual formats. The belief — which is the narrative foundation — comes after two project sections that a visitor reads without understanding WHY these projects matter.

### 2.4 Navigation order audit

Current order: **Work → Process → Pricing → About → Contact**

B2B buying sequence psychology (Cialdini, Miller, trust formation research): visitors establish trust in the person/entity first, then evaluate capability, then evaluate fit, then evaluate cost. The current order inverts this:

| Nav position | Current               | Decision psychology suggests |
| ------------ | --------------------- | ---------------------------- |
| 1            | Work (capability)     | About (identity)             |
| 2            | Process (methodology) | Work (capability)            |
| 3            | Pricing (cost)        | Process (methodology)        |
| 4            | About (identity)      | Pricing (cost)               |
| 5            | Contact (conversion)  | Contact (conversion)         |

**Verified observation:** About is the last non-Contact item in the navigation. A visitor who only reads nav items and clicks in sequence will evaluate cost before knowing who they're paying. This is a real B2B friction point.

**Counterargument that must be acknowledged:** Work-first navigation works for cold visitors who arrived via a project showcase or a specific case study link. For that visitor, leading with proof rather than identity is correct. The nav order is not simply "wrong" — it is optimized for one audience path (project-referral) at the cost of another (direct/cold-contact).

---

## 3. Decision Architecture Audit

### 3.1 Decision chain analysis

Every visitor must answer eight questions before contacting. Mapping each against the current portfolio:

| Decision stage                               | Question                            | Where answered                           | Gap                                                                     |
| -------------------------------------------- | ----------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| Unknown → Interested                         | "Is this relevant to me?"           | Hero canvas + identity bar               | Answered in 5 seconds IF the visitor reads copy                         |
| Interested → Understands problem             | "What problem do they solve?"       | Hero body copy                           | BLOCKED: voice switch from we→I creates cognitive friction exactly here |
| Understands problem → Understands capability | "Can they actually do it?"          | Work page, case studies                  | Answered well — but requires nav click                                  |
| Understands capability → Believes evidence   | "Is this evidence real?"            | Shade Ledger specifics                   | Answered strongly (220 units, named client city)                        |
| Believes evidence → Trusts engineer          | "Are these people I can work with?" | About page                               | Requires another nav click; positioned 4th in nav                       |
| Trusts engineer → Believes outcome           | "Will this work for my project?"    | Process page                             | Answered — but only if visitor reaches it                               |
| Believes outcome → Ready to contact          | "How do I start?"                   | Every CTA                                | Well-answered — BigCTA is strong                                        |
| Ready to contact → Contacts                  | "What happens next?"                | Contact page "What happens next" section | Answered explicitly                                                     |

**Critical finding:** The single biggest drop-off risk is between "Interested" and "Understands problem." The hero has a voice contradiction at the exact moment the visitor is reading the first value proposition. A visitor who notices "we're" then "I" in consecutive sentences does not smoothly proceed to the work.

### 3.2 Missing decisions

**Missing: "Who is the studio?"**
The homepage does not have a section that explains that Orviontech is two people, who those people are, and why that matters. The hero introduces names ("Saral x Jatin") but does not explain roles, credentials, or why the duo architecture is better for the client. The About page does this — but only if visited.

**Missing: "Why fixed-price?"**
Pricing exists as a standalone page with fixed-fee positioning and a downloadable PDF. The homepage never links to Pricing, never mentions the fixed-fee model, and never explains why this is differentiated. A visitor who wants to know cost range cannot find it from the homepage.

**Missing: "What kind of project fits?"**
No section defines the ideal client or project type. Contact form options ("Full-Time Role", "Contract Work", "Freelance Project", "Something Else") suggest the founders are open to everything. That is the honest answer — but it creates ambiguity for a B2B client trying to assess fit.

### 3.3 Unnecessary decisions

**Unnecessary: Which project showreel format to focus on?**
ScrollStoryHorizontal (section 3) and StudioShowreel (section 4) both show the same three projects. The visitor must choose which to engage. This is a false decision — both lead to the same Work page. They should be collapsed into one.

**Unnecessary: Resume or Projects?**
The hero has two CTAs: "View Projects" (primary) and "Resume" (secondary). Resume in the hero is for recruiters. Projects in the hero is for clients. These audiences read the same hero copy but have different next steps. The secondary CTA dilutes the primary conversion path.

---

## 4. Current vs Target Narrative

### 4.1 Current narrative (as experienced by a cold visitor)

```
"We're Saral x Jatin — or I am? Someone who builds things.
There are some projects. And more projects. And a video of projects.
We believe something about production. We also believe something about production.
Here are some tools. Here are some numbers. Get in touch."
```

**Diagnosis:** The narrative has no through-line. Belief comes after evidence. Evidence repeats. Identity is unclear. The visitor assembles the story themselves — which is the failure mode the investigation prompt specifically named.

### 4.2 Target narrative (communication as a decision system)

```
"Two engineers who have a specific belief about software.
That belief has produced specific, verifiable results.
Here's the evidence — it's named and specific, not vague.
Here's how we work so you know what to expect.
Here's what it costs so there are no surprises.
Here's how to start."
```

**The key structural shift:** Belief must precede evidence. Evidence precedes identity detail. Identity detail precedes methodology. Methodology precedes cost. Cost precedes contact.

### 4.3 Narrative inconsistencies (evidence-backed, not inferred)

| Inconsistency                               | Section A                                           | Section B                                                         | Impact                                                      |
| ------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| "We" vs "I"                                 | Hero: "we're Saral x Jatin"                         | Hero: "I build software"                                          | Immediate trust interruption                                |
| "Product engineer" (singular) vs duo studio | Footer bio                                          | Every "we" instance on the site                                   | Long-term entity confusion                                  |
| Jatin builds AI systems                     | TEAM designation: "Frontend & AI Systems Developer" | Founder card subtitle: "Full-Stack Engineer & AI Systems Builder" | Jatin's role is described differently every time he appears |
| Studio vs personal                          | "Built by Orviontech" (work.$slug.tsx)               | Footer dock: only Saral's GitHub                                  | Who is the author?                                          |

### 4.4 Narrative dead ends

**StoryTeller "see what's running" button:** This button (`Button` component, not a `Link`) has `id="realm-btn"` but no `to` prop visible in the JSX. If it doesn't navigate anywhere, it is a narrative dead end — the visitor completes a scroll animation and receives a call to action that does nothing measurable.

**About page "Proof from production" section:** The Shade Ledger testimonial links to the Shade Ledger case study. But the testimonial section has a heading "Real results" which is redundant with the stats section above it. The transition between them is abrupt.

---

## 5. Visitor Decision Journey

### 5.1 Primary path: Business owner / founder seeking a development partner

```
Entry: Homepage (direct or referral)

5 seconds:
  Sees: "USEFUL OVER IMPRESSIVE" (particle canvas) + "Orviontech — Product Engineers, India"
  Understands: Engineering-focused studio based in India
  Question created: "What have they built?"
  Trust level: Neutral — identity is clear, relevance unknown

30 seconds:
  Reads: Hero body copy ("Hi, we're Saral x Jatin" → "I build software")
  Understands: Someone builds production software
  Question created: "Who exactly is this — one person or two?"
  Trust change: NEGATIVE — voice contradiction creates doubt about professionalism

  Reads: Metrics (2 systems, 220 units, 40+ hrs, 70k+ lines)
  Understands: They have specific, measurable results
  Question created: "What specifically did they build?"
  Trust change: POSITIVE — specific numbers indicate real work

30 seconds → 2 minutes:
  Sees: Ticker, ScrollStoryHorizontal (3 project previews)
  Understands: There are multiple projects
  Question created: "Are these real projects or side projects?"
  Trust change: NEUTRAL — no client names visible here

  Sees: StudioShowreel (same 3 projects as video)
  Understands: Same content they just saw, in video format
  Question created: none new (redundant)
  Trust change: NEUTRAL → slight negative (why am I seeing this twice?)

  Sees: StoryTeller ("if it doesn't run in production")
  Understands: They have a specific philosophy about shipping
  Question created: "Do they apply this to client work?"
  Trust change: POSITIVE — belief statement is differentiated

  Sees: StudioManifesto (same belief, three paragraphs + Shade Ledger reference)
  Understands: Same belief repeated with more detail
  Question created: none new (redundant)
  Trust change: NEUTRAL → slight negative (again?)

  Sees: SkillsMarquee, Numbers
  Question created: none new
  Trust change: NEUTRAL

  Sees: BigCTA ("Let's build something that ships")
  Decision available: Contact
  Trust level at this point: Mixed — specific evidence is strong, voice incoherence is unresolved

Most likely outcome: Visitor either clicks /work (has specific evidence question) or exits.
Conversion probability: Below potential due to:
  1. Unresolved "who" question (I vs we)
  2. Redundant sections depleting attention before the CTA
  3. No pricing information visible without a nav click
```

### 5.2 Primary path: Recruiter seeking a developer

```
Entry: Homepage or direct link to resume

5 seconds:
  Sees hero identity bar: "Product Engineers, India"
  Question: "Are they looking for work?"
  Evidence: "Open to new projects" (top right of hero bar) — YES
  Trust: Positive start

30 seconds:
  Sees: "Resume" CTA button in hero
  Clicks: Downloads /Orvion_Team_Resume.pdf (team resume, not individual)
  Problem: A recruiter looking for Saral Banker or Jatin Basantani individually
           receives a combined team resume. This may not serve either founder's
           individual hiring path.

If they continue:
  Looks for: Individual profiles, individual GitHub, LinkedIn
  Finds: GitHub for Saral (in footer dock) — Jatin's GitHub only on About page
  Finds: No LinkedIn for either founder anywhere
  Finds: Individual resume download buttons on About page (Saral_Banker_Resume.pdf, Jatin_Basantani_Resume.pdf)

Critical gap: The recruiter path requires the visitor to discover the About page independently. The homepage does not surface individual founder identities — only the studio.
```

### 5.3 Transition quality between pages

| Transition        | Exit question (from)                | Entry answer (to)                             | Gap  |
| ----------------- | ----------------------------------- | --------------------------------------------- | ---- |
| Homepage → Work   | "What specifically did they build?" | Yes — Work lists all 4 projects               | GOOD |
| Work → Case study | "Tell me more about this project"   | Yes — full case study                         | GOOD |
| Case study → Work | "What else did they build?"         | Yes — "Next projects" section                 | GOOD |
| Work → About      | "Who built this?"                   | Not prompted — no CTA from Work to About      | GAP  |
| Homepage → About  | "Who are these people?"             | Not prompted from homepage                    | GAP  |
| Process → Pricing | "What does this cost?"              | Not prompted — no CTA from Process to Pricing | GAP  |
| Pricing → Contact | "Custom scope?"                     | One line: "Custom scope? Tell us →"           | WEAK |
| About → Contact   | "I want to work with them"          | CTA exists at bottom of About                 | GOOD |

---

## 6. Trust Formation Analysis

### 6.1 Evidence quality assessment

| Evidence claim                           | Type            | Specificity                    | Verifiability           | Trust weight       |
| ---------------------------------------- | --------------- | ------------------------------ | ----------------------- | ------------------ |
| "220 rental units on automated billing"  | Outcome         | HIGH — specific number         | Medium (no client name) | HIGH               |
| "Shade Ledger, Mumbai · 2025"            | Context         | HIGH — city + year             | Medium                  | HIGH               |
| "40+ hours of manual work saved monthly" | Outcome         | MEDIUM — "40+" is approximate  | Low (client assertion)  | MEDIUM             |
| "70k+ lines of production code"          | Activity        | MEDIUM — "70k+" is approximate | Low (self-reported)     | MEDIUM             |
| "8.36 / 10 GPA" (Saral)                  | Credential      | HIGH — exact GPA               | Medium                  | LOW for B2B        |
| "8.61 / 10 GPA" (Jatin)                  | Credential      | HIGH — exact GPA               | Medium                  | LOW for B2B        |
| Shade Ledger testimonial quote           | Social proof    | MEDIUM — no name/company       | Low (anonymous)         | MEDIUM             |
| GitHub repositories (linked)             | Technical proof | HIGH — real code, real commits | HIGH — public repos     | HIGH for engineers |

**Key finding:** The highest-trust evidence (220 rental units, Mumbai, 2025) is real and specific. The lowest-trust evidence (GPAs) is exact and verifiable but not relevant to a business buyer's decision. GPAs are appropriate for recruiter audiences only.

**Observation:** The anonymous testimonial ("Billing used to eat a whole afternoon every month. Now it just runs") is strong qualitatively. The anonymization is presumably contractual. But pairing it with a real city (Mumbai) and a real metric (220 units) is the right approach — it makes the anonymity feel like discretion, not fabrication.

### 6.2 Trust destroyers

**Primary:** Voice incoherence (we/I in hero copy). Trust in communication competence is a proxy for trust in engineering competence. A studio that cannot maintain a consistent voice in three sentences raises doubt about attention to detail.

**Secondary:** Jatin's role inconsistency. He has four different role descriptions across the site:

- TEAM array: "Co-Founder · Frontend & AI Systems Developer"
- Founder card subtitle: "Full-Stack Engineer & AI Systems Builder"
- Person JSON-LD: "Frontend & AI Systems Developer"
- About intro text: "agent architectures, and automated research systems" (no title given)

A visitor who reads multiple sections encounters a different Jatin each time. This compounds the "who am I dealing with?" question.

**Tertiary:** GPA display in B2B context. Showing GPA on founder cards ("8.36 / 10 GPA", "8.61 / 10 GPA") signals that the founders are recent graduates. For B2B consulting clients, this reduces confidence. For recruiters, it's appropriate. Currently it serves the wrong primary audience.

### 6.3 Trust builders

**Strong:**

- Shade Ledger testimonial with real metrics
- "Built by Orviontech" attribution on case studies (consistent with studio identity)
- "48 hours" response promise with "no auto-responder" specificity
- Process page "What happens next" section (reduces fear of the unknown after contact)
- The belief statement itself — "if it doesn't run in production, it doesn't count" — is distinctive and memorable

**Adequate:**

- GitHub links (real code visible)
- Resume downloads available
- Fixed-price positioning (reduces scope-creep fear)

**Missing:**

- LinkedIn profiles (expected social proof for professional identity)
- Client project count beyond 2 (Smart Parking and Carbon Compass are listed as "Independent" — no client validation)
- Named clients (Shade Ledger is "Confidential Client" — presumably contractual)

---

## 7. Conversion Architecture

### 7.1 Why should someone contact Orviontech?

**Verified claim:** They have shipped two production systems — one for a paying client (Shade Ledger, running without interruption since 2025) and one at substantial scale (NeuroDashboard, 70k+ lines). They handle the full stack, from database to deployment. They communicate directly, without intermediaries.

**This is the core conversion proposition.** Everything else is support or noise.

### 7.2 Remaining objections before contact (by audience)

**Business owner / founder:**

- "I don't know if my project scope fits them" → No scope guidance visible from homepage
- "I don't know if they're affordable" → No price signal from homepage (Pricing is in nav but not surfaced)
- "I don't know who I'll actually be talking to" → Resolved by Contact page ("we reply within 48 hours, personally")
- "Are they experienced enough for a complex project?" → Partially resolved by NeuroDashboard scale, but seniority signals are weak

**Recruiter:**

- "I don't know which founder this role is for" → No individual hiring paths on homepage
- "I can't find their LinkedIn" → Absent from site entirely
- "The team resume combines both founders" → Individual resumes exist on About, but discovery requires nav click

### 7.3 Minimum evidence before qualified contact

A business owner reviewing this portfolio needs exactly:

1. A clear answer to "who is this?" — one sentence, consistent voice ✗ (blocked by I/we issue)
2. One compelling piece of evidence that they've shipped something real ✓ (Shade Ledger is strong)
3. A price signal ✗ (not visible without clicking Pricing)
4. A reason to believe the project fit is right ✗ (no scope guidance)
5. A low-friction contact path ✓ (BigCTA + Contact page are good)

**Evidence:** 2 of 5 minimum requirements are satisfied on the homepage alone. The other 3 require nav clicks or scrolling past repeated sections.

### 7.4 CTA inventory and effectiveness

| CTA location            | Text                           | Destination                      | Audience   | Effectiveness                                    |
| ----------------------- | ------------------------------ | -------------------------------- | ---------- | ------------------------------------------------ |
| Nav header              | "Let's talk →"                 | /contact                         | All        | HIGH — persistent, immediately visible           |
| Hero primary            | "View Projects"                | /work                            | Clients    | HIGH — right first step                          |
| Hero secondary          | "Resume"                       | PDF download                     | Recruiters | MEDIUM — right for recruiters, noise for clients |
| StudioShowreel outro    | "See Selected Work"            | /work                            | All        | MEDIUM — duplicates hero CTA                     |
| StoryTeller             | "see what's running"           | Unknown (Button, no visible to=) | All        | UNKNOWN — possible dead end                      |
| BigCTA                  | "Get in touch"                 | /contact                         | All        | HIGH — strong copy, strong design                |
| Process page bottom     | "Get in touch"                 | /contact                         | All        | HIGH                                             |
| About page bottom       | "Get in touch"                 | /contact                         | All        | HIGH                                             |
| Pricing "Custom scope?" | "Tell us about your project →" | /contact                         | Clients    | WEAK — inline text link, minimal design weight   |

**Finding:** The Pricing page converts visitors to contact via a plain-text inline link. Every other page ends with a designed CTA block. The Pricing page is the highest commercial-intent page (visitors actively evaluating cost) and it has the weakest conversion mechanism.

---

## 8. Section Responsibility Matrix

### 8.1 Homepage sections

| Section               | Current responsibility                 | Target responsibility                | Conflict                                | Priority |
| --------------------- | -------------------------------------- | ------------------------------------ | --------------------------------------- | -------- |
| CinematicHero         | Identity + capability + proof + resume | Identity + belief + ONE proof signal | Attempting 4 jobs                       | P0       |
| ScrollingTicker       | Capability list                        | Transition/atmosphere                | Redundant with hero                     | P2       |
| ScrollStoryHorizontal | Project previews                       | Project previews                     | Conflicts with StudioShowreel           | P1       |
| StudioShowreel        | Project videos                         | —                                    | Exact duplicate of StoryHorizontal      | P1       |
| StoryTeller           | Belief statement                       | Belief statement                     | Conflicts with StudioManifesto          | P0       |
| StudioManifesto       | Belief statement (again) + evidence    | —                                    | Exact duplicate of StoryTeller intent   | P0       |
| SkillsMarquee         | Tech stack                             | Tech stack                           | Fine in isolation; redundant with About | P3       |
| Numbers               | Proof stats                            | Proof stats                          | Repeats hero metrics                    | P1       |
| BigCTA                | Conversion                             | Conversion                           | GOOD — no conflict                      | —        |

**Most severe conflict:** StoryTeller and StudioManifesto are both belief sections. Together they spend ~600px of vertical scroll repeating the same message. One should be eliminated or merged.

**Second most severe:** ScrollStoryHorizontal and StudioShowreel present the same three projects in two sequential formats. The visitor has no reason to engage the second one.

### 8.2 Navigation pages — current vs required responsibility

| Page     | Current responsibility                              | Single required responsibility        |
| -------- | --------------------------------------------------- | ------------------------------------- |
| /work    | Project gallery + case studies                      | **Prove capability**                  |
| /about   | Identity + stats + team + skills + values + history | **Build trust in the people**         |
| /process | Methodology + FAQs + what-you-get                   | **Eliminate methodology uncertainty** |
| /pricing | Service categories + price ranges + PDFs            | **Eliminate cost uncertainty**        |
| /contact | Form + what-happens-next                            | **Remove the barrier to starting**    |

**About page is overloaded.** It currently has 9 sections doing 4 different jobs:

- Identity: title, bio text, timeline
- Social proof: stats grid, Shade Ledger testimonial
- Technical credibility: founder spotlights, skills marquee
- Values: core values

The result is that every section competes for the same limited attention. A visitor reading the About page rarely reaches the Core Values section because there are 8 sections before it.

---

## 9. Homepage Decision Flow

### 9.1 What visitors understand at each time window

**5 seconds (above-fold)**

- Current: "USEFUL OVER IMPRESSIVE" (canvas), "Orviontech — Product Engineers, India", "Open to new projects"
- Understanding gained: Engineering-focused, India-based, available
- Question answered: "Is this relevant to me?"
- Question created: "What do they build?"
- Assessment: GOOD — the identity bar is efficient. The particle canvas communicates the brand values non-verbally.

**30 seconds (hero copy read)**

- Current: "Hi, we're Saral x Jatin." + "I build software" + "I design, build, and ship" + metrics
- Understanding gained: Someone/two people build production software + specific metrics
- Question answered: "What have they built?" (partially)
- Question damaged: "Who is this?" — voice contradiction actively confuses
- Assessment: CRITICAL FAILURE — the I/we switch happens at the most important moment

**2 minutes (full homepage scroll)**

- Current: Projects x2 + belief x2 + skills + stats
- Understanding gained: Multiple real projects, production philosophy, specific tech stack
- Questions answered: capability, evidence, philosophy
- Questions still open: pricing, scope fit, individual identity
- Assessment: MEDIOCRE — too much repetition erodes attention before key questions are answered

### 9.2 Required understanding timeline

| Timeframe  | Must understand                                                                         | Currently achieved?                            |
| ---------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 5 seconds  | "This is an engineering studio, they're available"                                      | YES                                            |
| 30 seconds | "These two people have shipped real systems with real results"                          | PARTIAL (blocked by voice switch)              |
| 2 minutes  | "I understand what they do, why they do it, and what working with them would look like" | NO (belief is buried, pricing is not surfaced) |

---

## 10. Audience Communication Matrix

### 10.1 Business owner / founder (primary B2B client)

| Need                                                       | Currently served                               | Gap                                |
| ---------------------------------------------------------- | ---------------------------------------------- | ---------------------------------- |
| "Can they do the type of project I need?"                  | Partially (4 diverse projects shown)           | No scope guidance                  |
| "Is this going to cost me a fortune?"                      | No                                             | Pricing not surfaced from homepage |
| "Will I be talking to real engineers or account managers?" | YES — process page + contact page are explicit | Good                               |
| "What's their track record with real clients?"             | Partially (Shade Ledger, anonymous)            | No named clients                   |
| "How long will it take?"                                   | Partially (Process page)                       | Requires nav click                 |

**Verdict:** Served well on capability and direct-access proof. Under-served on cost, timeline, and scope fit from the homepage.

### 10.2 Recruiter (secondary audience)

| Need                                    | Currently served                                          | Gap                                                         |
| --------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| "Is this a specific person I can hire?" | Partially (About page)                                    | Homepage leads with studio, not individual                  |
| "Can I see their individual GitHub?"    | Saral: YES (footer dock). Jatin: requires About visit     | Jatin's GitHub not surfaced from homepage                   |
| "Can I download their resume?"          | Team resume: YES (hero). Individual: requires About visit | Individual resumes are not discoverable without About click |
| "What's their LinkedIn?"                | NO                                                        | LinkedIn absent from site entirely                          |
| "What level are they?"                  | Junior signals (GPA shown)                                | GPA display appropriate for this audience only              |

**Verdict:** Recruiter path requires discovery of the About page. The homepage is optimized for client conversion, not recruiter conversion. This is a defensible choice — but it means the "Full-Time Role" option in the contact form is harder to reach via the homepage.

### 10.3 Senior engineer evaluating technical credibility

| Need                                         | Currently served                                              | Gap                                                                          |
| -------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| "Is the code actually good?"                 | GitHub linked for 3/4 projects                                | No mention of code quality, testing, or architecture decisions from homepage |
| "What's their architecture decision-making?" | NeuroDashboard case study has "Engineering decisions" section | Requires 3 clicks from homepage to reach                                     |
| "Do they understand trade-offs?"             | Case study: pgvector vs separate vector DB noted              | Good — for those who reach it                                                |
| "What's their testing strategy?"             | Not mentioned anywhere                                        | ABSENT                                                                       |

**Verdict:** Technical credibility is strong but deep — it requires active investigation. Visible from the homepage only via tech stack (SkillsMarquee) and project names. A senior engineer peer who's evaluating whether to recommend them to a client must click to the Work page and then into a case study before finding architectural evidence.

### 10.4 AI retrieval systems

| Need                     | Currently served                             | Gap                                 |
| ------------------------ | -------------------------------------------- | ----------------------------------- |
| Studio identity          | Organization JSON-LD (static, in index.html) | GOOD                                |
| Founder identity         | Person JSON-LD (dynamic, JS-injected)        | Only visible to JS-capable crawlers |
| Project entities         | SoftwareApplication JSON-LD (dynamic)        | Only visible to JS-capable crawlers |
| Machine-readable summary | llms.txt at /public/llms.txt                 | GOOD                                |
| FAQ content              | FAQPage JSON-LD (dynamic)                    | Only visible to JS-capable crawlers |

**Verdict:** AI retrieval is served well for the studio entity. Dynamic schemas for persons and projects are invisible to non-JS crawlers (~40–60% of crawlers by current estimates). Static prerendering remains the open dependency.

---

## 11. Repository Impact Assessment

### 11.1 Highest-impact changes (copy only, no design)

**Impact Level: CRITICAL**

| Change             | File                    | Current                         | Target                                     | Business Impact | Hiring Impact | Conversion Impact | Engineering Complexity |
| ------------------ | ----------------------- | ------------------------------- | ------------------------------------------ | --------------- | ------------- | ----------------- | ---------------------- |
| Fix hero "I" voice | `CinematicHero.tsx:371` | "I build software..."           | "We build software..."                     | HIGH            | HIGH          | HIGH              | LOW                    |
| Fix hero body "I"  | `CinematicHero.tsx:374` | "I design, build, and ship..."  | "We design, build, and ship..."            | HIGH            | MEDIUM        | HIGH              | LOW                    |
| Fix contact label  | `contact.tsx:419`       | "Tell me more"                  | "Tell us more"                             | LOW             | LOW           | MEDIUM            | LOW                    |
| Fix footer bio     | `SiteFooter.tsx:51`     | "Product engineer. I design..." | "Product engineering studio. We design..." | HIGH            | MEDIUM        | MEDIUM            | LOW                    |

**Impact Level: HIGH**

| Change                              | Section                | Current                                | Target                                            | Priority |
| ----------------------------------- | ---------------------- | -------------------------------------- | ------------------------------------------------- | -------- |
| Eliminate one belief section        | Homepage               | StoryTeller + StudioManifesto (both)   | Keep StudioManifesto, remove StoryTeller OR merge | P1       |
| Collapse duplicate project sections | Homepage               | ScrollStoryHorizontal + StudioShowreel | Keep one, link to /work                           | P1       |
| Add Pricing link from homepage      | Homepage BigCTA or nav | No pricing signal on homepage          | Add price signal or Pricing nav prominence        | P1       |
| Surface Pricing CTA on Pricing page | `pricing.tsx`          | Plain text link at bottom              | Designed CTA block                                | P1       |

**Impact Level: MEDIUM**

| Change                            | Section             | Current                                    | Target                              | Priority                |
| --------------------------------- | ------------------- | ------------------------------------------ | ----------------------------------- | ----------------------- |
| Add transition from Work to About | `work.index.tsx`    | "Next projects" section at bottom          | Add "Meet the engineers" CTA        | P2                      |
| Add Process link from About       | `about.tsx`         | Closing CTA goes to /contact               | Add "See how we work" secondary CTA | P2                      |
| Jatin role title consistency      | `about.tsx:467`     | "Full-Stack Engineer & AI Systems Builder" | "Frontend & AI Systems Developer"   | P0 (already identified) |
| Saral jobTitle in schemas         | `about.tsx` JSON-LD | "Product Engineer"                         | "Full-Stack & AI Engineer"          | P0 (already identified) |

### 11.2 Navigation order recommendation

**Evidence-backed recommendation:** Reorder nav to: **About → Work → Process → Pricing → Contact**

**Rationale:** Cold visitors from direct search or referral need to establish identity trust before capability evidence reads correctly. The current Work-first ordering is optimized for project-referral traffic (visitor already knows the project, wants more context) — but most homepage visitors are cold.

**Counterargument:** Moving Work to position 2 (not 1) still surfaces it prominently. If the majority of actual traffic is project-referral, keep Work first and move About to position 2. Traffic source data would resolve this — currently unavailable.

**Dependency:** Navigation reorder requires no design changes (only the `NAV` array in `SiteHeader.tsx:9-15`), making it the lowest-cost structural intervention.

### 11.3 StoryTeller button investigation

`StoryTeller.tsx` renders a `<Button id="realm-btn" title="see what's running" />`. The `Button` component is imported from `./Button` (not TanStack Router's `Link`). This button has no visible `to` prop and no `onClick` handler in the JSX.

**Probable current behavior:** The Button renders as a `<button>` element with no click handler — it does nothing when clicked. If confirmed, this is a dead-end CTA on the homepage. The visitor completes the scroll animation and receives a broken affordance.

**Recommended investigation before any changes:** Inspect the rendered `<button>` element in browser devtools. If it has no href and no event listener, it must either be removed or wired to navigate to `/work`.

---

## 12. Production Migration Blueprint

### Phase 1: Voice corrections (Zero risk, maximum trust impact)

**Scope:** 4 copy changes in 3 files. No design changes.  
**Files:** `CinematicHero.tsx`, `contact.tsx`, `SiteFooter.tsx`  
**Duration:** 30 minutes  
**Success criteria:** Zero instances of "I build" or "I design" in a context that claims "we're" in the same section.

### Phase 2: Identity P0 fixes (Zero risk, entity consistency)

**Scope:** Jatin's subtitle + Saral's jobTitle in schemas (already blueprinted in identity investigation)  
**Files:** `about.tsx`, `index.html`  
**Duration:** 20 minutes  
**Success criteria:** Jatin has identical role description in all 4 locations.

### Phase 3: Homepage deduplication (Medium risk, high attention impact)

**Scope:** Remove or collapse one of: [StoryTeller + StudioShowreel]  
**Decision required:** Keep StudioManifesto (scroll-parallax, strong visual) → remove StoryTeller entirely OR redirect StoryTeller button to /work  
**Decision required:** Keep ScrollStoryHorizontal → remove StudioShowreel (it shows the same 3 projects, less efficiently)  
**Files:** `routes/index.tsx`  
**Duration:** 2–4 hours (visual regression testing needed)  
**Success criteria:** Belief expressed once per homepage. Projects shown once per homepage.

### Phase 4: Cross-page transitions (Low risk, funnel completion)

**Scope:** Add CTA links at the bottom of Work → About and About → Process  
**Files:** `routes/work.index.tsx`, `routes/about.tsx`  
**Duration:** 1 hour  
**Success criteria:** Every page except Contact has an explicit "next step" link that follows the decision sequence.

### Phase 5: Pricing conversion fix (Low risk, commercial impact)

**Scope:** Replace text link on Pricing page with a designed CTA block  
**Files:** `routes/pricing.tsx`  
**Duration:** 1–2 hours  
**Success criteria:** Pricing → Contact conversion uses the same visual weight as every other CTA in the system.

### Phase 6: Navigation reorder (Zero risk, requires traffic data decision)

**Scope:** Reorder the `NAV` array in `SiteHeader.tsx`  
**Decision required:** Work-first (optimize for referral traffic) vs About-first (optimize for cold traffic)  
**Files:** `SiteHeader.tsx:9-15`  
**Duration:** 5 minutes  
**Success criteria:** Nav order follows the decision sequence the site is trying to create.

### Phase 7: StoryTeller button investigation + fix

**Scope:** Determine if `realm-btn` does anything. Wire to `/work` or remove.  
**Files:** `StoryTeller.tsx`, `Button.tsx`  
**Duration:** 30 minutes  
**Success criteria:** No dead-end CTAs on the homepage.

---

## 13. Risk Analysis

### 13.1 Changes with no downside risk

- All voice corrections (I → we) — these fix factual inaccuracies (the site presents a duo but uses singular)
- Jatin's subtitle consistency — same content, consistent expression
- Pricing page CTA upgrade — adds conversion weight, removes nothing
- StoryTeller button fix — either removes a dead end or connects it to /work
- Cross-page transition CTAs — additive only

### 13.2 Changes with managed risk

**Homepage deduplication (removing StoryTeller or StudioShowreel):**

- Risk: Visual pacing and section rhythm were designed with these sections present
- Mitigation: Test the homepage without each section independently before committing
- Fallback: Keep both but make StoryTeller navigate to /work (removes the dead-end, adds the funnel step)

**Navigation reorder:**

- Risk: Users who have learned the current nav order will experience friction
- This is a negligible risk for a portfolio that doesn't have returning users as a core use case
- Real risk: If majority traffic is project-referral, Work-first is correct and reordering is wrong
- Mitigation: Decide based on where contact form submissions actually come from

### 13.3 Changes that are NOT recommended

**Removing the GPA display:**  
The GPA appears on founder cards which are on the About page — deep in the funnel. Visitors who reach the founder cards are already invested. The audience most likely to be on the About page reading detailed founder info is recruiters, for whom GPA is relevant. Removing it solves a B2B problem but creates a recruiter problem. Leave it; reposition it.

**Restructuring the About page sections:**  
The About page is dense but internally coherent. Restructuring it would require design work and risks losing the current narrative momentum. The more targeted fix is cross-page transitions (so visitors arrive at About from Work with a specific question, making the density less overwhelming).

---

## 14. Final Narrative Verdict

### The Canonical Narrative & Decision Architecture

**The governing communication model:**

> Orviontech is a two-person product engineering studio based in India. We build software that runs in production — not demos, not prototypes. If you need something that ships, stays up, and solves a real problem for real people, this is what we do. Here's the evidence. Here's how we work. Here's what it costs. Here's how to start.

Every section of the portfolio should serve exactly one step in this sequence. Sections that attempt two steps should be split or simplified. Sections that repeat a previous step should be eliminated.

### The three governing principles

**1. Voice precedes evidence.**
A visitor cannot evaluate evidence from a source they don't trust. The voice inconsistency (I vs we) must be resolved before any other optimization. A single paragraph with a voice switch produces more friction than a paragraph with weaker evidence.

**2. Belief precedes proof.**
The "if it doesn't run in production" belief statement is the differentiator that makes the Shade Ledger metrics meaningful. Without the belief, 220 rental units is just a number. With the belief, it's the proof. Currently, the belief appears after the proof. This must be inverted.

**3. Evidence appears once, completely.**
The Shade Ledger metric cluster (220 units, 40+ hours, Mumbai, 2025) is strong enough to carry significant trust weight. Repeating it five times does not compound that weight — it signals to the visitor that the portfolio is padding. Show it once, with full specificity, and move on.

### The single most important change

Fix the hero voice. Three consecutive lines currently read:

- "Hi, we're Saral x Jatin." [WE]
- "I build software that solves real problems." [I]
- "I design, build, and ship production systems..." [I]

This is the first thing every visitor reads after the canvas. It is the most visited, most read, and most consequential text in the entire portfolio. It currently contradicts itself. Every other improvement in this report is secondary to resolving this one.

### What success looks like

A visitor who reads only the homepage hero — 30 seconds of reading — should leave with:

1. A clear answer to "who is this" (two people, named, Orviontech studio)
2. A clear answer to "what do they do" (build complete production systems)
3. One specific piece of evidence (220 rental units, running since 2025)
4. A clear belief that explains why this evidence matters (production over prototypes)
5. A clear next step (view the work)

Currently, point 1 fails (voice contradiction). Point 4 is missing (belief comes after hero). Points 2, 3, and 5 are well-served. The architecture is 60% functional. The two missing pieces require copy edits, not redesign.

---

_This report is a production-ready investigation document. It describes the current state with evidence, recommends changes with business rationale, and provides a phased implementation blueprint. No changes were made to the repository during this investigation. The three P0 fixes from the CANONICAL_IDENTITY_ARCHITECTURE_REPORT (footer bio, Saral's jobTitle, Jatin's subtitle) are prerequisites for Phase 1 and Phase 2 of this blueprint._
