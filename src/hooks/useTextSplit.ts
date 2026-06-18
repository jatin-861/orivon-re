import { useEffect, useRef, RefObject } from "react";

interface UseTextSplitOptions {
  type?: "words" | "chars" | "both";
  className?: string;
}

export function useTextSplit(
  options: UseTextSplitOptions = {},
): [RefObject<HTMLElement | null>, RefObject<HTMLElement[]>] {
  const { type = "words", className = "" } = options;
  const containerRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const originalHTML = container.innerHTML;
    const text = container.textContent || "";
    elementsRef.current = [];

    if (type === "words") {
      const words = text.split(/\s+/);
      container.innerHTML = words
        .map((word: string) => `<span class="${className} split-word inline-block">${word}</span>`)
        .join(" ");
      elementsRef.current = Array.from(container.querySelectorAll(".split-word"));
    } else if (type === "chars") {
      const chars = text.split("");
      container.innerHTML = chars
        .map((char: string) => {
          if (char === " ") return " ";
          return `<span class="${className} split-char inline-block">${char}</span>`;
        })
        .join("");
      elementsRef.current = Array.from(container.querySelectorAll(".split-char"));
    } else if (type === "both") {
      const words = text.split(/\s+/);
      container.innerHTML = words
        .map((word: string) => {
          const chars = word
            .split("")
            .map(
              (char: string) => `<span class="${className} split-char inline-block">${char}</span>`,
            )
            .join("");
          return `<span class="split-word inline-block" style="white-space: nowrap;">${chars}</span>`;
        })
        .join(" ");
      elementsRef.current = Array.from(container.querySelectorAll(".split-char"));
    }

    return () => {
      container.innerHTML = originalHTML;
    };
  }, [type, className]);

  return [containerRef, elementsRef];
}
