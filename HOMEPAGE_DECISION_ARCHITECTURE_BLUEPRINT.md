# Homepage Decision Architecture Blueprint

## Orviontech — Production-Ready Communication Structure

**Date:** 2026-07-02  
**Scope:** Investigation only. No implementation. No copy rewrites. No UI changes.  
**Evidence base:** Full repository audit + strategic documents from prior investigations.  
**Prerequisite:** CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md, NARRATIVE_DECISION_ARCHITECTURE_REPORT.md

---

## 1. Executive Summary

The Orviontech homepage has the right evidence and the wrong sequence.

The strongest asset in the portfolio — the Shade Ledger story — is distributed across five different sections, which means it is everywhere and nowhere simultaneously. A visitor who reads only the hero sees a number ("220 rental units") without understanding why it is significant. A visitor who reads to the StudioManifesto (section 6 of 9) finally receives the full picture: what Shade Ledger replaced, why it matters, and what it proves. By that point, 60–70% of visitors have already formed their opinion or left.

Three structural failures make the current homepage underperform its evidence:

**Failure 1: Proof appears before belief establishes why the proof matters.**
The homepage leads with capability claims and project showcases. The belief that explains WHY these projects matter ("if it doesn't run in production, it doesn't count") appears after two showreel sections. Without the belief, the evidence is just numbers. With the belief, it is a differentiated engineering philosophy made concrete.

**Failure 2: The primary evidence is repeated five times and presented completely zero times.**
The "220 rental units / 40+ hours saved" fact appears in the ticker, the showreel, the manifesto, the Numbers section, and the About page. In no single instance does the full Shade Ledger story appear on the homepage — the client context, the before/after (replacing Excel and phone calls), the ongoing live status, and the specific business outcome — all in one place.

**Failure 3: The homepage asks visitors to make eleven decisions instead of one.**
Current section count: 9. Competing CTAs visible simultaneously at various scroll depths: at least 5 different link destinations. The single decision the homepage should create — "contact Orviontech" — is diffused by CTA competition and redundant sections that do not advance the visitor's confidence.

The canonical fix is not a redesign. It is a resequence + deduplication.

---

## 2. Governing Communication Strategy

### 2.1 The single governing principle

> The homepage is a sequential trust-building machine. Every section removes exactly one uncertainty. Sections that remove a previously removed uncertainty are structurally redundant and must be eliminated or merged.

### 2.2 The target visitor experience

A qualified visitor who completes the homepage journey should leave with one coherent memory:

_"These two engineers build software that actually runs in production. They've done it for a real client. The work is specific, verifiable, and impressive at the right scale for my project. I know how to start a conversation with them."_

### 2.3 The governing hierarchy of communication

```
Belief (WHY they exist)
  └── Evidence (PROOF the belief is operational)
       └── Capability (WHAT they build)
            └── Process (HOW they work)
                 └── Identity (WHO they are in full detail)
                      └── Action (HOW to start)
```

Currently the homepage inverts this. Capability appears before Belief. Evidence is scattered rather than presented. Process is not signaled from the homepage. Identity is established only partially (and with a voice contradiction). The action (CTA) is strong, but it comes at the end of an exhausted visitor's attention.

### 2.4 Strategy for the primary audience

**Primary:** Founders, business owners, non-technical buyers evaluating whether to hire Orviontech for a project.

These visitors are buying with trust, not specifications. They need:

1. Confidence that the engineers understand the type of problem they have
2. Evidence that the engineers have solved that type of problem before
3. Assurance that working with them is clear and low-risk
4. A price signal (even a range) so they can self-qualify before the conversation

### 2.5 Strategy for the secondary audience

**Secondary A (Recruiters):** Need individual identity → individual GitHub → individual resume. The homepage should not block this path. A recruiter secondary CTA ("About the engineers →") is sufficient — no restructuring required.

**Secondary B (Technical founders / senior engineers):** Need to see architectural sophistication. The `ProductPreview` panel in the hero (showing Knowledge Hub, Shade Ledger, BullMQ) already serves this audience without disrupting the primary audience flow. This should be preserved.

---

## 3. Current Homepage Audit

### 3.1 Section inventory

| #   | Component               | JSX reference         | Stated purpose                | Actual effect                                                     |
| --- | ----------------------- | --------------------- | ----------------------------- | ----------------------------------------------------------------- |
| 1   | `CinematicHero`         | `routes/index.tsx:55` | Identity + capability + proof | WHO? (compromised by I/we switch) + metrics                       |
| 2   | `ScrollingTicker`       | `routes/index.tsx:57` | Atmospheric capability list   | Filler — restates capability already in hero                      |
| 3   | `ScrollStoryHorizontal` | `routes/index.tsx:62` | Project previews              | Shows 3 projects (Knowledge Hub, Shade Ledger, Smart Parking)     |
| 4   | `StudioShowreel`        | `routes/index.tsx:68` | Video showreel                | Shows SAME 3 projects in video format                             |
| 5   | `StoryTeller`           | `routes/index.tsx:71` | Belief statement              | "if it doesn't run in production" — dead-end CTA suspected        |
| 6   | `StudioManifesto`       | `routes/index.tsx:74` | Belief + evidence             | Strongest written section — appears at 65% scroll depth           |
| 7   | `SkillsMarquee`         | `routes/index.tsx:76` | Tech stack                    | Relevant for technical audience; positioned poorly for all others |
| 8   | `Numbers`               | `routes/index.tsx:78` | Proof stats                   | Repeats hero metrics (220, 40+, 70k+)                             |
| 9   | `BigCTA`                | `routes/index.tsx:80` | Conversion                    | GOOD — strong copy and design                                     |

### 3.2 Section overlap analysis

| Evidence claim                    | Section appearances                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| "220 rental units"                | Sections 1 (metrics), 3 (showreel desc), 4 (showreel), 6 (manifesto), 8 (Numbers) = 5 times |
| "40+ hours saved monthly"         | Sections 1, 4, 6, 8 = 4 times                                                               |
| "if it doesn't run in production" | Sections 5 (StoryTeller title), 6 (Manifesto para 3 implied), footer = 3 times              |
| "70k+ lines of production code"   | Sections 1, 8 = 2 times                                                                     |
| Shade Ledger case (complete)      | 0 times — always presented partially                                                        |

### 3.3 Verified dead end

`StoryTeller.tsx` renders `<Button id="realm-btn" title="see what's running" containerClass="...">` via a `Button` component imported from `./Button`. This `Button` is not a TanStack Router `Link`. No `href`, no `to`, no `onClick` prop is passed from the `StoryTeller` JSX.

**Status:** Probable dead-end CTA. A visitor who reads "see what's running" and clicks receives no response. This is not confirmed without browser devtools inspection — but the JSX provides no navigation target.

**Business impact:** If confirmed, this is a trust-destroying moment. Visitors who interact with a non-functional call to action form a negative impression of product quality, which directly contradicts the "production-first" positioning.

### 3.4 Hero voice audit (verified, exact quotes)

```
Line 1 (hero h2, CinematicHero.tsx:368): "Hi, we're Saral x Jatin."     → WE
Line 2 (hero p bold, line 371):          "I build software that solves..." → I
Line 3 (hero p body, line 374):          "I design, build, and ship..."    → I
```

Three consecutive visible sentences. Two pronouns. One is incorrect.

---

## 4. Information Architecture Audit

### 4.1 What information exists on the homepage

| Information category                   | Present?             | Location                    | Density                     |
| -------------------------------------- | -------------------- | --------------------------- | --------------------------- |
| Studio identity (who)                  | YES                  | Hero identity bar + h2      | Single line                 |
| Founder names                          | YES                  | Hero h2                     | Named once                  |
| Engineering belief (why)               | YES                  | Sections 5, 6               | Verbose — two full sections |
| Client evidence (Shade Ledger)         | PARTIAL              | Scattered across 4 sections | Never complete              |
| Project capability (what we build)     | YES                  | Sections 3, 4               | Twice                       |
| Tech stack (how we build)              | YES                  | Section 7                   | Once                        |
| Quantified proof (stats)               | YES                  | Sections 1, 8               | Twice                       |
| Process (how to work with us)          | NO                   | Not present on homepage     | Missing                     |
| Pricing signal                         | NO                   | Not present on homepage     | Missing                     |
| Next step (what happens after contact) | Implicit in CTA copy | Section 9                   | Inadequate                  |

### 4.2 Missing information that matters to the primary audience

**Process signal:** A B2B buyer's primary fear is not cost — it is uncertainty. "What happens if I contact them?" and "How do they start a project?" are unresolved questions on the homepage. The Process page exists and answers these questions well, but it requires a nav click. The homepage should provide a 3-line preview that reduces methodology fear before the CTA.

**Pricing signal:** There is no price range, no budget indication, and no pricing link from the homepage. The Pricing page is in the nav but not surfaced in any section. A business owner who self-qualifies on budget cannot do so from the homepage — they must either click Pricing (if they notice it in nav) or contact without knowing if they can afford the work.

**Outcome framing:** "We build software" is a capability claim. "We automated billing for a property owner in Mumbai, saving 40+ hours of manual work every month, for over a year" is an outcome claim. The homepage has the evidence for the outcome framing — it uses the capability framing instead.

### 4.3 Information that should be removed or consolidated

**ScrollingTicker:** Eight capability descriptors ("Find Answers Instantly", "Automate Manual Work", "Production-Ready Systems", etc.) in a looping marquee. These restate what the hero already says. A visitor who reads the hero copy and then encounters the ticker learns nothing new. The ticker's function is atmospheric — it signals motion and breadth. That atmospheric function does not justify its position between the hero and the project sections, where it interrupts the decision flow.

**One of the two project showreel sections:** `ScrollStoryHorizontal` (section 3) and `StudioShowreel` (section 4) show the same three projects in different visual formats. The projects shown are Knowledge Hub, Shade Ledger, Smart Parking. The copy is similar. The CTAs both point to `/work`. No new information is introduced by the second section. One must be eliminated.

**Numbers section (section 8):** Shows 2 systems / 220 rental units / 40+ hours / 70k+ lines. The hero metrics strip already shows these exact figures. If the hero metrics are retained, the Numbers section is pure repetition. If the hero metrics are removed (creating a simpler hero), the Numbers section can serve as the proof consolidation point. Both cannot exist simultaneously without being redundant.

---

## 5. Evidence Architecture Audit

### 5.1 Evidence quality classification

| Evidence                                            | Type             | Quality | Specificity                   | Verifiability           |
| --------------------------------------------------- | ---------------- | ------- | ----------------------------- | ----------------------- |
| "220 rental units, automated billing"               | Business outcome | A       | High (exact number)           | Medium (no client name) |
| "Shade Ledger, Mumbai, 2025"                        | Context          | A       | High (city + year)            | Medium                  |
| "Replacing manual Excel billing and phone calls"    | Before/after     | A       | High (specific comparator)    | Low (self-reported)     |
| "40+ hours of manual work saved monthly"            | Outcome          | B+      | Medium ("40+" is approximate) | Low                     |
| "70k+ lines of production code"                     | Activity         | B       | Medium (approximate)          | Low                     |
| "2 production systems"                              | Activity         | C       | Low (unclear threshold)       | Low                     |
| "USEFUL OVER IMPRESSIVE"                            | Positioning      | B+      | High (specific phrase)        | N/A                     |
| "if it doesn't run in production, it doesn't count" | Belief           | A       | High (specific principle)     | N/A                     |
| Knowledge Hub (RAG, 12k+ docs)                      | Technical        | A       | High (specific scale)         | High (GitHub)           |

### 5.2 Evidence sequence (where each piece appears in the scroll)

```
0%   — Hero: metrics strip (2, 220+, 40+, 70k+) — PROOF NUMBERS without context
10%  — Ticker: capability descriptors — CLAIMS without proof
15%  — ScrollStoryHorizontal: project names, taglines — PROOF NAMES without outcomes
30%  — StudioShowreel: project videos, "220 rental units" in video desc — PARTIAL PROOF
50%  — StoryTeller: "if it doesn't run in production" — BELIEF (45% too late)
60%  — StudioManifesto: belief + "Shade Ledger has billed 220 rental units" — BELIEF + FULL CONTEXT (55% too late)
75%  — SkillsMarquee: tech stack — TECHNICAL SIGNALS
80%  — Numbers: same metrics again — REPEATED PROOF
95%  — BigCTA: conversion — ACTION
```

**Critical finding:** The belief statement appears at 50% scroll depth. The full Shade Ledger story (with its "before" state — replacing Excel billing and phone calls) appears at 60% scroll depth. Both pieces of information that transform raw metrics into meaningful proof arrive after the majority of visitor attention has been spent.

### 5.3 The Shade Ledger assembly problem

The Shade Ledger evidence is the single most powerful asset in the portfolio. It is never presented as a complete story on the homepage. A visitor must mentally assemble it from fragments:

| Fragment                                         | Where found                          |
| ------------------------------------------------ | ------------------------------------ |
| "220 rental units"                               | Hero metrics, showreel, Numbers      |
| "automated billing"                              | Ticker, showreel, manifesto          |
| "replacing manual Excel billing and phone calls" | NOT on homepage (only in case study) |
| "40+ hours saved monthly"                        | Hero metrics, showreel, Numbers      |
| "running live since 2025"                        | About page (not homepage)            |
| "WhatsApp Business API + react-pdf"              | Case study only                      |
| "Mumbai"                                         | About page testimonial only          |
| "Confidential Client"                            | Case study only                      |

No visitor assembles this picture from homepage reading alone. The "220 units" metric, without the "replacing manual Excel and phone calls" context, is just a number. The context is what makes the number impressive.

### 5.4 Evidence that appears too early

The metrics strip in the hero (2 systems / 220+ / 40+ / 70k+) appears before the visitor understands what these numbers mean. A cold visitor who reads "220 rental units automated" does not know what Shade Ledger is, does not know what it replaced, and cannot evaluate whether 220 is a large or small number for that context. The numbers are not meaningless, but they are premature — they require the context that arrives 60% later in the scroll.

**Supported inference:** For the primary B2B audience (business owners), the Shade Ledger context ("replaced manual Excel billing") creates the emotional resonance that makes "220 units" significant. For a property owner reading the portfolio, "replaced manual Excel billing" is immediately recognizable as a solved problem they have experienced. The metrics without the context are cognitive noise.

---

## 6. Decision Architecture Audit

### 6.1 Decision stage mapping (current state)

| Stage                  | Uncertainty                                | Current section addressing it          | Result                                                                                         |
| ---------------------- | ------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Initial attention      | "Should I keep reading?"                   | Hero canvas ("USEFUL OVER IMPRESSIVE") | ADEQUATE — distinctive visual                                                                  |
| Identity recognition   | "Who is this?"                             | Hero identity bar + h2                 | PARTIAL — voice switch undermines                                                              |
| Problem recognition    | "Is this relevant to my situation?"        | Hero body copy                         | BLOCKED — "I build software that solves real problems" is vague; voice switch creates friction |
| Capability recognition | "Can they do what I need?"                 | Sections 3+4 (projects)                | PARTIAL — shows projects without explaining capability clearly                                 |
| Engineering trust      | "Is the code quality real?"                | ProductPreview (technical signals)     | GOOD for technical visitors; invisible for non-technical                                       |
| Business trust         | "Have they solved real business problems?" | Manifesto (section 6)                  | LATE — arrives at 60% scroll                                                                   |
| Differentiation        | "Why them over anyone else?"               | Manifesto belief statement             | LATE — same issue                                                                              |
| Confidence             | "Will this work for my project?"           | Missing — no process signal            | ABSENT                                                                                         |
| Commitment             | "I want to contact them"                   | BigCTA                                 | GOOD                                                                                           |
| Qualified contact      | "How do I start?"                          | BigCTA + Contact page                  | GOOD                                                                                           |

**Identified gap:** The "Confidence" stage — where the visitor believes this will work for their specific project — is never addressed on the homepage. The Process page addresses it, but it requires a nav click. A B2B visitor who is not confident about the process does not convert even when they trust the engineers.

### 6.2 Decisions that currently require a nav click

| Decision question                  | Homepage answer              | Required action |
| ---------------------------------- | ---------------------------- | --------------- |
| "How do they approach projects?"   | None                         | Click /process  |
| "How much does this cost?"         | None                         | Click /pricing  |
| "Who exactly are Saral and Jatin?" | Partial (names only in hero) | Click /about    |
| "Can I see the full work?"         | Partial (3 projects shown)   | Click /work     |

None of these questions can be answered from the homepage. For a visitor with a 2-minute attention window who does not click into secondary pages, four of the most conversion-relevant questions go unanswered.

### 6.3 False decisions created by the current structure

**False decision 1: Which project section to engage?**
`ScrollStoryHorizontal` and `StudioShowreel` present the same information in consecutive sections. The visitor implicitly asks "did I need to see this twice?" The answer is no, but the structure forces the question.

**False decision 2: Resume or Projects?**
The hero has two primary CTAs: "View Projects" and "Resume." For a B2B buyer, "Resume" is noise. For a recruiter, "View Projects" is noise. Neither audience receives a clear signal about which action serves them. A single primary CTA with a subordinate "About the engineers" link would serve both audiences more clearly.

**False decision 3: What does the StoryTeller button do?**
"See what's running" is a promising CTA. If it does nothing when clicked, it creates a negative brand experience at a critical moment (the belief statement section, which is the strongest differentiator).

---

## 7. Trust Formation Analysis

### 7.1 Trust curve (current state)

```
Trust
|
HIGH   |                                                    ·· BigCTA
       |                                               ··
       |                                   ·· Manifesto
MEDIUM |                           ·
       |         ·· Showreels ·· StoryTeller
       |   ·· Ticker
       | · Hero (compromised by I/we switch)
LOW    |______________________________________________
       0%                                           100% scroll
```

**Observation:** Trust begins low due to the voice contradiction in the hero. It remains flat through the capability sections (which add information but not trust, because belief hasn't been established). Trust rises sharply at the Manifesto (section 6) when belief + evidence appear together. By that point, most visitors have already made their judgment.

### 7.2 Trust destroyers (verified)

**T1: Voice contradiction (hero).**  
"We're" → "I" in three consecutive lines. Effect: signals inconsistency. Trust proxy for engineering quality.

**T2: Dead-end CTA (StoryTeller button).**  
If "see what's running" does nothing, it signals the studio built a broken interaction into its own showcase. The irony compounds the damage (they claim to build production-quality software; their portfolio has a broken button).

**T3: Evidence repetition without escalation.**  
Seeing "220 rental units" five times without new context each time trains the visitor to discount the number. The fourth time you read "220 units" it registers as padding, not proof.

**T4: Belief arrives after evidence.**  
Without the belief statement, "70k+ lines of production code" and "220 rental units" are data points. With the belief statement, they become proof of a philosophy. Currently, the data points arrive 45 minutes before the philosophy that contextualizes them (in scroll-time terms). The visitor evaluates the data without the interpretive framework.

### 7.3 Trust builders (current, effective)

**T+1: "USEFUL OVER IMPRESSIVE" particle canvas.**  
Immediately signals a values-driven studio. The word "useful" resonates with B2B buyers who have worked with agencies that prioritized aesthetics over outcomes. Effect is pre-verbal — the text doesn't need to be read consciously to register.

**T+2: Shade Ledger specificity.**  
"220 rental units," "Mumbai," and "40+ hours" are specific enough to be credible even without a client name. Specificity is a trust proxy — vague claims ("we've helped many clients") are less trusted than specific ones.

**T+3: "48 hours, personally" on BigCTA/Contact page.**  
This specific response-time commitment reduces post-contact uncertainty. "We reply" vs "I'll personally reply within 48 hours, no auto-responder" are meaningfully different promises. The latter reduces the fear of disappearing into a ticketing system.

**T+4: ProductPreview technical panel.**  
For technical visitors, seeing "RAG over 12k+ docs" and "BullMQ job queue" signals engineering sophistication without requiring them to click through to the case study. This is efficient — one glance communicates "these people know what they're doing."

**T+5: BigCTA copy.**  
"Let's build something that ships" is unusually specific for a CTA — the word "ships" is a deliberate brand-value signal in a 5-word headline. This is effective.

### 7.4 Missing trust builders

**Social proof from a client voice:**  
The About page has a Shade Ledger client testimonial ("Billing used to eat a whole afternoon every month. Now it just runs"). This quote is on the About page only. On the homepage, there is no human voice from a client. Process section on the contact page has the "What happens next" (trust-reducing uncertainty after contact), but no client validation exists on the homepage itself.

**Process assurance:**  
B2B buyers who don't convert often cite "I didn't know what the first step looked like" as the primary reason. The homepage has no process signal. The Process page answers this comprehensively, but it requires discovery.

---

## 8. Question Flow Matrix

Evaluating the nine essential visitor questions against the current homepage:

| Question                         | Answered? | Where                  | Quality                                              | Timing                       |
| -------------------------------- | --------- | ---------------------- | ---------------------------------------------------- | ---------------------------- |
| "Who are you?"                   | PARTIAL   | Hero identity bar + h2 | Compromised by voice switch                          | Correct (first)              |
| "Why should I care?"             | PARTIAL   | Hero body copy         | Vague ("real problems")                              | Correct (second) — but vague |
| "What exactly do you build?"     | PARTIAL   | Sections 3+4           | Shows projects; not outcomes                         | Section 3 (~15% scroll)      |
| "Can you solve my problem?"      | NO        | Not directly addressed | No problem categories, no scope guidance             | Never                        |
| "Why should I trust you?"        | PARTIAL   | Manifesto + Numbers    | Evidence present but poorly timed                    | Section 6 (~60% scroll)      |
| "Why are you different?"         | YES       | Manifesto belief       | Strong copy — but at 60% scroll                      | Section 6 — too late         |
| "How do you work?"               | NO        | Not on homepage        | Answered on /process only                            | Never                        |
| "What happens if I contact you?" | NO        | Not on homepage        | Answered on /contact only                            | Never                        |
| "Why should I do that today?"    | PARTIAL   | BigCTA                 | "Something that ships" is compelling; urgency absent | Section 9 (95% scroll)       |

**Questions answered zero times on homepage:**

- "Can you solve my problem?" (scope guidance)
- "How do you work?" (process)
- "What happens if I contact you?" (post-contact clarity)

These three questions are the primary reasons qualified visitors leave without contacting.

---

## 9. Current vs Target Homepage Structure

### 9.1 Current structure

```
1. CinematicHero         → WHO (broken) + CAPABILITY CLAIM + METRICS + PROJECTS PREVIEW
2. ScrollingTicker       → CAPABILITY LIST (redundant)
3. ScrollStoryHorizontal → PROJECTS × 1
4. StudioShowreel        → PROJECTS × 2 (same content, different format)
5. StoryTeller           → BELIEF (dead-end CTA)
6. StudioManifesto       → BELIEF (repeat) + EVIDENCE CONTEXT (too late)
7. SkillsMarquee         → TECH STACK
8. Numbers               → METRICS (repeat of hero)
9. BigCTA                → ACTION
```

**Count:** 9 sections. 2 redundant project sections. 2 redundant belief sections. 2 redundant metric instances. 0 process signals. 0 pricing signals. 1 dead-end CTA.

### 9.2 Target structure

```
1. CinematicHero         → WHO (fixed voice) + BELIEF SIGNAL + ONE CTA
2. [Belief section]      → BELIEF IN FULL — the "why this matters"
3. [Featured evidence]   → SHADE LEDGER COMPLETE STORY (once, completely)
4. [Capability section]  → PROJECTS (once — either ScrollStoryHorizontal or StudioShowreel, not both)
5. [Process signal]      → 3 STEPS: how to start, what to expect (new section or inline)
6. [Tech/proof]          → TECH STACK OR NUMBERS (one location, not two)
7. BigCTA                → ACTION
```

**Count:** 7 sections. 0 redundant sections. 1 belief location. 1 evidence location. 1 project section. 1 process signal. 1 metric location. 1 CTA.

**Net removal:** ScrollingTicker (atmospheric, not decision-relevant) + one of [StudioShowreel / ScrollStoryHorizontal] + one of [Numbers / hero metrics strip].

**Net addition:** Featured evidence section (Shade Ledger complete story) + Process signal (3 steps).

### 9.3 Section-by-section transformation

| Current               | Status             | Target                                         |
| --------------------- | ------------------ | ---------------------------------------------- |
| CinematicHero         | KEEP + FIX VOICE   | WHO (we) + belief canvas signal + single CTA   |
| ScrollingTicker       | REMOVE             | Capability is in hero; ticker adds noise       |
| ScrollStoryHorizontal | KEEP               | Projects — one project section                 |
| StudioShowreel        | REMOVE or MERGE    | Redundant with ScrollStoryHorizontal           |
| StoryTeller           | REPURPOSE or MERGE | Belief content → move before projects          |
| StudioManifesto       | KEEP + MOVE        | Move to section 2 (before projects)            |
| SkillsMarquee         | KEEP               | Technical credibility — positioned after proof |
| Numbers               | CONDITIONAL        | Keep only if hero metrics strip is removed     |
| BigCTA                | KEEP               | Effective — no changes needed                  |

**New section needed:** Featured evidence section showing the complete Shade Ledger story (before state, after state, live status, specific outcome) — this is the one section the homepage is missing.

**New section needed:** 3-step process signal (inline or as a lightweight section) that reduces post-contact uncertainty for B2B buyers.

---

## 10. Section Responsibility Matrix

### 10.1 Each section — one responsibility

| Section               | Single responsibility                     | Currently doing                        | Conflict?                           |
| --------------------- | ----------------------------------------- | -------------------------------------- | ----------------------------------- |
| CinematicHero         | **Establish identity and surface belief** | Identity + capability + proof + resume | YES — 4 responsibilities            |
| ScrollingTicker       | None (remove)                             | Atmospheric filler                     | N/A                                 |
| ScrollStoryHorizontal | **Show project range (once)**             | Project previews                       | NO — if showreel is removed         |
| StudioShowreel        | None (remove)                             | Duplicate project previews             | CONFLICT with ScrollStoryHorizontal |
| StoryTeller           | **Belief statement anchor**               | Belief + suspected dead-end CTA        | CONFLICT with StudioManifesto       |
| StudioManifesto       | **Belief + evidence context**             | Same as StoryTeller                    | CONFLICT with StoryTeller           |
| SkillsMarquee         | **Technical credibility signal**          | Tech stack                             | NO CONFLICT                         |
| Numbers               | **Quantified proof**                      | Same metrics as hero                   | CONFLICT with hero metrics          |
| BigCTA                | **Conversion**                            | Conversion                             | NO CONFLICT                         |

### 10.2 Conflict resolution decisions

**StoryTeller vs StudioManifesto (both are belief sections):**

The `StudioManifesto` contains the stronger content:

- Three distinct philosophical paragraphs that build on each other
- Ends with the Shade Ledger reference ("Shade Ledger has billed 220 rental units, automatically, every month, for over a year") — the only place on the homepage where belief + evidence appear in the same sentence
- Scroll-parallax animation and horizontal rule draws add visual distinction
- The `"01 Core Belief"` editorial marker is a narrative anchor

The `StoryTeller` contains:

- The belief statement as a large visual headline ("if it doesn't run / in production")
- An animated canvas (the clock/ring animation)
- A "see what's running" button with a suspected dead end
- A descriptive paragraph

**Decision:** Keep StudioManifesto. For StoryTeller, either: (a) wire the button to `/work` and move the section before StudioManifesto (serves as visual intro to the belief), or (b) merge StoryTeller's visual headline into StudioManifesto's header and remove StoryTeller entirely. Option (a) preserves the distinct visual without the dead end. Option (b) is simpler. This is an implementation decision, not an architectural one.

**ScrollStoryHorizontal vs StudioShowreel (both show same 3 projects):**

`ScrollStoryHorizontal` is listed first and presumably handles the initial project reveal. It shows Knowledge Hub, Shade Ledger, Smart Parking as horizontal-scroll cards with taglines and descriptions.

`StudioShowreel` shows the same three items as full-screen video panels with a pink background, a different visual treatment, and an outro CTA panel linking to `/work`.

**Decision:** One must be removed. The `StudioShowreel` is visually more distinctive (full-screen video, pink brand background) and has the better closing CTA. The `ScrollStoryHorizontal` is more information-dense but secondary in impact. However, the recommendation to move belief content before projects means both sections need evaluation against the new structure. Either can serve the "project capability" slot — only one should.

**Numbers vs hero metrics strip:**

The hero metrics strip (inside `CinematicHero`) shows: 2 / 220+ / 40+ / 70k+.
The Numbers section shows: 2 / 220 / 40+ / 70k+ with animated counters and SpotlightCard design.

**Decision:** Remove the hero metrics strip. Keep the Numbers section.

Rationale: In the target structure, the hero's responsibility is establishing identity and surfacing belief — not proof. Proof should come after the belief statement (when the visitor understands why the proof is significant). Moving the metrics to the Numbers section (which comes after the belief and evidence sections) means they arrive at the right time with the right interpretive context.

---

## 11. Visitor Journey Map

### 11.1 Target visitor journey (5-second to contact)

**0–5 seconds (above-fold, first impression)**

Visitor sees:

- "USEFUL OVER IMPRESSIVE" — particle canvas headline (immediately distinguishes from a typical dev shop)
- "Orviontech — Product Engineers, India" — identity bar
- "Open to new projects" — availability signal

Decision created: "This is different from typical agency language. Continue."
Question created: "Who are these people and what have they built?"
Trust level: Neutral → slight positive (distinctive positioning)

**5–30 seconds (hero body read)**

Visitor reads:

- "Hi, we're Saral x Jatin." [FIXED: consistent we]
- Belief-aligned value proposition [FIXED: "we build software" — no I/we switch]
- Primary CTA: "See our work"
- Secondary signal: ProductPreview panel (technical proof for technical visitors)

Decision created: "I want to see what they've actually built."
Question created: "Have they solved a problem like mine?"
Trust level: Building — identity is clear and consistent

**30–90 seconds (belief + evidence section)**

Visitor reads the StudioManifesto (in target structure, this is section 2):

- "Most software stays a demo — a prototype that never reaches a real user."
- "Shipping the whole stack, database to deployment, is what turns a prototype into a product."
- "Real systems run for real people, every day — Shade Ledger has billed 220 rental units, automatically, every month, for over a year."

Decision created: "They understand the difference between demo software and production software. That's the problem I've had with other developers."
Question created: "Tell me more about Shade Ledger."
Trust level: SIGNIFICANT JUMP — belief + specific evidence create a credibility anchor

**90 seconds – 3 minutes (featured evidence + projects)**

Visitor sees the Shade Ledger complete story (target: new featured evidence section):

- Before state (manual Excel billing, phone calls, 40+ hours/month)
- After state (automated, WhatsApp reminders, PDF invoices, penalty tracking)
- Live status (running since 2025, no interruption)
- Scale (220 units, Mumbai)

Then: Project gallery (one section) showing other work.

Decision created: "This is a real, specific thing they built for a paying client that is still running. I trust the capability."
Question created: "What would it be like to work with them?"
Trust level: HIGH — evidence is specific, contextual, and verifiable at the right level

**3–5 minutes (process signal + tech stack)**

Visitor sees a 3-step process signal:

- Step 1: Understand scope (Discover)
- Step 2: Build together (Build)
- Step 3: Ship to production (Ship)

And tech stack marquee.

Decision created: "I know what the first step looks like. It's low-risk to reach out."
Question created: "How do I start?"
Trust level: HIGH — fear of the unknown (biggest B2B conversion blocker) is reduced

**5 minutes (BigCTA)**

Visitor arrives at: "Let's build something that ships."
Decision: CONTACT
Trust level: MAXIMUM — all major uncertainties resolved

### 11.2 Where visitors currently exit (before target state)

**Exit point 1: Hero** (I/we voice switch)
Trigger: Cognitive friction from voice incoherence. Visitor subconsciously devalues communication quality.

**Exit point 2: After second project section**
Trigger: "Why am I seeing the same projects again?" Repetition signals padding.

**Exit point 3: StoryTeller dead-end CTA**
Trigger: Visitor clicks "see what's running" and nothing happens. Negative brand experience at the belief section.

**Exit point 4: After SkillsMarquee**
Trigger: Visitor has seen React, TypeScript, Node.js before. It doesn't differentiate. If the visitor hasn't been convinced by this point, the tech stack won't save them.

---

## 12. Conversion Architecture

### 12.1 CTA inventory audit

| #   | CTA text             | Location                | Target           | Audience served | Competing with                          |
| --- | -------------------- | ----------------------- | ---------------- | --------------- | --------------------------------------- |
| 1   | "Let's talk →"       | Nav header (persistent) | /contact         | All             | Nothing — persistent CTAs don't compete |
| 2   | "View Projects"      | Hero (primary)          | /work            | B2B buyers      | CTA #3                                  |
| 3   | "Resume"             | Hero (secondary)        | PDF download     | Recruiters      | CTA #2                                  |
| 4   | "See Selected Work"  | StudioShowreel outro    | /work            | All             | CTA #2 (same destination)               |
| 5   | "see what's running" | StoryTeller             | Unknown/dead end | All             | Everything                              |
| 6   | "Get in touch"       | BigCTA                  | /contact         | All             | Nothing                                 |

**CTA competition analysis:**

CTAs 2 and 4 go to the same destination (/work) — they compete with each other for no reason. A visitor who sees "View Projects" in the hero has already been told where to go; the showreel outro CTA is noise.

CTAs 2 and 3 compete for two different audiences. Neither audience receives a clear signal. The "Resume" CTA in the hero primarily serves recruiters — but the hero is written for B2B buyers. This creates a primary/secondary CTA mismatch.

CTA 5 (StoryTeller button) is the highest-risk CTA in the system. If it's a dead end, it actively destroys trust at a critical moment (the belief section).

### 12.2 Optimal CTA architecture

**Hero:**

- Primary: One CTA → `/work` (for B2B buyers who are in capability evaluation mode)
- Secondary signal (not a CTA): "or reach out directly →" anchor to BigCTA section
- Remove: Resume CTA from hero. Resume links belong on the About page (where recruiters naturally land when evaluating individuals).

**StudioManifesto (belief section):**

- No CTA needed — this section should end with the Shade Ledger reference. The visitor's reaction to that reference creates the desire; the CTA comes later.

**Featured evidence section (Shade Ledger):**

- One CTA: "See the full case study →" → `/work/shade-ledger`

**Project gallery section:**

- One CTA: "See all work →" → `/work`

**Process signal section:**

- One CTA: "How we work →" → `/process`

**BigCTA:**

- Unchanged — strong copy, strong design, single action

**Result:** From 6 CTAs (including 1 dead end) to 5 CTAs (all active, no competition, clear audience routing).

### 12.3 Post-contact uncertainty (the last conversion blocker)

The homepage currently provides no answer to "what happens if I contact them?" The Contact page has a "What happens next" section (three steps: We reply → Quick call → We start). This section exists only on the Contact page, which a visitor reaches only after deciding to convert.

**Recommendation:** Surface a lightweight "what happens next" signal (3 lines or 3 cards) as part of the BigCTA section or immediately above it. This is not a full process explanation — it is a post-contact assurance. "We reply within 48 hours, personally. A 15-minute call follows to understand scope. We come back with a real proposal." This reduces the final fear before clicking the CTA.

### 12.4 Pricing signal recommendation

The homepage should include one pricing signal. Not prices — a signal that pricing exists, is transparent, and is fixed-fee. This can be a single line in the hero or in the BigCTA section: "Fixed-fee pricing available. [See pricing →]"

**Rationale (evidence-backed):** B2B buyers who self-qualify on budget before contacting are higher-quality leads. A buyer who contacts without knowing the price range may drop out after the first call. A buyer who has seen "₹20k–₹10L, fixed fee" before contacting arrives qualified. The Pricing page exists — it just isn't surfaced from the homepage at all.

---

## 13. Homepage Risk Analysis

### 13.1 Changes with zero downside risk

- Fix hero voice (I → we): Three copy substitutions. No design changes. Cannot make the page worse.
- Wire StoryTeller button to `/work` or remove the dead-end handler: Pure improvement.
- Add pricing signal as one inline sentence near BigCTA: Additive only.
- Add "what happens next" signal near BigCTA: Additive only.

### 13.2 Changes with managed risk

**Removing ScrollingTicker:**

- Risk: Pacing between hero and project sections may change. The ticker creates a rhythm break.
- Mitigation: The `animated-divider` already handles visual separation between sections. The ticker's atmospheric function can be served by existing dividers.
- Fallback: If visual rhythm feels off without the ticker, the `animated-divider` duration or style can be adjusted without reinstating the full ticker.

**Removing StudioShowreel (or ScrollStoryHorizontal):**

- Risk: One of the most visually distinctive sections disappears.
- Assessment: Visual distinctiveness does not equal communication value. The showreel is visually strong but communicatively redundant with ScrollStoryHorizontal.
- Mitigation: Whichever section is removed, its strongest visual element (the pink full-screen treatment or the horizontal scroll) can potentially be incorporated into the remaining section.

**Moving StudioManifesto to section 2:**

- Risk: The homepage's visual rhythm changes significantly. The manifesto's parallax paragraph animation was designed for a mid-page appearance, not a second-section position.
- Mitigation: The manifesto's internal animation (parallax, horizontal line draw) works at any scroll position. No animation changes are needed — only section reordering.
- Fallback: If moving the full manifesto to section 2 feels tonally premature (before any project context), the belief statement can be surfaced in the hero instead, and the manifesto can move to section 3 (after one project introduction).

**Removing hero metrics strip:**

- Risk: The hero loses its most specific proof elements.
- Mitigation: If the metrics move to the Numbers section (which follows evidence + belief), they arrive with more context and the same visual weight.
- Consideration: The metrics strip in the hero provides an immediate "this is real" signal for cold visitors. If metrics are removed from the hero, the belief canvas + the belief statement in the manifesto must carry the credibility weight in the first 30 seconds. This is architecturally valid — belief is a stronger differentiator than metrics for cold visitors.

### 13.3 Changes requiring careful sequencing

**Adding featured Shade Ledger section:**
This is the only change that requires new JSX (a new section component). It draws from existing data — the case study content in `work.$slug.tsx` already has the Shade Ledger before/after story. A featured evidence section would be a new component using existing content.

**Adding process signal section:**
Same situation — new component. The three steps (Discover → Build → Ship) exist on the Process page. A lightweight version for the homepage would use the same content in a simpler layout.

### 13.4 What NOT to change

**BigCTA:** Strong copy, strong design, clear single action. Do not touch.

**ProductPreview panel (hero right column):** Serves technical visitors without disturbing non-technical visitors. The technical signals (RAG, Shade Ledger, BullMQ) are appropriately compact. Do not remove or replace.

**SkillsMarquee:** The only homepage section serving the tech stack signal. One instance is appropriate. Do not move it before the belief/evidence sections (the skills marquee should come after capability is established, not before).

**The belief statement itself ("if it doesn't run in production"):** This is the strongest differentiator in the portfolio. Every proposed structure should preserve it.

---

## 14. Prioritized Implementation Blueprint

### P0: Voice and dead-end fixes (1 hour, zero risk)

| #    | Change                                           | File                            | Lines | Target                                                      | Success Criteria                     |
| ---- | ------------------------------------------------ | ------------------------------- | ----- | ----------------------------------------------------------- | ------------------------------------ |
| P0-1 | Fix "I build software" → "We build software"     | `CinematicHero.tsx`             | 371   | "We build software that solves real problems."              | No "I" after "we're Saral x Jatin"   |
| P0-2 | Fix "I design, build, and ship" → "We design..." | `CinematicHero.tsx`             | 374   | "We design, build, and ship production systems..."          | Consistent "we" throughout hero copy |
| P0-3 | Fix "Tell me more" → "Tell us more"              | `contact.tsx`                   | 419   | Label change                                                | Consistent voice in contact form     |
| P0-4 | Fix footer bio                                   | `SiteFooter.tsx`                | 51    | "Product engineering studio. We design, build, and ship..." | No singular "I" in footer            |
| P0-5 | Inspect StoryTeller button                       | `StoryTeller.tsx`, `Button.tsx` | —     | Wire to `/work` or remove click handler                     | Zero dead-end CTAs on homepage       |

**Dependencies:** None. Can be done in any order.  
**Business value:** Immediate trust repair at the highest-attention moment.  
**Conversion gain:** Removes the primary objection (voice incoherence = professionalism doubt) at first read.

### P1: Section reordering and deduplication (4–8 hours, managed risk)

| #    | Change                                                      | File                | Action                                                          | Success Criteria                                         |
| ---- | ----------------------------------------------------------- | ------------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| P1-1 | Remove ScrollingTicker                                      | `routes/index.tsx`  | Delete `<ScrollingTicker />` + function + animated-divider pair | Hero flows directly to projects. No pacing regression.   |
| P1-2 | Remove StudioShowreel (or merge into ScrollStoryHorizontal) | `routes/index.tsx`  | Delete `<StudioShowreel />` + function + animated-divider pair  | Only one project section between hero and belief section |
| P1-3 | Move StudioManifesto to section 2                           | `routes/index.tsx`  | Move JSX block before projects section                          | Belief precedes project evidence                         |
| P1-4 | Remove hero metrics strip                                   | `CinematicHero.tsx` | Remove METRICS array + metrics grid JSX (~lines 395–408)        | Metrics appear once (Numbers section), not twice         |
| P1-5 | Remove Resume CTA from hero                                 | `CinematicHero.tsx` | Remove `<a href="/Orvion_Team_Resume.pdf">Resume</a>` CTA       | One primary CTA in hero. Resume remains on /about.       |

**Dependencies:** P0 complete.  
**Risk:** Visual regression testing required after each removal.  
**Business value:** Eliminates redundancy that was depleting visitor attention before the most important sections.  
**Conversion gain:** Belief and evidence arrive earlier in the scroll → more visitors encounter the differentiator.

### P1 — additional: Manifesto-to-project transition (30 minutes)

| #    | Change                                            | File                                          | Action                                                                                         |
| ---- | ------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| P1-6 | Add transition sentence at end of StudioManifesto | `routes/index.tsx` (StudioManifesto function) | One sentence bridging from belief to project proof: "Here's what that looks like in practice." |

**Rationale:** The StudioManifesto currently ends with the Shade Ledger reference. Moving it to section 2 means it immediately precedes the project sections. A one-sentence bridge ("Here's what that looks like in practice") creates a narrative connection between the belief statement and the project evidence without introducing a full new section.

### P2: Featured evidence section (4–6 hours, new component)

| #    | Change                              | File                         | Action                                                                                            | Success Criteria                                                                       |
| ---- | ----------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| P2-1 | Create `FeaturedEvidence` component | New file                     | New section between StudioManifesto and ScrollStoryHorizontal showing complete Shade Ledger story | Visitor reads: before state, after state, live status, specific outcome — in one place |
| P2-2 | Wire to case study                  | `FeaturedEvidence` component | CTA → `/work/shade-ledger`                                                                        | Clear path from featured evidence to full case study                                   |

**Content (existing data, not new copy):**

- Before state: from `SIMPLE_CONTENT['shade-ledger'].whatItDoes` in `work.$slug.tsx:396`
- After state: from `howItWorks` array (same file)
- Client quote: from About page testimonial (already written)
- Metrics: 220 units, 40+ hours — already in multiple locations

**Note:** This component requires no new copy to be written. It assembles existing content from existing data structures into one coherent narrative block.

### P2 — additional: Process signal section (3–4 hours, new component)

| #    | Change                           | File     | Action                                                                              | Success Criteria                                                                                  |
| ---- | -------------------------------- | -------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| P2-2 | Create `ProcessSignal` component | New file | 3-step process preview (Discover, Build, Ship) with "How we work →" CTA to /process | Primary audience can answer "what does working with them look like?" without clicking to /process |

**Placement:** Between the project section and SkillsMarquee.  
**Content source:** `process.tsx` STEPS array — exactly the same content used on the Process page, condensed to 3 steps.

### P2 — additional: Pricing signal in BigCTA (15 minutes)

| #    | Change                       | File                                 | Action                                                                          | Success Criteria                                      |
| ---- | ---------------------------- | ------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| P2-3 | Add pricing signal to BigCTA | `routes/index.tsx` (BigCTA function) | One line: "Fixed-fee pricing available. [See pricing →]" beneath the CTA button | Visitor who reaches BigCTA can self-qualify on budget |

### P2 — additional: Post-contact assurance near BigCTA (30 minutes)

| #    | Change                                     | File                                 | Action                                                     | Success Criteria                                             |
| ---- | ------------------------------------------ | ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| P2-4 | Add "what happens next" cards above BigCTA | `routes/index.tsx` (BigCTA function) | 3 micro-cards: We reply (48h) → Quick call → Real proposal | "What happens if I contact them?" is answered before the CTA |

### P3: Navigation reorder (5 minutes, no risk)

| #    | Change            | File             | Lines | Action                                     |
| ---- | ----------------- | ---------------- | ----- | ------------------------------------------ |
| P3-1 | Reorder NAV array | `SiteHeader.tsx` | 9-15  | Work → About → Process → Pricing → Contact |

**Rationale:** About before Pricing. Visitors should know who they're working with before they see the cost. The current order puts Pricing at position 3 and About at position 4.

**Counterargument acknowledged:** If majority traffic is project-referral, Work-first is correct. The nav reorder is appropriate for cold traffic. Traffic analytics would confirm which is dominant — currently unavailable.

---

## Canonical Homepage Architecture

### The single structure governing all implementation

```
SECTION 1: CinematicHero [REVISED]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Establish identity and surface positioning
Voice: WE throughout (no I)
Canvas: "USEFUL OVER IMPRESSIVE" (unchanged — effective)
Identity bar: "Orviontech — Product Engineers, India" + "Open to new projects"
Hero copy: Consistent "we" voice, one specific outcome in body text
Right column: ProductPreview (unchanged — serves technical visitors efficiently)
CTA: Single primary → /work
No resume CTA (moves to About page)
No metrics strip (moves to Numbers section at end)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2: StudioManifesto [MOVED — currently section 6]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Establish the belief that makes all evidence meaningful
Content: Three philosophical paragraphs culminating in Shade Ledger reference
Transition: End with bridge sentence → projects section
CTA: None — the belief section earns no conversion, it earns interpretation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3: FeaturedEvidence [NEW]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Present the primary proof as a complete story
Content: Shade Ledger — before state → after state → live status → outcome
Source: Assembles from existing case study data (no new copy)
CTA: "See the full case study" → /work/shade-ledger
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 4: ScrollStoryHorizontal [REVISED] (StudioShowreel removed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Show capability breadth — other work beyond Shade Ledger
Content: Remaining projects (NeuroDashboard, Smart Parking, Carbon Compass)
CTA: "See all work" → /work
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 5: ProcessSignal [NEW]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Eliminate methodology fear before conversion
Content: 3 steps — Discover → Build → Ship (from existing Process page data)
CTA: "How we work →" → /process
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 6: SkillsMarquee [UNCHANGED]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Technical credibility signal
Content: Unchanged — React, TypeScript, Node.js, PostgreSQL, etc.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 7: Numbers [REVISED — hero metrics strip removed]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Quantified proof — arrives after belief and evidence are established
Content: 2 systems / 220 units / 40+ hours / 70k+ lines (unchanged)
Position: After process signal — now these numbers have context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 8: BigCTA [REVISED — with additions]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsibility: Convert qualified visitors
Above CTA: "What happens next" — 3 micro-items (reply / call / proposal)
CTA: "Get in touch" → /contact (unchanged)
Below CTA: One pricing signal line → /pricing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Removed sections

| Removed         | Reason                                                               |
| --------------- | -------------------------------------------------------------------- |
| ScrollingTicker | Restates hero capability; no new information                         |
| StudioShowreel  | Redundant with ScrollStoryHorizontal (same 3 projects)               |
| StoryTeller     | Redundant with StudioManifesto (same belief); suspected dead-end CTA |

### Added sections

| Added                           | Reason                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| FeaturedEvidence                | The Shade Ledger complete story — currently distributed but never presented |
| ProcessSignal                   | Methodology fear is the top unconverted-visitor reason; 3 steps resolve it  |
| "What happens next" (in BigCTA) | Post-contact uncertainty is the final conversion blocker                    |
| Pricing signal (in BigCTA)      | Budget self-qualification before contact = higher-quality leads             |

### Decision sequence in the canonical structure

```
SECTION 1 — Hero
  Uncertainty eliminated: "Who is this? Should I care?"
  Trust gained: Identity is consistent and confident

SECTION 2 — StudioManifesto
  Uncertainty eliminated: "What makes them different?"
  Trust gained: They have a specific, defensible philosophy about production software

SECTION 3 — FeaturedEvidence
  Uncertainty eliminated: "Is this real or just claims?"
  Trust gained: A paying client, a real business problem, a specific outcome, still running

SECTION 4 — ScrollStoryHorizontal
  Uncertainty eliminated: "Is this a one-project studio?"
  Trust gained: Range of capability beyond the featured case

SECTION 5 — ProcessSignal
  Uncertainty eliminated: "What happens if I contact them?"
  Trust gained: Three concrete steps — the unknown is now known

SECTION 6 — SkillsMarquee
  Uncertainty eliminated: "Do they use the stack I need?"
  Trust gained: Technical vocabulary signals engineering maturity

SECTION 7 — Numbers
  Uncertainty eliminated: "How much have they actually done?"
  Trust gained: Quantified proof — now with full context from prior sections

SECTION 8 — BigCTA
  Uncertainty eliminated: "Why should I do this today?"
  Trust: Maximum — all major uncertainties resolved
  Action: Contact
```

### Implementation readiness

This blueprint is complete. Implementation can begin with P0 immediately (voice fixes, dead-end CTA) — these are 5 copy edits with zero architectural risk. P1 (deduplication, reordering) requires visual regression testing. P2 (new components) requires component authorship using existing content data. P3 (nav reorder) requires the traffic-source decision.

The canonical architecture above is the governing structure for all future homepage implementation decisions. Any section proposed for addition must demonstrate which single uncertainty it eliminates and confirm that uncertainty has not already been eliminated by a prior section.

---

_Evidence basis: Full repository read of `routes/index.tsx`, `CinematicHero.tsx`, `StoryTeller.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `contact.tsx`, `about.tsx`, `work.index.tsx`, `work.$slug.tsx`, `process.tsx`, `pricing.tsx`, and `data/projects.ts`. Strategic basis: CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md and NARRATIVE_DECISION_ARCHITECTURE_REPORT.md. No implementation was performed during this investigation._
