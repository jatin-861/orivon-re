import { useEffect, type RefObject } from "react";

interface Options {
  /** Click-and-drag scrolling — only meaningful for mouse users; touch already drags natively. */
  enableDrag: boolean;
  fastScrollPxPerSec?: number;
  /** Called with true while scrolling fast, false once it settles — used to drop backdrop-filter. */
  onFastScrollChange?: (fast: boolean) => void;
}

/**
 * Manual (non-scroll-jacked) horizontal carousel behavior shared by ScrollStoryHorizontal
 * and StudioShowreel: native overflow-x-auto handles the actual scrolling, this just adds
 * mouse drag-to-scroll and the fast-scroll blur mitigation on top.
 */
export function useHorizontalScrollCarousel(
  scrollerRef: RefObject<HTMLElement | null>,
  { enableDrag, fastScrollPxPerSec = 900, onFastScrollChange }: Options,
) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !onFastScrollChange) return;

    let lastX = scroller.scrollLeft;
    let lastT = performance.now();
    let resumeTimeout: number;

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const velocity = Math.abs(scroller.scrollLeft - lastX) / (dt / 1000);
        if (velocity > fastScrollPxPerSec) onFastScrollChange(true);
      }
      lastX = scroller.scrollLeft;
      lastT = now;
      clearTimeout(resumeTimeout);
      resumeTimeout = window.setTimeout(() => onFastScrollChange(false), 150);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(resumeTimeout);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [scrollerRef, fastScrollPxPerSec, onFastScrollChange]);

  useEffect(() => {
    if (!enableDrag) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      // CSS scroll-snap-mandatory actively corrects scrollLeft writes back toward
      // the nearest snap point in real time, fighting every set we make mid-drag.
      // Disabling it for the drag's duration and restoring it on release lets the
      // browser's own native snap settle the position naturally once you let go.
      scroller.style.scrollSnapType = "none";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) dragged = true;
      scroller.scrollLeft = startScroll - dx;
    };
    const onPointerUp = () => {
      isDown = false;
      scroller.style.scrollSnapType = "";
    };
    // a drag ending over a link/button shouldn't also fire its click
    const onClickCapture = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    scroller.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    scroller.addEventListener("click", onClickCapture, true);
    return () => {
      scroller.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      scroller.removeEventListener("click", onClickCapture, true);
    };
  }, [scrollerRef, enableDrag]);
}
