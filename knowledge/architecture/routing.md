# Routing Architecture
## TanStack Router patterns and conventions

---

## Router Version

`@tanstack/react-router` v1.168.0 with `@tanstack/router-plugin` for Vite codegen.

---

## File-Based Routes

Routes are defined in `src/routes/`. TanStack Router generates a typed route tree.

| File | Route | Pattern |
|---|---|---|
| `__root.tsx` | (all routes) | Root layout |
| `index.tsx` | `/` | Index route |
| `about.tsx` | `/about` | Static route |
| `work.index.tsx` | `/work` | Index route for nested `/work` |
| `work.$slug.tsx` | `/work/:slug` | Dynamic param route |
| `process.tsx` | `/process` | Static route |
| `pricing.tsx` | `/pricing` | Static route |
| `contact.tsx` | `/contact` | Static route |

---

## Route Definition Pattern

```tsx
// Static route
export const Route = createFileRoute("/about")({
  component: About,
});

// Dynamic param route with loader
export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  notFoundComponent: () => <div>Project not found</div>,
  component: CaseStudy,
});

// Access loader data inside component
function CaseStudy() {
  const p = Route.useLoaderData();
  // ...
}
```

---

## Navigation

**Internal links:** Always use `<Link to="..." />` — never `<a href="...">` for internal navigation.

```tsx
import { Link } from "@tanstack/react-router";

// Static route
<Link to="/contact">Get in touch</Link>

// Dynamic route with typed params
<Link to="/work/$slug" params={{ slug: p.slug }}>
  {p.title}
</Link>
```

**Programmatic navigation:** Use `useNavigate` hook.

---

## Active Route Detection

```tsx
import { useLocation } from "@tanstack/react-router";

const { pathname } = useLocation();
const isActive = pathname === "/about" || pathname.startsWith("/about/");
```

Used in `SiteHeader.tsx` for nav link active states.

---

## Root Layout

`src/routes/__root.tsx` wraps all routes with:

```
LenisProvider
  └── a[skip-to-content]
  └── CustomCursor
  └── Preloader
  └── SiteBackground
  └── SiteHeader
  └── main#main-content
       └── AppErrorBoundary
            └── PageTransition
                 └── Outlet   ← route component renders here
  └── SiteFooter
```

---

## Not Found Handling

- Root: `notFoundComponent: NotFoundComponent` on `createRootRoute` → renders `NotFoundPage`
- Project: `notFoundComponent` on `/work/$slug` route → renders inline not-found message

---

## Case Study Slugs

| Slug | Project |
|---|---|
| `neurodashboard` | NeuroDashboard — AI platform |
| `shade-ledger` | Shade Ledger — automated billing |
| `smart-parking` | Smart Parking Management System |
| `carbon-compass` | Carbon Compass |

Slugs are defined in `src/data/projects.ts` PROJECTS array. Adding a new project requires adding a new entry there — no new route file needed.
