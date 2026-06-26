import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Options {
  /**
   * Build any extra scroll-linked animations (skew, parallax, per-panel
   * triggers) off the main horizontal tween. Runs inside the same gsap.context,
   * so anything created here is reverted automatically on cleanup.
   */
  onSetup?: (horizontalTween: gsap.core.Tween) => void;
  /** Called every scroll frame with the ScrollTrigger, e.g. to drop blur at high velocity. */
  onUpdate?: (self: ScrollTrigger) => void;
  /** Re-run when these change (e.g. the project list length). */
  deps?: unknown[];
}

/**
 * Cinematic vertical-scroll-drives-horizontal motion that is jiggle-free on
 * mobile — the whole point of this hook.
 *
 * Why not GSAP `pin: true`? On iOS Safari the browser (a) misreports/skips
 * touchmove scroll positions and (b) repaints the pinned transform a frame out
 * of sync with the compositor-thread scroll, so a JS-driven pin visibly shakes
 * up-and-down while held. GSAP's own fix for that is normalizeScroll(), which
 * scroll-jacks the touch thread and therefore fights Lenis — not an option here.
 *
 * Instead the vertical "hold" is done by native CSS `position: sticky` on the
 * inner element: the compositor pins it, so it physically cannot jitter. GSAP
 * only translates the track horizontally (a transform that, even if it lags a
 * frame, can never cause vertical movement). The outer wrapper is made tall
 * enough — `calc(100svh + horizontalDistance)` — to provide exactly the scroll
 * distance needed to pan the track end to end while the inner stays stuck.
 *
 * `svh` (small viewport height) is used everywhere so the address bar
 * collapsing/expanding never changes the geometry mid-scroll.
 */
export function useStickyHorizontalScroll(
  wrapperRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  { onSetup, onUpdate, deps = [] }: Options = {},
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    // Set the wrapper's scroll height to viewport + horizontal distance. Done in
    // refreshInit (before ScrollTrigger measures) so resizes recompute cleanly.
    // svh keeps it stable against the mobile address bar.
    const setHeight = () => {
      wrapper.style.height = `calc(100svh + ${getDistance()}px)`;
    };
    ScrollTrigger.addEventListener("refreshInit", setHeight);
    setHeight();

    const ctx = gsap.context(() => {
      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          // Wrapper height == 100svh + distance, so its full scrollable range
          // ("bottom bottom") is exactly `distance` — the track pans end to end
          // precisely while the sticky inner is held. No pin, no pinType, no
          // anticipatePin: nothing for the browser to mis-time on touch.
          end: "bottom bottom",
          scrub: true, // 1:1 with scroll position — no second easing layer over Lenis
          invalidateOnRefresh: true,
          onUpdate,
        },
      });

      onSetup?.(horizontalTween);
    }, wrapper);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", setHeight);
      ctx.revert();
      wrapper.style.height = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
