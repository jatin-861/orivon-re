---
name: architecture-analyst
description: "Use this skill when mapping an unknown codebase, evaluating system design, identifying architectural patterns, or finding structural anti-patterns and coupling problems."
version: 1.0.0
triggers:
  - "understand this codebase"
  - "how is this structured"
  - "architecture review"
  - "find coupling"
  - "anti-patterns"
  - "dependency map"
  - "@architecture-analyst"
token_budget: 3000
tools_required:
  - view_file
  - search_code
output_contract:
  format: "Architecture map + anti-pattern report + recommendations"
  includes:
    - layer-map
    - dependency-graph
    - anti-patterns-found
    - coupling-score
    - recommendations
works_with:
  - system-auditor
  - refactoring-specialist
  - documentation-writer
  - task-planner
risk: low
---

## Mission

Map the architecture of any codebase by tracing from entry point outward, identifying layer boundaries, measuring coupling, detecting structural anti-patterns (god objects, circular dependencies, feature envy, shotgun surgery), and producing an actionable report with specific file:line evidence. The output is a layered architecture diagram, coupling hotspot list, and prioritized recommendations.

## When To Activate

- User needs to understand an unfamiliar codebase ("how is this structured?")
- User requests an architecture review before adding features
- User suspects coupling or anti-pattern problems
- User wants a dependency graph or import map
- **Anti-trigger**: Do NOT activate for runtime debugging (use `debugging-master`) or performance profiling (use `performance-optimizer`)

## Core Concepts

### 1. Coupling vs Cohesion

**Low coupling** = modules are independent; changing A doesn't break B. **High cohesion** = things that change together live together. The goal is low coupling + high cohesion. Measure coupling by counting cross-module imports: >10 external imports in a single module = high coupling.

### 2. Dependency Inversion

High-level modules (business logic) should NOT import low-level modules (database, HTTP). Both should depend on abstractions (interfaces).

```
❌ VIOLATION: UserService imports PostgresAdapter directly
   src/services/UserService.ts → import { pg } from '../db/postgres'

✅ CORRECT: UserService imports IUserRepository interface
   src/services/UserService.ts → import { IUserRepository } from '../interfaces'
   src/db/PostgresUserRepo.ts → implements IUserRepository
```

### 3. Layered Architecture

In clean/hexagonal/layered architecture, dependencies must point **inward**:

```
Infrastructure → Application → Domain
     ✓              ✓          ✗ (Domain imports NOTHING external)
```

If Domain imports from Infrastructure, it's a layer violation. Domain should contain pure business logic with zero framework imports.

### 4. Anti-Pattern Signatures

Detect by measurable criteria, not intuition:

- **God Object**: Class with >10 public methods AND >10 fields, or file >500 lines
- **Circular Dependency**: A imports B, B imports A. Detect with `npx madge --circular src/`
- **Feature Envy**: Method uses more methods/properties from another class than its own
- **Shotgun Surgery**: Adding one feature requires editing 6+ files in different modules
- **Data Clumps**: Same group of 3+ variables passed together to multiple functions → extract to a type/class

### 5. Entry Point Tracing

Start architecture analysis at the entry point (`main.ts`, `index.js`, `app.ts`, `server.ts`). Follow imports outward. The import graph IS the architecture — what it imports, in what order, reveals the actual layer structure (not what the README claims).

## Reasoning Graph

```
[INPUT: Codebase or architecture question]
  │
  ├─► [CLASSIFY: Map request or problem investigation?]
  │     │
  │     ├─► [BRANCH A: Map the codebase]
  │     │     ├── Find entry point (main.ts / index.js / app.ts)
  │     │     ├── Trace import tree (3 levels deep)
  │     │     ├── Identify layers:
  │     │     │     ├── UI/Routes (incoming requests)
  │     │     │     ├── Services/Application (business logic)
  │     │     │     ├── Domain (entities, value objects)
  │     │     │     └── Infrastructure (DB, HTTP, filesystem)
  │     │     ├── Identify coupling hotspots (modules with >10 imports)
  │     │     ├── Produce ASCII layer diagram
  │     │     └── [VALIDATE: all major components identified]
  │     │
  │     └─► [BRANCH B: Find architectural problems]
  │           ├── Scan for anti-pattern signatures (see Core Concepts §4)
  │           ├── Measure coupling: count cross-layer imports per module
  │           ├── Check dependency direction: do lower layers import upper?
  │           │     └── grep -rn "import.*from.*routes\|import.*from.*controllers" src/domain/
  │           ├── List violations with file:line evidence
  │           ├── Prioritize by blast radius (how many things break if this module changes?)
  │           └── [VALIDATE: every finding has file:line evidence]
  │
  └─► [OUTPUT: Architecture report]
```

## Execution Steps

### Branch B: Find Architectural Problems

### Step 1: Get the Import Graph

```bash
grep -rn "import\|require" src/ --include="*.ts" --include="*.js" | grep -v node_modules | grep -v ".test." | grep -v ".spec."
```

### Step 2: Check for Circular Dependencies

```bash
npx madge --circular src/
# If madge isn't available:
npx madge --circular --extensions ts,js src/
```

Each circular dependency is an architectural violation. List all pairs.

### Step 3: Find God Objects

```bash
# Files over 500 lines
find src/ -name "*.ts" -o -name "*.js" | xargs wc -l | sort -rn | head -20

# Classes/modules with >10 exports
grep -c "export " src/**/*.ts | sort -t: -k2 -rn | head -10
```

### Step 4: Check Layer Violations

```bash
# Does domain/ import from infrastructure/?
grep -rn "import.*from.*infrastructure\|import.*from.*db\|import.*from.*api" src/domain/

# Does domain/ import frameworks?
grep -rn "import.*from.*express\|import.*from.*prisma\|import.*from.*axios" src/domain/
```

Each hit is a dependency direction violation.

### Step 5: Find Shotgun Surgery Candidates

```bash
# Files that change together (requires git)
git log --oneline --name-only -50 | grep "src/" | sort | uniq -c | sort -rn | head -20
```

If the same 6 files appear in every commit, they should probably be in the same module.

### Step 6: Score Coupling

For each module, count external imports. Score:

- 0-3 external imports: low coupling ✅
- 4-7 external imports: medium coupling ⚠️
- 8+ external imports: high coupling ❌

### Step 7: Produce Report

Ordered by severity: critical layer violations → circular deps → god objects → high coupling → suggestions.

## Failure Modes

| Error                                     | Cause                                            | Recovery                                                                            |
| ----------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `madge` not installed                     | Tool missing from project                        | `npx madge --circular src/` (npx auto-installs)                                     |
| Circular dependency too complex to trace  | Deep transitive chain A→B→C→D→A                  | Use `npx madge --image dep-graph.svg src/` for visual graph                         |
| No clear entry point found                | Monorepo with multiple apps                      | Check `package.json` `main` field per package; analyze each app separately          |
| Everything looks coupled, no clear layers | Architecture was never designed (organic growth) | Document current state as-is; propose target architecture as a separate deliverable |
| `grep` returns too many results           | Overly broad search                              | Narrow with `--include` (file extension) and path filters                           |

## Validation Gate

- [ ] Entry point identified and import tree traced
- [ ] All layer boundaries mapped (UI / Application / Domain / Infrastructure)
- [ ] Circular dependencies checked (`madge` output reviewed or manual grep)
- [ ] Anti-patterns listed with file:line evidence, not just assertions
- [ ] Coupling score calculated per module
- [ ] Recommendations are specific ("move `X` from `file.ts:42` to `module/`") not generic ("reduce coupling")

## Output Contract

Architecture report containing:

- **Layer diagram**: ASCII diagram showing modules grouped by layer with import direction arrows
- **Coupling hotspots**: List of modules with highest external import count (file path + count)
- **Anti-patterns found**: Each with: pattern name, file:line evidence, severity (critical/high/medium)
- **Recommendations**: Ordered list of specific actions (file, function, what to do, why)
