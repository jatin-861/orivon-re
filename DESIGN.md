---
name: Orivon
description: Stark off-white gallery & desaturated accent tokens
colors:
  primary: "#111111"
  secondary: "#e03d67"
  accent: "#1a5b5c"
  neutral-bg: "#ffffff"
  muted: "#f5ede9"
  border: "#ebe4e0"
typography:
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(3.5rem, 8vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Cabinet Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral-bg}"
---

# Design System: Orivon

## 1. Overview

**Creative North Star: "The Stark Editorial Gallery"**

Orivon is a visual showcase that rejects standard tech-startup templates and generic 3D meshes in favor of classical typographic grids, tactile interfaces, and meaningful visual storytelling. Spacing is generous, mimicking physical art galleries where white space allows the content to breathe. The system is light-first, utilizing off-white and cream linen backgrounds contrasted with high-fidelity graphite ink and vibrant solid accent highlights (lipstick crimson, forest teal, orchid mauve).

**Key Characteristics:**

- **Asymmetric Pacing:** Offsets grids and uneven column divisions establish reading direction and interest.
- **Material Tactility:** Transitions are driven by active-press scaling (`scale(0.97)`), physical button clicks, and subtle spring micro-animations.
- **Operational Warmth:** Copy is concrete, conversational, and direct, supported by physical addresses and hours.

## 2. Colors

The color palette consists of high-contrast solid tones that avoid gradients or artificial glows.

### Primary

- **Graphite Ink** (#111111): Used for body text, primary interface elements, and high-contrast button surfaces.

### Secondary

- **Lipstick Crimson** (#e03d67): The primary accent color for active states, highlighting, and key interactive CTAs.

### Neutral

- **Gallery White** (#ffffff): Root page background for light mode.
- **Warm Linen** (#fbf9f6): Background surface for dark mode.
- **Soft Oat** (#f5ede9): Used for borders, divider hairlines, and card containers.

### Named Rules

**The Singular Accent Rule.** Only one major accent color (e.g. Lipstick Crimson or Forest Teal) should dominate any given viewport. Accent colors must never compete.

## 3. Typography

**Display Font:** Bodoni Moda (with Georgia, serif fallback)
**Body Font:** Cabinet Grotesk (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with monospace fallback)

**Character:** A high-contrast pairing of a sharp, elegant Italian serif (Bodoni Moda) for headlines and a geometric grotesque (Cabinet Grotesk) for readable body text and structural navigation.

### Hierarchy

- **Display** (Light, clamp(3.5rem, 8vw, 7.5rem), leading-none): Large headlines, editorial statements, hero titles.
- **Headline** (Medium, text-4xl / text-5xl, leading-tight): Section headings, major categories.
- **Title** (Regular, text-xl / text-2xl, leading-snug): Subsection headings, cards, and milestones.
- **Body** (Regular, text-base, leading-relaxed, max-width 65ch): Paragraphs, descriptions, list copies.
- **Label** (Medium, text-xs, letter-spacing-widest, uppercase): Navigation items, buttons, metadata tags.

## 4. Elevation

The system is flat-by-default, relying on structural grid lines and background color shifts rather than stacked shadows or faux-3D elevation.

### Shadow Vocabulary

- **Elegant Ambient** (`box-shadow: 0 10px 30px -10px rgba(17, 17, 17, 0.05)`): Subtle ambient shadow applied only to interactive card containers.
- **Glow Highlight** (`box-shadow: 0 4px 12px rgba(224, 61, 103, 0.08)`): Active accent state outline shadow.

### Named Rules

- **The Flat Rest Rule:** Cards, inputs, and components sit flat on the linen surface. They only elevate slightly (`translateY(-2px)`) on mouse hover, unless active tilt is applied.
- **3D Mouse Tilt Rule:** Select interactive elements (such as `BentoCard` and the philosophy entrance image) may use dynamic 3D perspective tilts (`rotateX` and `rotateY` scale3d) of up to 5-15 degrees relative to cursor coordinates to enhance depth.
- **Storytelling Clip-path Scrub Rule:** Large layout backgrounds can transition using clip-path polygons mapped to GSAP ScrollTrigger scrubbing to reveal hidden layout layers on scroll.
- **Text Reveal Stagger Rule:** High-impact text blocks can split into lines and words, animating with stagger delays and 3D rotations from `translate3d(10px, 51px, -60px)` to simulate typography coming into focus.

## 5. Components

### Buttons

- **Shape:** Rounded full pill (rounded-full) or crisp rounded corners (rounded-lg).
- **Primary:** Graphite Ink background with Gallery White text. Full press scale feedback (`scale(0.97)`).
- **Secondary / Ghost:** Transparent background with Graphite Ink border and text.

### Cards / Containers

- **Corner Style:** Medium radius (12px / rounded-xl).
- **Background:** Soft Oat (#f5ede9) or Gallery White (#ffffff).
- **Shadow:** Elegant Ambient.

### Navigation

- **Header Navigation:** Rendered on a single line at desktop. Height capped at 72px. Height transitions smoothly.

## 6. Do's and Don'ts

### Do:

- **Do** align headlines to the left or utilize asymmetric splits (e.g., 7/5 columns) instead of centered alignment.
- **Do** ensure all text buttons scale down to `scale(0.97)` on click to provide tactile physical response.
- **Do** use simple, authentic photographic assets of people or physical design objects rather than abstract 3D models or gradient meshes.

### Don't:

- **Don't** use neon purple/blue AI gradient glows or text gradients.
- **Don't** stack multiple same-sized features cards or repeat same-column zigzags more than twice.
- **Don't** place uppercase letter eyebrows above every section heading; keep them to at most one per three sections.
- **Don't** let CTA button text wrap to multiple lines on desktop.
