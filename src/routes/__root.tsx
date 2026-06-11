import { Outlet, createRootRoute, ScrollRestoration, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { NotFoundOrivon } from "../components/NotFoundOrivon";
import { SiteBackground } from "../components/SiteBackground";
import { LenisProvider } from "../components/layout/LenisProvider";
import { Preloader } from "../components/layout/Preloader";
import { motion, AnimatePresence } from "framer-motion";

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
      <Preloader />
      <ScrollRestoration />
      <SiteBackground />
      <SiteHeader />
      <main className="relative min-h-screen">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </LenisProvider>
  );
}
