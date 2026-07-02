# Shade Ledger
## Automated billing system — primary client proof

---

## Executive Summary

Shade Ledger is the highest-trust evidence in the Orvion.co portfolio. It is a real system built for a paying client, running without interruption since 2025, solving a concrete business problem. It is the primary proof point for the studio's "production-first" positioning.

**Slug:** `shade-ledger`  
**Year:** 2025–2026  
**Client:** Confidential (Mumbai, India)  
**Category:** Automation  
**GitHub:** Private (client system)  
**Schema creator:** Orvion.co

---

## The Problem (Before State)

A property owner managing 220 rental units in Mumbai was processing monthly billing manually:
- Excel spreadsheets for tracking each unit's payment status
- Phone calls and manual messages for payment reminders
- Manual calculation of late fees and penalties
- 40+ hours of admin work every billing cycle

---

## The Solution (After State)

Shade Ledger replaces every manual step:
1. **Automatic invoice generation** — PDF invoices created and sent to each tenant every billing cycle (react-pdf)
2. **WhatsApp reminders** — Automated payment reminders and due-date notices via WhatsApp Business API
3. **Penalty tracking** — Late fees calculated and applied automatically based on rules
4. **Payment status dashboard** — Real-time view of each unit's payment status

---

## Architecture

**Frontend:** React  
**Backend:** Node.js  
**Invoice generation:** react-pdf  
**Tenant communication:** WhatsApp Business API  

---

## Tech Stack

```
React · Node.js · react-pdf · WhatsApp Business API
```

---

## Current Status

**Live and running since 2025.** No interruption. 220 rental units currently on the system.

---

## Verified Evidence

| Metric | Value | Type |
|---|---|---|
| Rental units on the system | 220 | Specific, ongoing |
| Manual work saved monthly | 40+ hours | Client-reported |
| System status | Live since 2025 | Ongoing |
| Client location | Mumbai, India | Named city |
| Client type | Confidential (contractual) | Anonymized per agreement |

---

## The Testimonial

> "Billing used to eat a whole afternoon every month. Now it just runs — invoices, reminders, the lot."

**Attribution:** Property Management Client, Mumbai · 220 rental units · Shade Ledger, 2025  
**Location in portfolio:** `about.tsx` testimonial section

---

## Communication Value

The Shade Ledger story is the single strongest asset in the portfolio for B2B communication:

1. **Business owner resonance** — "replacing manual Excel billing" is a problem many small business owners recognize immediately
2. **Specificity** — 220 units, 40+ hours, Mumbai, 2025 — not vague
3. **Ongoing** — "still running" is more credible than "we shipped it once"
4. **Client voice** — the testimonial is human and specific

**Portfolio use rule:** Never distribute this evidence. Present it completely in one place (the FeaturedEvidence section on the homepage — see NARRATIVE_ARCHITECTURE.md). Repeating it across multiple sections without full context trains visitors to tune it out.

---

## Portfolio Representation

**Homepage:** FeaturedEvidence section (target architecture — new component)  
**Work index:** Second card (`/work`)  
**Case study:** `/work/shade-ledger` — what it does + how it works sections  
**About page:** Testimonial card ("Proof from production" section)  
**Image:** `/public/images/shade-ledger.webp`  
**Brand color:** `#8B5E3C` (brand-ochre)
