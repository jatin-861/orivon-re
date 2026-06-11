import { Outlet, createRootRoute, ScrollRestoration, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { NotFoundOrivon } from "../components/NotFoundOrivon";
import { SiteBackground } from "../components/SiteBackground";
import { LenisProvider } from "../components/layout/LenisProvider";
import { Preloader } from "../components/layout/Preloader";
import { CustomCursor } from "../components/CustomCursor";
import { PageTransition } from "../components/PageTransition";

function NotFoundComponent() {
  return <NotFoundOrivon />;
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useLocation();

  return (
    <LenisProvider>
      <CustomCursor />
      <Preloader />
      <ScrollRestoration />
      <SiteBackground />
      <SiteHeader />
      <main className="relative min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <SiteFooter />
    </LenisProvider>
  );
}
