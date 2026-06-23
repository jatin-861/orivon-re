import React, { useEffect, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  // Hold the instance in state (not a ref) so the context value actually updates
  // once Lenis is constructed — consumers like PageTransition rely on useLenis()
  // returning the live instance to call scrollTo()/resize(). With a ref the value
  // stayed null forever, so Lenis never recomputed its scroll limit after a route
  // change and scrolling could feel stuck/desynced.
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: fall back to native scroll instead of smoothed momentum
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium momentum
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: false, // Prevent double-RAF syncing
    });

    setLenis(lenis);

    // Mobile browsers fire a resize event every time the address bar collapses/expands
    // mid-scroll. ScrollTrigger would otherwise treat that as a real viewport change and
    // re-run refresh()/re-pin on the spot, which is what produces the "vibrating" jump on
    // pinned/scrubbed sections while scrolling on a phone.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Synchronize Lenis scroll event with ScrollTrigger updates
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Keep Lenis's internal measurements aligned with ScrollTrigger after layout/refresh changes
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Sync GSAP ticker with Lenis requestAnimationFrame loop
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // Disable GSAP lag smoothing to avoid jerky synchronization
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger to align with the new setup
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
