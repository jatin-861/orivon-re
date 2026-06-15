import { Outlet, createRootRoute, ScrollRestoration } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { NotFoundPage } from "../components/NotFoundPage";
import { SiteBackground } from "../components/SiteBackground";
import { LenisProvider } from "../components/layout/LenisProvider";
import { Preloader } from "../components/layout/Preloader";
import { CustomCursor } from "../components/CustomCursor";
import { PageTransition } from "../components/PageTransition";

function NotFoundComponent() {
  return <NotFoundPage />;
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <LenisProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <CustomCursor />
      <Preloader />
      <ScrollRestoration />
      <SiteBackground />
      <SiteHeader />
      <main id="main-content" className="relative min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <SiteFooter />
    </LenisProvider>
  );
}
