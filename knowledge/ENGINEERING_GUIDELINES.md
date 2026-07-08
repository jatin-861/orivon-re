# Engineering Guidelines

## Standards and patterns for this repository

---

## Code Standards

These apply to all TypeScript/TSX files in `src/`:

- **TypeScript strict mode** — enabled. Never use `any` without a comment explaining why.
- **Functions max 50 lines** — split at single responsibility boundary if longer.
- **No silent failures** — every error must be thrown, logged, or explicitly swallowed with `// intentional no-op` comment.
- **No hardcoded secrets** — no API keys, contact emails inlined, or environment-specific values in source. Email is assembled in `src/lib/mail.ts`.
- **No dead code** — remove unused code before committing. Git history preserves it.
- **Boolean naming** — `is`, `has`, `can`, `should` prefixed (`isComplete`, `hasError`, `canScroll`).
- **Variable naming** — nouns (`particles`, `containerRef`, `alreadySeenRef`).
- **Function naming** — verbs (`initParticles`, `handleMouseMove`, `buildMailUrls`).

---

## React Patterns

### Effects and sessionStorage

**Never put a sessionStorage-derived value in a `useEffect` dependency array if the same effect writes to sessionStorage.**

React 19 StrictMode double-invokes effects (mount → cleanup → remount). If the derived value changes between invocations (because the effect wrote to storage), cleanup fires prematurely.

**Pattern for one-time initialization from sessionStorage:**

```tsx
// CORRECT
const alreadySeenRef = useRef(
  typeof sessionStorage !== "undefined" && !!sessionStorage.getItem("key"),
);
useEffect(() => {
  if (alreadySeenRef.current) return;
  sessionStorage.setItem("key", "1");
  // ... rest of logic
}, []); // empty deps

// WRONG — causes StrictMode double-invoke bugs
const alreadySeen = sessionStorage.getItem("key");
useEffect(() => {
  if (alreadySeen) return;
  sessionStorage.setItem("key", "1");
  // clearInterval fires when alreadySeen flips to true ← BUG
}, [alreadySeen]);
```

### Synchronous DOM reads at render time

Use `useState` lazy initializer (not `useEffect`) when you need to read the DOM on first render to avoid a flash:

```tsx
// CORRECT — reads DOM synchronously at first render
const [isDark, setIsDark] = useState(
  () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
);

// WRONG — initializes to false, then corrects after paint (causes flash)
const [isDark, setIsDark] = useState(false);
useEffect(() => {
  setIsDark(document.documentElement.classList.contains("dark"));
}, []);
```

Use this pattern anywhere you need a DOM or sessionStorage value that must be correct on first render (ThemeToggle, Preloader, CinematicHero delayBase).

### GSAP in React components

Always use `gsap.context()` for cleanup:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // all gsap.from / gsap.to / ScrollTrigger.create calls here
  }, containerRef);
  return () => ctx.revert(); // ← required cleanup
}, []);
```

Register plugins once per component, inside a `typeof window !== "undefined"` guard (SSR safety):

```tsx
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

### Canvas render loops

Pattern for canvas components (`CinematicHero`, `StoryTeller`, `InteractiveParticles2D`):

```tsx
// Pause render loop when off-screen
const [canvasRef, isInView] = useInView({ threshold: 0.01 });
const isInViewRef = useRef(isInView);
useEffect(() => {
  isInViewRef.current = isInView;
}, [isInView]);

const render = () => {
  if (!isInViewRef.current) {
    animationFrameId = requestAnimationFrame(render);
    return; // skip draw, keep loop alive
  }
  // actual draw calls
};
```

Use `isInViewRef` (not `isInView`) inside the render loop — the ref is stable across renders; the state value captured in the closure would be stale.

---

## Router Patterns

TanStack Router v1.168 — file-based routes.

```tsx
// Route definition
export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  component: CaseStudy,
});

// Typed params in Link
<Link to="/work/$slug" params={{ slug: p.slug }}>
  ...
</Link>;

// Loader data
const p = Route.useLoaderData();

// Location
const { pathname } = useLocation();
```

Never use `href` for internal navigation. Always use `<Link to="..." />`.

---

## Animation Performance

- Use `IntersectionObserver` via `useInView` hook to pause canvas render loops when off-screen
- `LazyVideo` component for video loading — never render video elements eagerly
- GSAP `invalidateOnRefresh: true` on ScrollTriggers that depend on element positions
- Lenis coordinates with GSAP via `requestAnimationFrame` — no manual `ScrollTrigger.refresh()` needed in most cases

---

## Tailwind CSS v4

No `tailwind.config.js`. Configuration is in CSS files using `@theme {}` directive (Tailwind v4 syntax). Brand tokens are CSS custom properties on `:root`.

Class merging: `tailwind-merge` via `cn()` utility in `src/lib/utils.ts`:

```tsx
import { cn } from "@/lib/utils";
cn("base-class", condition && "conditional-class", "other-class");
```

---

## Component Architecture

### Layout components (always rendered)

- `LenisProvider` — smooth scroll (outermost wrapper)
- `CustomCursor` — custom cursor (after LenisProvider)
- `Preloader` — first-visit preloader (before SiteBackground)
- `SiteBackground` — persistent background layer
- `SiteHeader` — fixed navigation
- `SiteFooter` — footer
- `PageTransition` — wraps `<Outlet />`
- `AppErrorBoundary` — error boundary class component

### Route components

Each route file exports exactly one route (`Route`) and one component function named after the route.

### SEO component

`<SEO />` is rendered as the first child inside every route component. It uses React 19's document metadata hoisting — `<title>`, `<meta>`, `<link>`, and `<script>` elements rendered anywhere in the tree are hoisted to `<head>`.

---

## Definition of Production Quality

A feature is production-quality when:

1. It works correctly on first visit and return visits
2. It works in React 19 StrictMode (no double-invoke side effects)
3. It degrades gracefully when sessionStorage/localStorage is unavailable
4. Canvas render loops pause when off-screen
5. No CTAs navigate to nowhere
6. All `<img>` elements have `alt` text
7. All interactive elements have focus-visible styles
8. The console has no errors or warnings

---

## File Structure Conventions

```
src/
  components/       — shared components
    canvas/         — canvas-based interactive components
    layout/         — Preloader, LenisProvider, PageSkeleton
    ui/             — shadcn-style primitives
  data/             — static data (projects.ts, testimonials.ts)
  hooks/            — custom React hooks
  lib/              — utilities (mail.ts, utils.ts)
  routes/           — TanStack Router file-based routes
```

Path alias: `@/` maps to `src/` via `vite-tsconfig-paths`.

---

## No-Go Patterns

| Pattern                                                                            | Why forbidden                              |
| ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `useState(false)` for DOM-derived initial state                                    | Causes flash; use lazy initializer         |
| `useEffect` deps include sessionStorage-derived values that the effect also writes | Causes StrictMode double-invoke bugs       |
| `href` for internal navigation                                                     | Use `<Link to="..." />`                    |
| Hardcoded contact email in JSX                                                     | Assemble in `src/lib/mail.ts`              |
| `gsap` animations without `ctx.revert()` cleanup                                   | Memory leak, ScrollTrigger accumulation    |
| Canvas render loops without `isInView` pause                                       | Performance drain when scrolled off-screen |
| Dead-end CTA buttons                                                               | Brand trust incident                       |

---

## Cross-references

- Component visual conventions → [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
- Repository structure → [`architecture/repository.md`](architecture/repository.md)
- Known bugs and their fixes → [`DECISIONS.md`](DECISIONS.md) (D-009, D-010, D-011)
