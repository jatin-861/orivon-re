# Narrative Architecture
## Homepage communication structure and visitor journey

> Source: HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md, NARRATIVE_DECISION_ARCHITECTURE_REPORT.md  
> This document records the **target** architecture. For current (pre-implementation) state, see [`CURRENT_STATE.md`](CURRENT_STATE.md).

---

## Governing Principle

The homepage is a sequential trust-building machine. Every section removes exactly one uncertainty. Sections that remove a previously removed uncertainty are structurally redundant and must be eliminated.

---

## Canonical Homepage Section Order

| Position | Component | Responsibility | Uncertainty removed |
|---|---|---|---|
| 1 | `CinematicHero` | Establish identity | "Who is this?" |
| 2 | `StudioManifesto` | Establish belief | "What makes them different?" |
| 3 | `FeaturedEvidence` *(new)* | Primary proof | "Is this real or just claims?" |
| 4 | `ScrollStoryHorizontal` | Capability breadth | "Is this a one-project studio?" |
| 5 | `ProcessSignal` *(new)* | Methodology preview | "What happens if I contact them?" |
| 6 | `SkillsMarquee` | Technical signals | "Do they use the stack I need?" |
| 7 | `Numbers` | Quantified proof | "How much have they actually done?" |
| 8 | `BigCTA` | Convert | "How do I start?" |

**Removed sections:** `ScrollingTicker`, `StudioShowreel`, `StoryTeller`  
(All three are redundant with other sections — see Decision D-014)

---

## Section Detail

### 1 — CinematicHero

**Single responsibility:** Establish studio identity and surface the positioning signal.

**What it must communicate:**
- Who: Orvion.co — two engineers (Saral + Jatin)
- What: We build software that ships (consistent "we" voice — no "I")
- Canvas: "USEFUL OVER IMPRESSIVE" (positioning signal, pre-verbal)
- Signal: "Open to new projects"

**What it must NOT do:**
- Show metrics (moved to section 7)
- Include a Resume CTA (recruiter path is on /about)
- Switch voice from "we" to "I"

**Target state:** Single primary CTA → `/work`. ProductPreview panel (right column) unchanged.

---

### 2 — StudioManifesto

**Single responsibility:** Establish the belief that makes all subsequent evidence meaningful.

**Why this position:** Without the belief, "220 rental units" is just a number. With the belief ("shipping the whole stack is what turns a prototype into a product"), it becomes proof of a philosophy.

**Content (existing, no changes needed):**
1. "Most software stays a demo — a prototype that never reaches a real user."
2. "Shipping the whole stack, database to deployment, is what turns a prototype into a product."
3. "Real systems run for real people, every day — Shade Ledger has billed 220 rental units, automatically, every month, for over a year."

**Transition:** End with one bridge sentence leading into the FeaturedEvidence section.

**CTA:** None — this section earns interpretation, not conversion.

---

### 3 — FeaturedEvidence *(new component)*

**Single responsibility:** Present the Shade Ledger story completely, in one place.

**Why this section exists:** The Shade Ledger evidence is distributed across 5 sections on the current homepage but presented completely in 0 sections. The "before" context (manual Excel billing, phone calls) is only in the case study. Without the before state, "220 units" has no emotional resonance.

**Required content:**
- Before state: "Replaced manual Excel billing and phone calls"
- After state: Automatic invoices, WhatsApp reminders, PDF generation, penalty tracking
- Live status: Running since 2025, no interruption
- Scale: 220 rental units, Mumbai
- Outcome: 40+ hours of manual work saved every month

**Content source:** All of this exists in `work.$slug.tsx` SIMPLE_CONTENT and `about.tsx` testimonial — no new copy required.

**CTA:** "See the full case study →" → `/work/shade-ledger`

---

### 4 — ScrollStoryHorizontal

**Single responsibility:** Show capability range beyond the featured case.

**Sections shown:** Knowledge Hub (NeuroDashboard), Smart Parking — the remaining projects after Shade Ledger has been featured in section 3.

**CTA:** "See all work →" → `/work`

**Note:** `StudioShowreel` is removed. This is the only project section.

---

### 5 — ProcessSignal *(new component)*

**Single responsibility:** Eliminate methodology fear before conversion.

**Why this section exists:** B2B buyers' primary hesitation is uncertainty about the engagement process, not capability. "What happens if I contact them?" is the question that kills conversions for otherwise-convinced visitors. The Process page answers this well — this section surfaces a 3-step preview.

**Content:** Discover → Build → Ship (from existing STEPS array in `process.tsx`)

**CTA:** "How we work →" → `/process`

---

### 6 — SkillsMarquee

**Single responsibility:** Technical credibility signal.

**Position rationale:** After belief and evidence are established, technical visitors can confirm stack compatibility. Before this point, stack names are noise to non-technical buyers.

**Current content:** React, Next.js, TypeScript, Node.js/Express, PostgreSQL, GSAP, Framer Motion, Tailwind CSS, Redis, Socket.IO, RAG/pgvector, Docker

---

### 7 — Numbers

**Single responsibility:** Quantified proof — after context is established.

**Position rationale:** In the target structure, the Numbers arrive after the belief (section 2) and evidence (section 3). The visitor already understands what these numbers mean. Arriving early (hero), they're premature — numbers without context.

**Content:** 2 production systems / 220 rental units / 40+ hours monthly / 70k+ lines (unchanged)

---

### 8 — BigCTA

**Single responsibility:** Convert qualified visitors.

**Additions (P2 backlog):**
- 3-item "what happens next" above the CTA (reply → call → proposal)
- One pricing signal line below the CTA: "Fixed-fee pricing available. [See pricing →]"

**Existing copy:** "Let's build something that ships." / "If you've got something worth building, we'd love to hear about it." — DO NOT CHANGE. This is the strongest copy on the homepage.

---

## Question Flow (from HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md)

| Question | Answered by | When |
|---|---|---|
| "Who is this?" | Section 1 — Hero | 0–30 seconds |
| "What makes them different?" | Section 2 — Manifesto | 30–90 seconds |
| "Is this real?" | Section 3 — FeaturedEvidence | 90–180 seconds |
| "What else have they built?" | Section 4 — Projects | 2–3 minutes |
| "What does working with them look like?" | Section 5 — ProcessSignal | 3–4 minutes |
| "Do they use my stack?" | Section 6 — SkillsMarquee | 4–5 minutes |
| "How much have they done?" | Section 7 — Numbers | 5 minutes |
| "How do I start?" | Section 8 — BigCTA | 5+ minutes |

---

## Trust Progression

```
Trust
|
      Section 8 ●
     Section 7 ●
    Section 6 ●
   Section 5 ●
  Section 4 ●
 Section 3 ●
Section 2 ●
Section 1 ●
|________________________________
                        scroll →
```

Trust compounds continuously from section 1 to 8. In the current (pre-target) state, trust dips at the hero voice switch and at the StoryTeller dead-end, then rises sharply at the Manifesto (section 6). The target structure eliminates both dips.

---

## Page-by-Page Navigation Sequence

The ideal visitor journey across pages follows the decision sequence:

```
Homepage (WHO + WHY + PROOF)
  → /work (CAPABILITY)
    → /work/$slug (DEEP EVIDENCE)
  → /about (IDENTITY + TRUST)
  → /process (METHODOLOGY)
  → /pricing (COST)
  → /contact (START)
```

Cross-page CTAs supporting this sequence:
- Work index → About: "Meet the engineers →" (P2-5)
- About → Process: "See how we work →" (P2-6)
- Process → Contact: ✅ exists
- Pricing → Contact: needs upgrade from text link to designed CTA

---

## Cross-references

- Section implementation tasks → [`IMPLEMENTATION_BACKLOG.md`](IMPLEMENTATION_BACKLOG.md)
- Voice rules → [`BRAND_GUIDE.md`](BRAND_GUIDE.md)
- Entity schemas on each page → [`ENTITY_ARCHITECTURE.md`](ENTITY_ARCHITECTURE.md)
