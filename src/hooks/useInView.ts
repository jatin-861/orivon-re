import { useEffect, useState, useRef, RefObject } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView<T extends Element = HTMLCanvasElement>(
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      if (el && !triggerOnce) {
        observer.unobserve(el);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}
