# Frontend Architecture

## React patterns, animation system, and component hierarchy

---

## Framework

React 19.2.0. No server rendering. SPA with client-side hydration.

**Strict Mode:** React 19 StrictMode is enabled. This causes double-invocation of effects in development. All components must be StrictMode-safe. See `ENGINEERING_GUIDELINES.md` for the `useRef`/lazy-initializer patterns that solve common StrictMode bugs in this codebase.

---

## Component Hierarchy (runtime order)

```
LenisProvider                    — smooth scroll (Lenis 1.3.3)
  CustomCursor                   — cursor override
  Preloader                      — first-visit animation (sessionStorage-gated)
  SiteBackground                 — persistent aurora gradient background
  SiteHeader                     — fixed nav (Work/Process/Pricing/About/Contact + CTA)
  main#main-content
    AppErrorBoundary             — class component error boundary
      PageTransition             — Framer Motion route-change animation
        [Route Component]        — (Index | About | WorkPage | CaseStudy | Process | Pricing | Contact)
          SEO                    — React 19 document metadata hoisting
          [Page sections]
  SiteFooter                     — footer with AnimatedDock + GooeyText morphing wordmark
```

---

## Animation Architecture

Two distinct systems, different scopes:

### GSAP (^3.15.0) — scroll-driven + canvas

Used for: scroll-triggered reveals, parallax, canvas particles, kinetic text effects

**Always wrap in `gsap.context()` for cleanup:**

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(".hero-element", { y: 40, opacity: 0, stagger: 0.1, delay: delayBase });
    gsap.fromTo(
      progressLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        scrollTrigger: { trigger: containerRef.current, start: "top 40%", scrub: true },
      },
    );
  }, containerRef);
  return () => ctx.revert();
}, []);
```

**Plugin registration — always guarded:**

```tsx
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

### Framer Motion (^12.38.0) — component-level

Used for: page transitions, card entrance animations, hover states, pricing card spring physics

```tsx
// Standard entrance pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

### Smooth Scroll (Lenis ^1.3.3)

Lenis provides smooth inertial scrolling. It coordinates with GSAP ScrollTrigger via its `requestAnimationFrame` integration configured in `LenisProvider.tsx`.

---

## Canvas Components

Two canvas components render interactive particle/animation experiences:

**`CinematicHero` (`src/components/canvas/CinematicHero.tsx`):**

- Renders particle text "USEFUL OVER IMPRESSIVE" on a canvas
- Particles spring to home positions, disperse on mouse proximity
- Dark/light theme aware (reinitializes on `themechange` event)
- SR-only H1 provides accessible headline

**`StoryTeller` (`src/components/StoryTeller.tsx`):**

- Renders concentric rings, floating nodes, and sine wave animations
- Mouse-tracking 3D tilt on the frame container
- Contains `realm-btn` CTA (P0-5 dead-end)

**Both follow the IntersectionObserver pause pattern:**

```tsx
const [canvasRef, isInView] = useInView({ threshold: 0.01 });
const isInViewRef = useRef(isInView);
useEffect(() => {
  isInViewRef.current = isInView;
}, [isInView]);

const render = () => {
  if (!isInViewRef.current) {
    animationFrameId = requestAnimationFrame(render);
    return; // skip frame — don't draw
  }
  // drawing code
};
```

---

## Theme System

- **Default:** Dark mode for new visitors (see Decision D-001)
- **Storage:** `localStorage` key `"theme"` — value `"light"` or absent (dark)
- **DOM:** `document.documentElement.classList` — `"dark"` class present for dark mode
- **Toggle:** `ThemeToggle.tsx` — dispatches `"themechange"` custom event after toggle (for canvas reinitialization)
- **Tailwind:** Dark mode variant via `dark:` prefix

---

## Key Custom Hooks

### `useInView(options)`

Returns `[ref, isInView]`. Used for canvas render loop pausing and Framer Motion `viewport` alternatives.

### `useStickyHorizontalScroll(wrapperRef, trackRef, options)`

Native-sticky horizontal scroll. Used in `StudioShowreel`. Converts vertical scroll to horizontal translation via GSAP, with browser compositor handling the vertical stick (no GSAP pin). Eliminates jitter on mobile.

### `useTextSplit`

Character/word splitting for text animation.

---

## SEO Component (React 19 Document Metadata)

`src/components/SEO.tsx` renders `<title>`, `<meta>`, `<link>`, and `<script type="application/ld+json">` elements. React 19 hoists these to `<head>` automatically regardless of where `<SEO>` appears in the component tree.

Usage pattern — first child in every route component:

```tsx
function CaseStudy() {
  return (
    <div>
      <SEO title="Project — Orvion.co" description="..." canonical="https://orvion.co/..." schema={...} />
      {/* page content */}
    </div>
  );
}
```

---

## Contact Form Architecture

`contact.tsx` — no backend. On submit:

1. Builds formatted email body from form data
2. Detects visitor's email provider from their address
3. Opens pre-filled compose window in detected provider (Gmail/Outlook/Yahoo/mailto)
4. Shows "Your message is ready" panel with all provider options + clipboard fallback

Key utility: `src/lib/mail.ts` — `buildMailUrls()`, `pickCompose()`, `openCompose()`

---

## Performance Considerations

- `LazyVideo` — videos not loaded until near viewport (`IntersectionObserver`)
- Canvas render loops paused when off-screen (`isInViewRef` pattern)
- `document.fonts.ready` — CinematicHero reinitializes particles after fonts load (fixes fallback-font particle mis-shape on first paint)
- Images: `loading="lazy" decoding="async"` on all non-hero images
- GSAP `invalidateOnRefresh: true` on position-dependent ScrollTriggers
