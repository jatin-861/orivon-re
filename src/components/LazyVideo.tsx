import { useInView } from "@/hooks/useInView";

export function LazyVideo({ src, className }: { src: string; className?: string }) {
  const [ref, isInView] = useInView<HTMLVideoElement>({
    rootMargin: "200px",
    triggerOnce: true,
  });

  return (
    <video
      ref={ref}
      src={isInView ? src : undefined}
      preload="none"
      autoPlay={isInView}
      loop
      muted
      playsInline
      className={className}
    />
  );
}
