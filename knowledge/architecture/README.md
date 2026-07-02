# Architecture Knowledge Files

Technical implementation reference for the Orvion.co portfolio repository.

| File | What it covers |
|---|---|
| [repository.md](repository.md) | Directory structure, all files in src/, path aliases, config files |
| [routing.md](routing.md) | TanStack Router patterns, route definitions, navigation, loader data |
| [frontend.md](frontend.md) | React 19, component hierarchy, GSAP, Framer Motion, canvas components, theme system |
| [seo.md](seo.md) | SEO.tsx component, static schemas in index.html, sitemap, llms.txt, OG image |

## How to use these files

Load only the file(s) relevant to your current task. For most tasks, `repository.md` is enough to orient you — read others on demand.

- Touching the nav, routes, or page transitions → `routing.md`
- Touching animations, canvas, or theme → `frontend.md`
- Touching schemas, meta tags, sitemap, or llms.txt → `seo.md`
- Everything else → `repository.md` for orientation, then read source files directly

For strategy (what to build), see [`NARRATIVE_ARCHITECTURE.md`](../NARRATIVE_ARCHITECTURE.md) and [`IMPLEMENTATION_BACKLOG.md`](../IMPLEMENTATION_BACKLOG.md).
