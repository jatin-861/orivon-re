import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { gsap } from "gsap";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // SVG paths for 100x100 viewport (preserveAspectRatio="none")
  const initialPath = "M 0 0 Q 50 0 100 0 L 100 0 Q 50 0 0 0 Z"; // Top flat collapsed
  const curveDownPath = "M 0 0 Q 50 120 100 0 L 100 100 Q 50 100 0 100 Z"; // Liquid wave dipping down
  const flatCoverPath = "M 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z"; // Flat cover (fully covering)
  const curveUpPath = "M 0 0 Q 50 0 100 0 L 100 0 Q 50 120 0 0 Z"; // Liquid wave lifting up

  useEffect(() => {
    if (location.pathname !== currentPath) {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentPath(location.pathname);
          setDisplayChildren(children);

          // Animate curtain opening up
          const tlOut = gsap.timeline();
          tlOut
            .to(pathRef.current, {
              attr: { d: curveUpPath },
              duration: 0.45,
              ease: "power2.in",
            })
            .to(pathRef.current, {
              attr: { d: initialPath },
              duration: 0.2,
              ease: "power1.out",
            })
            .set(overlayRef.current, { visibility: "hidden" });
        },
      });

      // Show overlay and animate curtain falling down
      tl.set(overlayRef.current, { visibility: "visible" })
        .set(pathRef.current, { attr: { d: initialPath } })
        .to(pathRef.current, {
          attr: { d: curveDownPath },
          duration: 0.45,
          ease: "power2.out",
        })
        .to(pathRef.current, {
          attr: { d: flatCoverPath },
          duration: 0.2,
          ease: "power1.in",
        });
    } else {
      setDisplayChildren(children);
    }
  }, [location.pathname, children, currentPath]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[99999]"
        style={{ visibility: "hidden" }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path ref={pathRef} d={initialPath} fill="var(--primary)" />
        </svg>
      </div>
      <div>{displayChildren}</div>
    </>
  );
}

export default PageTransition;
