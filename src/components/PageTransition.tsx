import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./layout/LenisProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const lenis = useLenis();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // SVG paths for 100x100 viewport (preserveAspectRatio="none")
  const initialPath = "M 0 0 Q 50 0 100 0 L 100 0 Q 50 0 0 0 Z"; // Top flat collapsed
  const curveDownPath = "M 0 0 Q 50 150 100 0 L 100 100 Q 50 100 0 100 Z"; // Liquid wave dipping down
  const flatCoverPath = "M 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z"; // Flat cover
  const curveUpPath = "M 0 0 Q 50 0 100 0 L 100 0 Q 50 150 0 0 Z"; // Liquid wave lifting up

  useEffect(() => {
    if (location.pathname !== currentPath) {
      // Reset scroll immediately. <Outlet/> swaps to the new route's content the
      // instant navigation starts (it subscribes directly to router state,
      // regardless of this component's "frozen" displayChildren below), so the
      // new page's pinned GSAP/ScrollTrigger sections mount and measure layout
      // right now — they must not see a stale, scrolled-down position.
      lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentPath(location.pathname);
          setDisplayChildren(children);

          // Animate curtain opening up
          const tlOut = gsap.timeline();

          // Animate content scaling back up. clearProps removes the inline transform
          // once settled — otherwise it lingers (even at scale 1) and turns this
          // element into the containing block for any position:fixed descendant
          // (GSAP ScrollTrigger pins, Radix dialogs/tooltips), anchoring them to
          // this box instead of the viewport.
          gsap.fromTo(
            contentRef.current,
            { scale: 0.97, opacity: 0.6 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.32,
              ease: "power3.out",
              clearProps: "transform",
            },
          );

          tlOut
            .to(pathRef.current, {
              attr: { d: curveUpPath },
              duration: 0.28,
              ease: "power3.in",
            })
            .to(pathRef.current, {
              attr: { d: initialPath },
              duration: 0.12,
              ease: "power2.out",
            })
            .set(overlayRef.current, { visibility: "hidden" });
        },
      });

      // Show overlay and animate curtain falling down
      tl.set(overlayRef.current, { visibility: "visible" })
        .set(pathRef.current, { attr: { d: initialPath } })
        .set(textRef.current, { opacity: 0, scale: 0.92, y: 15 })

        // Scale down the active page content slightly
        .to(
          contentRef.current,
          {
            scale: 0.97,
            duration: 0.25,
            ease: "power3.inOut",
          },
          0,
        )

        // Curtain slide down
        .to(
          pathRef.current,
          {
            attr: { d: curveDownPath },
            duration: 0.28,
            ease: "power3.inOut",
          },
          0,
        )
        .to(pathRef.current, {
          attr: { d: flatCoverPath },
          duration: 0.12,
          ease: "power2.inOut",
        })

        // Brand wordmark reveal during cover hold
        .to(textRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.26,
          ease: "power4.out",
        })
        .to(textRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 0.16,
          ease: "power3.in",
          delay: 0.08,
        });

      // Clean up the curtain timeline if the component unmounts mid-transition
      return () => {
        tl.kill();
      };
    } else {
      setDisplayChildren(children);
    }
  }, [location.pathname, children, currentPath]);

  // Recalculate Lenis's scroll limit and ScrollTrigger's pin geometry only after
  // the new page has actually committed to the DOM — doing it synchronously in
  // the gsap onComplete above measures the *previous* route's layout, since
  // React 18 batches the setDisplayChildren update instead of flushing it inline.
  useEffect(() => {
    lenis?.resize();
    ScrollTrigger.refresh();
  }, [displayChildren, lenis]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[99999] flex items-center justify-center"
        style={{ visibility: "hidden" }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path ref={pathRef} d={initialPath} fill="var(--secondary)" />
        </svg>
        <div
          ref={textRef}
          className="relative z-10 text-[var(--background)] font-serif font-normal text-5xl md:text-7xl tracking-[0.35em] uppercase select-none pointer-events-none pl-[0.35em]"
          style={{ opacity: 0 }}
        >
          Orvion.co
        </div>
      </div>
      <div ref={contentRef} className="origin-center w-full min-h-screen">
        {displayChildren}
      </div>
    </>
  );
}

export default PageTransition;
