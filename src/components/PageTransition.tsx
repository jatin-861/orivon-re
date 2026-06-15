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
      const tl = gsap.timeline({
        onComplete: () => {
          // Reset scroll to top before the new page mounts, so pinned/scroll-linked
          // sections on the new page don't start mid-progress and render blank
          lenis?.scrollTo(0, { immediate: true });
          window.scrollTo(0, 0);

          setCurrentPath(location.pathname);
          setDisplayChildren(children);

          // Animate curtain opening up
          const tlOut = gsap.timeline({
            onComplete: () => {
              // Recalculate Lenis dimensions and ScrollTrigger parameters on the new page
              lenis?.resize();
              ScrollTrigger.refresh();
            }
          });
          
          // Animate content scaling back up
          gsap.fromTo(contentRef.current, 
            { scale: 0.97, opacity: 0.6 }, 
            { scale: 1, opacity: 1, duration: 0.55, ease: "power3.out" }
          );

          tlOut
            .to(pathRef.current, {
              attr: { d: curveUpPath },
              duration: 0.45,
              ease: "power3.in",
            })
            .to(pathRef.current, {
              attr: { d: initialPath },
              duration: 0.2,
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
        .to(contentRef.current, {
          scale: 0.97,
          duration: 0.4,
          ease: "power3.inOut"
        }, 0)

        // Curtain slide down
        .to(pathRef.current, {
          attr: { d: curveDownPath },
          duration: 0.45,
          ease: "power3.inOut",
        }, 0)
        .to(pathRef.current, {
          attr: { d: flatCoverPath },
          duration: 0.2,
          ease: "power2.inOut",
        })
        
        // Brand wordmark reveal during cover hold
        .to(textRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power4.out"
        })
        .to(textRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 0.25,
          ease: "power3.in",
          delay: 0.15
        });

      // Clean up the curtain timeline if the component unmounts mid-transition
      return () => {
        tl.kill();
      };
    } else {
      setDisplayChildren(children);
    }
  }, [location.pathname, children, currentPath]);

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
          Saral x Jatin
        </div>
      </div>
      <div ref={contentRef} className="origin-center w-full min-h-screen">
        {displayChildren}
      </div>
    </>
  );
}

export default PageTransition;
