# Architectural Decision Records (ADRs)

This directory stores decisions that are too large or too context-dependent to fit in [`DECISIONS.md`](../DECISIONS.md).

## When to add a file here

Add an ADR file here when a decision:

- Involved significant trade-off evaluation (3+ options considered)
- Has a complex rationale that future sessions need to understand fully
- May be revisited and requires knowing _why_ the current approach was chosen

For straightforward decisions, record them directly in `DECISIONS.md` as a numbered entry (D-001, D-002, etc.).

## File naming

`{D-number}-{short-slug}.md` — e.g., `D-003-hybrid-authority-identity.md`

## ADR template

```markdown
# D-XXX: Decision Title

**Status:** Accepted | Superseded by D-YYY | Under review  
**Date:** YYYY-MM-DD  
**Context:** What problem prompted this decision.  
**Options considered:** List each option and its trade-offs.  
**Decision:** What was chosen and why.  
**Consequences:** What this commits us to. What it rules out.
```

## Current ADRs

_(None yet. Large decisions are in `DECISIONS.md` — move here if they outgrow a table row.)_
