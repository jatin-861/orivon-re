# Archive

Superseded investigation reports and deprecated knowledge files live here.

## What belongs here

- Investigation reports once their findings are absorbed into the EKB (e.g., `NARRATIVE_DECISION_ARCHITECTURE_REPORT.md` once `NARRATIVE_ARCHITECTURE.md` captures the same knowledge)
- Knowledge files that have been replaced by a more current version
- Decision records that have been superseded (keep them — history matters)

## What does NOT belong here

- Active architectural decisions (→ `DECISIONS.md`)
- Work-in-progress or draft documents
- Deleted files (those go in git history)

## How to archive

1. Move the file here with `git mv`
2. Update any `MEMORY.md` pointers
3. Update the referring knowledge file to note the archive location if needed

## Current archived files

_(None yet — archive is empty at EKB creation.)_

**Candidates for archiving** (after their content is fully absorbed):
- `/CANONICAL_IDENTITY_ARCHITECTURE_REPORT.md` → content captured in `ENTITY_ARCHITECTURE.md` + `DECISIONS.md`
- `/NARRATIVE_DECISION_ARCHITECTURE_REPORT.md` → content captured in `NARRATIVE_ARCHITECTURE.md`
- `/HOMEPAGE_DECISION_ARCHITECTURE_BLUEPRINT.md` → content captured in `NARRATIVE_ARCHITECTURE.md` + `IMPLEMENTATION_BACKLOG.md`
