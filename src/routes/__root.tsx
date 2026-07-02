import { Component, type ReactNode } from "react";
import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { NotFoundPage } from "../components/NotFoundPage";
import { SiteBackground } from "../components/SiteBackground";
import { LenisProvider } from "../components/layout/LenisProvider";
import { Preloader } from "../components/layout/Preloader";
import { CustomCursor } from "../components/CustomCursor";
import { PageTransition } from "../components/PageTransition";

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-muted-foreground">Something went wrong loading this page.</p>
          <Link to="/" className="text-primary underline text-sm">
            Back to home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <SiteBackground />
      <SiteHeader />
      <main id="main-content" className="relative min-h-screen">
        <AppErrorBoundary>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AppErrorBoundary>
      </main>
      <SiteFooter />
    </LenisProvider>
  );
}
