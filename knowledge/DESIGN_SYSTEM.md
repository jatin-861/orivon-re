# Design System

## Accepted visual and interaction decisions

---

## Typography

Three typefaces, each with a distinct role:

| Typeface        | CSS class      | Use                                                  |
| --------------- | -------------- | ---------------------------------------------------- |
| Bodoni Moda     | `font-serif`   | Display headlines, editorial hierarchy, hero text    |
| Cabinet Grotesk | `font-display` | Bold functional text, project titles, large numerals |
| JetBrains Mono  | `font-mono`    | Code, labels, overlines, technical metadata          |

Font loading: Google Fonts via `<link>` in `index.html`. Includes:

- `Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900`
- `Cabinet+Grotesk:wght@400;500;700;800;900`
- `JetBrains+Mono:wght@400;500`

**Typography hierarchy:**

- Page H1: `font-serif text-4xl sm:text-6xl md:text-9xl font-normal` (RevealText component)
- Section H2: `font-serif text-4xl md:text-7xl font-normal`
- Card H3: `font-serif text-2xl font-normal` or `font-display text-2xl font-bold`
- Body: `font-sans text-base` or `text-sm`
- Overline: `font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand-pink)]`

---

## Color System

### Brand tokens (CSS custom properties)

| Token              | Hex                       | Usage                                          |
| ------------------ | ------------------------- | ---------------------------------------------- |
| `--brand-pink`     | `#C75B3A`                 | Primary accent, CTAs, active states, overlines |
| `--brand-teal`     | (not hardcoded — see CSS) | Secondary accent                               |
| `--brand-lavender` | (see CSS)                 | Process step accent                            |
| `--brand-peach`    | `#D4845A`                 | Warm secondary                                 |
| `--brand-ochre`    | `#8B5E3C`                 | Shade Ledger project color                     |
| `--brand-coral`    | (see CSS)                 | Process step accent                            |

Note: "brand-pink" is actually a burnt terracotta/coral — `#C75B3A`. The CSS variable name is historical.

### Dark mode palette (default)

- Background: `#0C0C0C` (deep charcoal, referenced in og-image generation)
- Card background: `var(--card)`
- Foreground: `#FAF7F2` (warm cream)
- Muted foreground: dimmed cream

### Light mode

Available as user preference. Not default. Inverts the dark palette.

### Tailwind CSS v4

- Version: 4.2.1
- Plugin: `@tailwindcss/vite` — no `tailwind.config.js`
- CSS variables used for brand tokens (not Tailwind config extension)

### Shadows and glows

- `shadow-elegant` — card elevation
- `shadow-glow-cyan` — primary button glow (cyan accent)
- `shadow-glow-cyan` is used on all primary CTAs (Get in touch, View Projects)

---

## Spacing

- Section vertical padding: `py-24` to `py-40` (varies by section density)
- Container max-widths: `max-w-7xl` (full layouts), `max-w-6xl` (content-heavy), `max-w-5xl` (focused), `max-w-4xl` (testimonials, stats)
- Horizontal padding: `px-6` (base), `sm:px-12` (hero)
- Grid gaps: `gap-8` to `gap-16`

---

## Animation

### Two animation systems

**GSAP (^3.15.0)** — scroll-driven animations

- `gsap.registerPlugin(ScrollTrigger)` — registered per-component in `typeof window !== "undefined"` guard
- Used for: RevealText entrance, progress lines (process, about timeline), parallax, hero particle canvas, BigCTA kinetic text
- ScrollTrigger cleanup: always via `ctx.revert()` in `useEffect` return

**Framer Motion (^12.38.0)** — component-level transitions

- Used for: page entry (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`), card hover, pricing card entrance, work cards
- `viewport={{ once: true }}` on all scroll-triggered Framer animations

### Animation principles

1. Entrance animations use `once: true` — don't replay on scroll-back
2. Scroll-scrub animations use `scrub: true` — timeline-linked
3. GSAP context (`gsap.context()`) always used for cleanup in React components
4. Preloader runs for ~2.6 seconds on first visit; `delayBase` coordinates hero animation entry
5. `prefers-reduced-motion` — partially implemented (open gap in P3 backlog)

### Smooth scroll

Lenis (^1.3.3) — wraps the entire app via `LenisProvider`. Provides smooth inertial scrolling. Coordinates with GSAP ScrollTrigger via Lenis's `requestAnimationFrame` integration.

---

## Layout Components

### SiteBackground

`src/components/SiteBackground.tsx` — renders the `bg-aurora` gradient and any persistent background elements behind all content.

### InteractiveParticles2D / InteractiveGrid2D

Canvas-based interactive backgrounds used on select pages. Render loop pauses when out of viewport (`isInView` hook).

### CustomCursor

`src/components/CustomCursor.tsx` — custom cursor with `data-cursor-text` attribute support. Sections can set custom cursor labels (e.g., `data-cursor-text="STATS"` on the Numbers section).

---

## Component Patterns

### SpotlightCard

Wrapper that adds a radial gradient spotlight that follows mouse position. Used heavily for cards and bento grid items.

### BentoTilt

Wrapper that adds 3D tilt on mouse hover. Wraps `SpotlightCard` in most instances.

### RevealText

Character-by-character reveal animation via GSAP. Used for page H1 elements. Takes `text`, `as` (HTML element), `className`, `delay` (ms).

### MagneticButton

Button with a subtle magnetic pull toward the cursor. Used for primary CTAs (BigCTA, hero CTA).

### AnimatedDock

macOS-style dock used in the footer. Contains GitHub + email links.

### Marquee

Infinite looping marquee. Used for SkillsMarquee and ScrollingTicker.

### LazyVideo

`IntersectionObserver`-based video loader. Delays video loading until the element is near the viewport.

---

## Dark Mode Implementation

**Default:** Dark. See Decision D-001.

```html
<!-- index.html — before any CSS -->
<script>
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      if (theme !== "light") document.documentElement.classList.add("dark");
    } catch (e) {
      document.documentElement.classList.add("dark");
    }
  })();
</script>
```

**Toggle:** `ThemeToggle.tsx` — toggles `dark` class on `document.documentElement` and writes to `localStorage`.

**Icon initialization:** Lazy `useState` — reads DOM synchronously to avoid Sun→Moon flash (see Decision D-011).

**Particle canvas:** Checks `document.documentElement.classList.contains("dark")` for particle color palette. Listens for custom `themechange` event to reinitialize.

---

## Accessibility

- Skip-to-content link: `<a href="#main-content" class="sr-only focus:not-sr-only ...">` in `__root.tsx`
- Main content ID: `id="main-content"` on `<main>` in `__root.tsx`
- Canvas elements: `aria-hidden="true"` (particle canvases are decorative)
- SR-only H1 in `CinematicHero.tsx` — canvas text is invisible to screen readers; a `class="sr-only"` H1 provides the accessible headline
- Focus rings: `focus-visible:ring-2 focus-visible:ring-primary` on all interactive elements
- `alt` text on all `<img>` elements

---

## Cross-references

- Voice and copy decisions → [`BRAND_GUIDE.md`](BRAND_GUIDE.md)
- Animation bug patterns → [`ENGINEERING_GUIDELINES.md`](ENGINEERING_GUIDELINES.md)
- Homepage section layout → [`NARRATIVE_ARCHITECTURE.md`](NARRATIVE_ARCHITECTURE.md)
